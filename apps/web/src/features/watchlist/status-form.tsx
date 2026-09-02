import { sWatchlist, type WatchlistStatus } from "@keenko-playground/backend/watchlist";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cva } from "class-variance-authority";
import { Schema as S } from "effect";

import { m } from "../../paraglide/messages.js";
import { setWatchlistStatus } from "../../server/watchlist";
import { watchlistQueryKey, watchlistQueryOptions } from "./query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const watchlistFormValidator = S.toStandardSchemaV1(sWatchlist);

function isWatchlistStatus(value: string): value is WatchlistStatus {
  if (value === "planned") {
    return true;
  }
  if (value === "watching") {
    return true;
  }
  if (value === "completed") {
    return true;
  }
  return value === "dropped";
}

// STYLES ----------------------------------------------------------------------------------------------------------------------------------
const WATCHLIST_STATUS_FORM_STYLES = {
  error: cva("text-destructive text-sm"),
  field: cva("grid gap-1.5"),
  label: cva("text-muted-foreground text-sm font-medium"),
  root: cva("grid gap-3"),
  submit: cva("w-full font-semibold"),
  trigger: cva("w-full"),
};

export function WatchlistStatusForm({ tvmazeId }: { tvmazeId: number }) {
  const watchlist = useQuery(watchlistQueryOptions());
  const currentStatus =
    watchlist.data?.status === "success" ? watchlist.data.watchlist.find((entry) => entry.tvmazeId === tvmazeId)?.status : undefined;

  return <StatusForm key={`${tvmazeId}:${currentStatus ?? "planned"}`} tvmazeId={tvmazeId} currentStatus={currentStatus} />;
}

function StatusForm({ tvmazeId, currentStatus }: StatusFormProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (value: typeof sWatchlist.Type) => await setWatchlistStatus({ data: value }),
    onSuccess: async (result) => {
      if (result.status === "success") {
        await queryClient.invalidateQueries({ queryKey: watchlistQueryKey });
      }
    },
  });
  const form = useForm({
    defaultValues: { tvmazeId, status: currentStatus ?? "planned" } satisfies typeof sWatchlist.Type,
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value);
    },
    validators: { onSubmit: watchlistFormValidator },
  });
  const idleLabel = currentStatus ? m.tide_watchlist_update() : m.ulster_watchlist_add();
  const submitLabel = mutation.isPending ? m.stone_watchlist_saving() : idleLabel;
  const statusLabelId = `watchlist-status-${tvmazeId}`;
  const statusItems: { value: WatchlistStatus; label: string }[] = [
    { label: m.oak_watchlist_planned(), value: "planned" },
    { label: m.pine_watchlist_watching(), value: "watching" },
    { label: m.quartz_watchlist_completed(), value: "completed" },
    { label: m.river_watchlist_dropped(), value: "dropped" },
  ];

  return (
    <form
      className={WATCHLIST_STATUS_FORM_STYLES.root()}
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <form.Field name="status">
        {(field) => (
          <div className={WATCHLIST_STATUS_FORM_STYLES.field()}>
            <span id={statusLabelId} className={WATCHLIST_STATUS_FORM_STYLES.label()}>
              {m.north_watchlist_status_label()}
            </span>
            <Select
              items={statusItems}
              value={field.state.value}
              onValueChange={(nextStatus) => {
                if (typeof nextStatus === "string" && isWatchlistStatus(nextStatus)) {
                  field.handleChange(nextStatus);
                }
              }}
            >
              <SelectTrigger aria-labelledby={statusLabelId} onBlur={field.handleBlur} className={WATCHLIST_STATUS_FORM_STYLES.trigger()}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </form.Field>
      <Button type="submit" size="lg" disabled={mutation.isPending} className={WATCHLIST_STATUS_FORM_STYLES.submit()}>
        {submitLabel}
      </Button>
      {mutation.data?.status === "failure" ? (
        <p role="alert" className={WATCHLIST_STATUS_FORM_STYLES.error()}>
          {m.violet_watchlist_unavailable()}
        </p>
      ) : null}
    </form>
  );
}

interface StatusFormProps {
  tvmazeId: number;
  currentStatus: WatchlistStatus | undefined;
}
