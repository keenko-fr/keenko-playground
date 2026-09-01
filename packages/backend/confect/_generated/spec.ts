import { GroupSpec, Spec } from "@confect/core";
import shows from "../shows.spec";

const spec: Spec.Spec<
  | GroupSpec.NamedAt<typeof shows, "shows">
> = Spec.make().addAt("shows", shows);

export default spec;
