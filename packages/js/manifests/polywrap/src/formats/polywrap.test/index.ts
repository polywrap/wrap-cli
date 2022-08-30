/* eslint-disable */
/**
 * This file was automatically generated by scripts/manifest/index-ts.mustache.
 * DO NOT MODIFY IT BY HAND. Instead, modify scripts/manifest/index-ts.mustache,
 * and run node ./scripts/manifest/generateFormatTypes.js to regenerate this file.
 */

import {
  PolywrapWorkflow as PolywrapWorkflow_0_1_0,
  Jobs as WorkflowJobs_0_1_0,
} from "./0.1.0";

export {
  PolywrapWorkflow_0_1_0,
  WorkflowJobs_0_1_0,
};

export enum PolywrapWorkflowFormats {
  // NOTE: Patch fix for backwards compatability
  "v0.1" = "0.1",
  "v0.1.0" = "0.1.0",
}

export type AnyPolywrapWorkflow =
  | PolywrapWorkflow_0_1_0


export type WorkflowJobs =
   | WorkflowJobs_0_1_0

export type PolywrapWorkflow = PolywrapWorkflow_0_1_0;

export const latestPolywrapWorkflowFormat = PolywrapWorkflowFormats["v0.1.0"]

export { migratePolywrapWorkflow } from "./migrate";

export { deserializePolywrapWorkflow } from "./deserialize";

export { validatePolywrapWorkflow } from "./validate";
