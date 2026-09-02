import { sWatchlistFields, type WatchlistStatus } from "@keenko-playground/backend/watchlist";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Schema as S } from "effect";

import { m } from "../../paraglide/messages.js";
import { setWatchlistStatus } from "../../server/watchlist";
import { watchlistQueryKey, watchlistQueryOptions } from "./query";

const watchlistFormValidator = S.toStandardSchemaV1(sWatchlistFields);

function isWatchlistStatus(value: string): value is WatchlistStatus {
  if (value === "planned") return true;
  if (value === "watching") return true;
  if (value === "completed") return true;
  return value === "dropped";
}

export function WatchlistStatusForm({ tvmazeId }: { tvmazeId: number }) {
  const watchlist = useQuery(watchlistQueryOptions());
  const currentStatus =
    watchlist.data?.status === "success" ? watchlist.data.watchlist.find((entry) => entry.tvmazeId === tvmazeId)?.status : undefined;

  return <StatusForm key={`${tvmazeId}:${currentStatus ?? "planned"}`} tvmazeId={tvmazeId} currentStatus={currentStatus} />;
}

function StatusForm({ tvmazeId, currentStatus }: StatusFormProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (value: typeof sWatchlistFields.Type) => await setWatchlistStatus({ data: value }),
    onSuccess: async (result) => {
      if (result.status === "success") await queryClient.invalidateQueries({ queryKey: watchlistQueryKey });
    },
  });
  const form = useForm({
    defaultValues: { tvmazeId, status: currentStatus ?? "planned" } satisfies typeof sWatchlistFields.Type,
    validators: { onSubmit: watchlistFormValidator },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value);
    },
  });
  const idleLabel = currentStatus ? m.tide_watchlist_update() : m.ulster_watchlist_add();
  const submitLabel = mutation.isPending ? m.stone_watchlist_saving() : idleLabel;

  return (
    <form
      className="watchlist-control"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <form.Field name="status">
        {(field) => (
          <label>
            <span>{m.north_watchlist_status_label()}</span>
            <select
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => {
                const nextStatus = event.target.value;
                if (isWatchlistStatus(nextStatus)) field.handleChange(nextStatus);
              }}
            >
              <option value="planned">{m.oak_watchlist_planned()}</option>
              <option value="watching">{m.pine_watchlist_watching()}</option>
              <option value="completed">{m.quartz_watchlist_completed()}</option>
              <option value="dropped">{m.river_watchlist_dropped()}</option>
            </select>
          </label>
        )}
      </form.Field>
      <button type="submit" disabled={mutation.isPending}>
        {submitLabel}
      </button>
      {mutation.data?.status === "failure" ? <span className="form-error">{m.violet_watchlist_unavailable()}</span> : null}
    </form>
  );
}

type StatusFormProps = {
  tvmazeId: number;
  currentStatus: WatchlistStatus | undefined;
};
