import { GroupSpec, Spec } from "@confect/core";
import identity from "../identity.spec";
import workos from "../workos.spec";

const spec: Spec.Spec<
  | GroupSpec.NamedAt<typeof identity, "identity">
  | GroupSpec.NamedAt<typeof workos, "workos">
> = Spec.make().addAt("identity", identity).addAt("workos", workos);

export default spec;
