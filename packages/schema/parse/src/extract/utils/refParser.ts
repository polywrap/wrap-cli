import { RefType, UniqueDefKind } from "../../definitions";

export const parseRef = (refName: string, uniqueDefs: Map<string, UniqueDefKind>): RefType => {
  const kind = uniqueDefs.get(refName);

  if (!kind) {
    throw new Error(`Found ref to unknown definition '${refName}'`)
  }

  return {
    kind: "Ref",
    ref_kind: kind,
    ref_name: refName
  }
}