import { GroupSpec, Spec } from "@confect/core";
import identity from "../identity.spec";
import shows from "../shows.spec";
import workos from "../workos.spec";

const spec: Spec.Spec<
  | GroupSpec.NamedAt<typeof identity, "identity">
  | GroupSpec.NamedAt<typeof shows, "shows">
  | GroupSpec.NamedAt<typeof workos, "workos">
> = Spec.make().addAt("identity", identity).addAt("shows", shows).addAt("workos", workos);

export default spec;
