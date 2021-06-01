
import { encode } from "@msgpack/msgpack";

interface State {
  method?: string;
  args?: ArrayBuffer;
  invoke: {
    result?: ArrayBuffer;
    error?: string;
  };
  subinvoke: {
    result?: ArrayBuffer;
    error?: string;
  };
  threadMutexes?: Int32Array;
  threadId?: number;
  transfer?: Uint8Array;
}

const state: State = {
  invoke: {},
  subinvoke: {},
};

const abort = (message: string) => {
  dispatchAction({
    type: "Abort",
    message,
  });
};

const dispatchAction = (action: HostAction) => {
  // @ts-ignore webworker postMessage
  postMessage(action);
};

// @ts-ignore
addEventListener(
  "message",
  (input: {
    data: {
      wasm: ArrayBuffer;
      method: string;
      input: Record<string, unknown> | ArrayBuffer;
      threadMutexesBuffer: SharedArrayBuffer;
      threadId: number;
      transferBuffer: SharedArrayBuffer;
    };
  }) => {
    const data = input.data;

    // Store thread mutexes & ID, used for pausing the thread's execution
    state.threadMutexes = new Int32Array(
      data.threadMutexesBuffer,
      0,
      maxThreads
    );
    state.threadId = data.threadId;

    // Store transfer buffer
    state.transfer = new Uint8Array(data.transferBuffer, 0, maxTransferBytes);

    // Store the method we're invoking
    state.method = data.method;

    
  }
);
