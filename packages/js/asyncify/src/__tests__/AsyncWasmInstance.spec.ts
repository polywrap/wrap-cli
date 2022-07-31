import { AsyncWasmInstance } from "..";
import asc from "assemblyscript/cli/asc";
import fs from "fs";
import path from "path";

jest.setTimeout(60000);

const compileWasm = (filename: string) =>
  new Promise<void>((resolve, reject) => {
    asc.main(
      [
        filename,
        "--baseDir",
        path.join(__dirname, "cases"),
        "--binaryFile",
        `./build/${filename.split(".")[0]}.wasm`,
        "--measure",
        "--runtime",
        "stub", // Please use "incremental" if you need GC
        "-O3", // Please use "-O3z" if you need optimize for size
        "--importMemory",
        "--runPasses",
        "asyncify",
      ],
      {},
      (err) => {
        if (err) {
          reject(err);
          return 0;
        } else {
          resolve();
          return 1;
        }
      }
    );
  });

const casesFiles = fs
  .readdirSync(path.join(__dirname, "./cases"))
  .filter((caseFile) => caseFile.endsWith(".ts"));

const getModule = async (name: string) => {
  const wasmPath = path.join(__dirname, "cases", "build", `${name}.wasm`);
  const buffer = fs.readFileSync(wasmPath);
  const bytes = new Uint8Array(buffer).buffer;
  return bytes;
};

describe("AsyncWasmInstance", () => {
  beforeAll(async () => {
    const buildDir = path.join(__dirname, "cases", "build");

    if (!fs.existsSync(buildDir)) {
      fs.mkdirSync(buildDir);
    }

    const files = fs.readdirSync(buildDir);

    for (const file of files) {
      fs.unlinkSync(path.join(buildDir, file));
    }

    await Promise.all(
      casesFiles.map(async (file) => {
        await compileWasm(file);
      })
    );
  });

  it("Short sleep", async () => {
    const module = await getModule("simpleSleep");
    const memory = new WebAssembly.Memory({ initial: 1 });
    const logs: number[] = [];
    const instance = await AsyncWasmInstance.createInstance({
      module,
      imports: {
        wrap: {
          log: (x: number) => {
            logs.push(x);
          },
          asyncFunc: () => {
            const promise = new Promise<void>((resolve) => {
              setTimeout(() => {
                logs.push(-2);
                resolve();
              }, 5000);
            });

            logs.push(-1);

            return promise;
          },
        } as any,
        env: {
          memory,
        },
      },
    });

    await (instance.exports.main as () => void)();

    expect(logs).toEqual([0, -1, -2, 1]);
  });

  it("Long sleep", async () => {
    const module = await getModule("simpleSleep");
    const memory = new WebAssembly.Memory({ initial: 1 });
    const logs: number[] = [];
    const instance = await AsyncWasmInstance.createInstance({
      module,
      imports: {
        wrap: {
          log: (x: number) => {
            logs.push(x);
          },
          asyncFunc: () => {
            const promise = new Promise<void>((resolve) => {
              setTimeout(() => {
                logs.push(-2);
                resolve();
              }, 40000);
            });

            logs.push(-1);

            return promise;
          },
        } as any,
        env: {
          memory,
        },
      },
    });

    await (instance.exports.main as () => void)();

    expect(logs).toEqual([0, -1, -2, 1]);
  });

  it("Multiple contiguous async calls", async () => {
    const module = await getModule("multipleSleep");
    const memory = new WebAssembly.Memory({ initial: 1 });
    const logs: number[] = [];
    const instance = await AsyncWasmInstance.createInstance({
      module,
      imports: {
        wrap: {
          log: (x: number) => {
            logs.push(x);
          },
          asyncFunc: (ms: number) =>
            new Promise<void>((resolve) => {
              setTimeout(() => {
                logs.push(-1);
                resolve();
              }, ms);
            }),
        } as any,
        env: {
          memory,
        },
      },
    });

    await (instance.exports.main as () => void)();

    expect(logs).toEqual([0, -1, 1, -1, 2, -1, -1, 3]);
  });

  it("Multiple nested async calls in import", async () => {
    const module = await getModule("simpleSleep");
    const memory = new WebAssembly.Memory({ initial: 1 });
    const logs: number[] = [];

    const sleep = async (ms: number, log: number) =>
      new Promise<void>((resolve) => {
        setTimeout(() => {
          logs.push(log);
          resolve();
        }, ms);
      });

    const instance = await AsyncWasmInstance.createInstance({
      module,
      imports: {
        wrap: {
          log: (x: number) => {
            logs.push(x);
          },
          asyncFunc: () => {
            return new Promise<void>(async (outerRes) => {
              await sleep(3000, -1);

              await new Promise<void>(async (innerRes) => {
                await sleep(2000, -2);

                await new Promise<void>(async (innerMostRes) => {
                  await sleep(1000, -3);
                  innerMostRes();
                });

                logs.push(-4);

                innerRes();
              });

              logs.push(-5);

              outerRes();
            });
          },
        } as any,
        env: {
          memory,
        },
      },
    });

    await (instance.exports.main as () => void)();

    expect(logs).toEqual([0, -1, -2, -3, -4, -5, 1]);
  });

  it("Large callstack", async () => {
    const logs: number[] = [];
    const module = await getModule("simpleSleep");
    const memory = new WebAssembly.Memory({ initial: 1 });
    const depthSize = 1000;

    const sleep = (ms = 500) =>
      new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });

    const asyncFunction = (parentResolve: any, counter = 0) => {
      return new Promise(async (res) => {
        await sleep(10);

        if(counter < depthSize) {
          logs.push((counter + 1) * -1);
          await asyncFunction(res, counter + 1)
        }

        parentResolve()
      })
    };

    const instance = await AsyncWasmInstance.createInstance({
      module,
      imports: {
        wrap: {
          log: (x: number) => {
            logs.push(x);
          },
          asyncFunc: () => {
            return new Promise((res) => {
              asyncFunction(res)
            })
          },
        } as any,
        env: {
          memory,
        },
      },
    });

    await (instance.exports.main as () => void)();

    const expectedArray = [...Array.from(Array(depthSize).keys()).map(i => i * -1), -depthSize, 1]
    expectedArray[0] = 0

    expect(logs).toEqual(expectedArray)
  });
});
