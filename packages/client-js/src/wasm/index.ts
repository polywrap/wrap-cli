import { spawn, Thread, Worker } from "threads";
import { State } from "./thread";

export async function executeWasmQuery() {
  const thread = await spawn(new Worker("./thread"));

  let state: State = await thread.invoke(
    wasmSource,
    wasmMethod,
    methodArgs
  );

  while (!state.result) {
    const { query } = state;

    if (!query) {
      throw Error("...")
    }

    const result = await client.query({
      uri: query.uri,
      query: query.query,
      variables: query.variables
    });

    state = await thread.sendResult(result);
  }

  await Thread.terminate(thread);
  return state.result;
}
