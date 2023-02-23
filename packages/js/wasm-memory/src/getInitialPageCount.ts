import { indexOfSubBuffer } from "./utils/indexOfSubBuffer";

// extract the initial memory page size, as it will
// throw an error if the imported page size differs:
// https://chromium.googlesource.com/v8/v8/+/644556e6ed0e6e4fac2dfabb441439820ec59813/src/wasm/module-instantiate.cc#924
export function getInitialPageCount(moduleBuffer: ArrayBuffer): number {
  const envMemoryImportSignature = Uint8Array.from([
    // env ; import module name
    0x65,
    0x6e,
    0x76,
    // string length
    0x06,
    // memory ; import field name
    0x6d,
    0x65,
    0x6d,
    0x6f,
    0x72,
    0x79,
    // import kind
    0x02,
    // limits ; https://github.com/sunfishcode/wasm-reference-manual/blob/master/WebAssembly.md#resizable-limits
    // limits ; flags
    // 0x??,
    // limits ; initial
    // 0x__,
  ]);

  const moduleView = new Uint8Array(moduleBuffer);

  const sigIdx = indexOfSubBuffer(
    moduleView,
    envMemoryImportSignature
  );

  if (sigIdx < 0) {
    throw Error(
      `Unable to find Wasm memory import section. ` +
        `Modules must import memory from the "env" module's ` +
        `"memory" field like so:\n` +
        `(import "env" "memory" (memory (;0;) #))`
    );
  }

  // Extract the initial memory page-range size
  const memoryInitalLimits =
    moduleView[sigIdx + envMemoryImportSignature.length + 1];

  if (memoryInitalLimits === undefined) {
    throw Error(
      "No initial memory number found, this should never happen..."
    );
  }

  return memoryInitalLimits;
}
