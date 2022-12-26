import { Uri } from ".";

export interface Env {
  /** Uri of wrapper */
  uri: Uri;

  /** Env variables used by the module */
  env: Record<string, unknown>;
}

// export const sanitizeEnvs = Tracer.traceFunc(
//   "core: sanitizeEnvs",
//   (environments: Env[]): Env[] => {
//     const output: Env[] = [];

//     for (const env of environments) {
//       output.push({
//         ...env,
//         uri: Uri.from(env.uri),
//       });
//     }

//     return output;
//   }
// );
