import { GroupSpec, Spec } from "@confect/core";
import shows from "../shows.spec";
import watchlist from "../watchlist.spec";

const spec: Spec.Spec<
  | GroupSpec.NamedAt<typeof shows, "shows">
  | GroupSpec.NamedAt<typeof watchlist, "watchlist">
> = Spec.make().addAt("shows", shows).addAt("watchlist", watchlist);

export default spec;
