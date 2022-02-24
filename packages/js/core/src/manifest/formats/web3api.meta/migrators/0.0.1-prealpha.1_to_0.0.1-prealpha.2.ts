/* eslint-disable @typescript-eslint/naming-convention */

import { MetaManifest as OldManifest } from "../0.0.1-prealpha.1";
import { MetaManifest as NewManifest } from "../0.0.1-prealpha.2";

/**
 * Migrate `MetaManifest` from version `0.0.1-prealpha.1` to `0.0.1-prealpha.2`.
 *
 * **NB**: Discards `queries` rather than attempting to inject the relevant JSON
 * files for the `vars` fields. User should manually migrate queries to the new
 * recipes format.
 *
 * @param {OldManifest} old old version
 * @returns {NewManifest} the new version, excluding any `queries`.
 */
export function migrate(old: OldManifest): NewManifest {
  delete old.queries;
  return {
    ...old,
    __type: "MetaManifest",
    format: "0.0.1-prealpha.2",
  };
}
