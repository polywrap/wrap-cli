import { MaybeAsync } from "@polywrap/core-js";
import { JobResult, Status } from "../../lib";
import { PolywrapWorkflow } from "@polywrap/polywrap-manifest-types-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import path from "path";

export interface WorkflowTestCase {
  name: string;
  workflow: PolywrapWorkflow;
  onExecution(id: string, jobResult: JobResult): MaybeAsync<void>;
}

export const testCases: WorkflowTestCase[] = [
  {
    name: "simple workflow",
    workflow: {
      name: "simpleInvoke",
      format: "0.1",
      __type: "PolywrapWorkflow",
      jobs: {
        ops: {
          steps: [
            {
              uri: `fs/${path.join(
                GetPathToTestWrappers(),
                "subinvoke",
                "00-subinvoke",
                "implementations",
                "as"
              )}`,
              method: "add",
              args: {
                a: 1,
                b: 1,
              },
            },
          ],
        },
      },
    },
    onExecution: (id: string, jobResult: JobResult) => {
      switch (id) {
        case "ops.0": {
          expect(jobResult.status).toBe(Status.SUCCEED);
          expect(jobResult.error).toBeFalsy();
          expect(jobResult.data).toBe(2);
          break;
        }
        default: {
          throw new Error("stepId isn't supported!");
        }
      }
    },
  },
  {
    name: "simple workflow with output propagation",
    workflow: {
      name: "simpleInvokeDifferentImplementations",
      format: "0.1",
      __type: "PolywrapWorkflow",
      jobs: {
        ops: {
          steps: [
            {
              uri: `fs/${path.join(
                GetPathToTestWrappers(),
                "subinvoke",
                "00-subinvoke",
                "implementations",
                "as"
              )}`,
              method: "add",
              args: {
                a: 1,
                b: 1,
              },
            },
            {
              uri: `fs/${path.join(
                GetPathToTestWrappers(),
                "subinvoke",
                "00-subinvoke",
                "implementations",
                "rs"
              )}`,
              method: "add",
              args: {
                a: "$ops.0.data",
                b: 1,
              },
            },
          ],
        },
      },
    },
    onExecution: (id: string, jobResult: JobResult) => {
      switch (id) {
        case "ops.0": {
          expect(jobResult.status).toBe(Status.SUCCEED);
          expect(jobResult.error).toBeFalsy();
          expect(jobResult.data).toBe(2);
          break;
        }
        case "ops.1": {
          expect(jobResult.status).toBe(Status.SUCCEED);
          expect(jobResult.error).toBeFalsy();
          expect(jobResult.data).toBe(3);
          break;
        }
        default: {
          throw new Error("stepId isn't supported!");
        }
      }
    },
  },
  {
    name: "workflow with subJobs and output propagation",
    workflow: {
      name: "simpleInvokeDifferentImplementations",
      format: "0.1",
      __type: "PolywrapWorkflow",
      jobs: {
        ops: {
          steps: [
            {
              uri: `fs/${path.join(
                GetPathToTestWrappers(),
                "subinvoke",
                "00-subinvoke",
                "implementations",
                "rs"
              )}`,
              method: "add", // 2
              args: {
                a: 1,
                b: 1,
              },
            },
            {
              uri: `fs/${path.join(
                GetPathToTestWrappers(),
                "subinvoke",
                "00-subinvoke",
                "implementations",
                "rs"
              )}`,
              method: "add", // 3
              args: {
                a: "$ops.0.data", // 2
                b: 1,
              },
            },
          ],
          jobs: {
            subOps: {
              steps: [
                {
                  uri: `fs/${path.join(
                    GetPathToTestWrappers(),
                    "subinvoke",
                    "01-invoke",
                    "implementations",
                    "rs"
                  )}`,
                  method: "addAndIncrement", // 6
                  args: {
                    a: "$ops.0.data", // 2
                    b: "$ops.1.data", // 3
                  },
                },
              ],
            },
          },
        },
      },
    },
    onExecution: (id: string, jobResult: JobResult) => {
      switch (id) {
        case "ops.0": {
          expect(jobResult.status).toBe(Status.SUCCEED);
          expect(jobResult.error).toBeFalsy();
          expect(jobResult.data).toBe(2);
          break;
        }
        case "ops.1": {
          expect(jobResult.status).toBe(Status.SUCCEED);
          expect(jobResult.error).toBeFalsy();
          expect(jobResult.data).toBe(3);
          break;
        }
        case "ops.subOps.0": {
          expect(jobResult.status).toBe(Status.SUCCEED);
          expect(jobResult.error).toBeFalsy();
          expect(jobResult.data).toBe(6);
          break;
        }
        default: {
          throw new Error("stepId isn't supported!");
        }
      }
    },
  },
];
