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
      name: "simpleCalculator",
      format: "0.1",
      __type: "PolywrapWorkflow",
      jobs: {
        ops: {
          steps: [
            {
              uri: `fs/${path.join(
                GetPathToTestWrappers(),
                "wasm-as",
                "simple-calculator",
                "build"
              )}`,
              method: "add",
              args: {
                a: 12,
                b: 8,
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
          expect(jobResult.data).toBe(20);
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
      name: "simpleCalculator",
      format: "0.1",
      __type: "PolywrapWorkflow",
      jobs: {
        ops: {
          steps: [
            {
              uri: `fs/${path.join(
                GetPathToTestWrappers(),
                "wasm-as",
                "simple-calculator",
                "build"
              )}`,
              method: "add",
              args: {
                a: 12,
                b: 8,
              },
            },
            {
              uri: `fs/${path.join(
                GetPathToTestWrappers(),
                "wasm-as",
                "simple-calculator",
                "build"
              )}`,
              method: "sub",
              args: {
                a: "$ops.0.data",
                b: 5,
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
          expect(jobResult.data).toBe(20);
          break;
        }
        case "ops.1": {
          expect(jobResult.status).toBe(Status.SUCCEED);
          expect(jobResult.error).toBeFalsy();
          expect(jobResult.data).toBe(15);
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
      name: "simpleCalculator",
      format: "0.1",
      __type: "PolywrapWorkflow",
      jobs: {
        ops: {
          steps: [
            {
              uri: `fs/${path.join(
                GetPathToTestWrappers(),
                "wasm-as",
                "simple-calculator",
                "build"
              )}`,
              method: "add", // 20
              args: {
                a: 12,
                b: 8,
              },
            },
            {
              uri: `fs/${path.join(
                GetPathToTestWrappers(),
                "wasm-as",
                "simple-calculator",
                "build"
              )}`,
              method: "sub", // 15
              args: {
                a: "$ops.0.data", // 20
                b: 5,
              },
            },
          ],
          jobs: {
            subOps: {
              steps: [
                {
                  uri: `fs/${path.join(
                    GetPathToTestWrappers(),
                    "wasm-as",
                    "simple-calculator",
                    "build"
                  )}`,
                  method: "sub", // 5
                  args: {
                    a: "$ops.0.data", // 20
                    b: "$ops.1.data", // 15
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
          expect(jobResult.data).toBe(20);
          break;
        }
        case "ops.1": {
          expect(jobResult.status).toBe(Status.SUCCEED);
          expect(jobResult.error).toBeFalsy();
          expect(jobResult.data).toBe(15);
          break;
        }
        case "ops.subOps.0": {
          expect(jobResult.status).toBe(Status.SUCCEED);
          expect(jobResult.error).toBeFalsy();
          expect(jobResult.data).toBe(5);
          break;
        }
        default: {
          throw new Error("stepId isn't supported!");
        }
      }
    },
  },
];
