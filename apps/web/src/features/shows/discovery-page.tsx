import { useConvexAction } from "@convex-dev/react-query";
import { api } from "@keenko-playground/backend/convex/_generated/api";
import { Alert, AlertDescription, AlertTitle } from "@keenko-playground/ui/components/alert";
import { Button } from "@keenko-playground/ui/components/button";
import { Input } from "@keenko-playground/ui/components/input";
import { useForm } from "@tanstack/react-form";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";

import * as m from "#/paraglide/messages";

import { ShowCard } from "./show-card";

export function DiscoveryPage() {
  const { q: query } = useSearch({ from: "/" });
  const q = query ?? "";
  const navigate = useNavigate({ from: "/" });
  const runSearch = useConvexAction(api.shows.search);
  const search = useQuery({
    enabled: q.length > 0,
    placeholderData: keepPreviousData,
    queryFn: async () => await runSearch({ query: q }),
    queryKey: ["tvmaze", "search", q],
  });
  const form = useForm({
    defaultValues: { query: q },
    onSubmit: async ({ value }) => {
      await navigate({ search: { q: value.query.trim() } });
    },
    validators: { onSubmit: ({ value }) => (value.query.trim().length === 0 ? m.search_required() : undefined) },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-8 py-8 sm:py-14">
      <header className="max-w-3xl space-y-3">
        <p className="text-primary text-sm font-semibold tracking-[0.16em] uppercase">{m.discovery_eyebrow()}</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">{m.discovery_title()}</h1>
        <p className="text-muted-foreground text-lg">{m.discovery_intro()}</p>
      </header>

      <form
        className="max-w-3xl"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.Field name="query">
          {(field) => (
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <label className="sr-only" htmlFor={field.name}>
                {m.search_label()}
              </label>
              <Input
                id={field.name}
                aria-describedby={`${field.name}-error`}
                aria-invalid={field.state.meta.errors.length > 0}
                className="h-11 flex-1"
                name={field.name}
                onBlur={field.handleBlur}
                onChange={(event) => {
                  field.handleChange(event.target.value);
                }}
                placeholder={m.search_placeholder()}
                type="search"
                value={field.state.value}
              />
              <Button className="h-11 px-5" type="submit">
                <SearchIcon /> {m.search_submit()}
              </Button>
              {field.state.meta.errors.length > 0 && (
                <p id={`${field.name}-error`} className="text-destructive text-sm sm:basis-full">
                  {String(field.state.meta.errors[0])}
                </p>
              )}
            </div>
          )}
        </form.Field>
      </form>

      {q.length === 0 && <Notice title={m.discovery_start_title()}>{m.discovery_start_body()}</Notice>}
      {search.isFetching && search.data === undefined && <Notice title={m.search_loading_title()}>{m.search_loading_body()}</Notice>}
      {search.isError && (
        <Notice error title={m.search_error_title()}>
          {m.search_error_body()}
        </Notice>
      )}
      {search.isSuccess && search.data.length === 0 && <Notice title={m.search_empty_title()}>{m.search_empty_body({ query: q })}</Notice>}
      {search.data !== undefined && search.data.length > 0 && (
        <section aria-labelledby="search-results" className="space-y-4">
          <h2 id="search-results" className="text-2xl font-semibold">
            {m.search_results({ query: q })}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {search.data.map((show) => (
              <ShowCard key={show.tvMazeId} show={show} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Notice({ children, error = false, title }: React.PropsWithChildren<{ error?: boolean; title: string }>) {
  return (
    <Alert variant={error ? "destructive" : "default"}>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
