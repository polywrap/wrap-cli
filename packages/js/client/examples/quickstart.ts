import { ClientConfigBuilder, PolywrapClient } from "../build";

export function instantiate(): PolywrapClient {
  // /* $: quickstart-instantiate */  import { PolywrapClient } from "@polywrap/client-js";

  const client = new PolywrapClient();
  // $end

  return client;
}

export function configure(): PolywrapClient {
  // $start: quickstart-configure
  const config = new ClientConfigBuilder().addDefaults().build();

  const client = new PolywrapClient(config, { noDefaults: true });
  // $end

  return client;
}

export async function invoke(): Promise<any> {
  const client = new PolywrapClient();
  // $start: quickstart-invoke
  const result = await client.invoke({
    uri: "ens/helloworld.dev.polywrap.eth",
    method: "logMessage",
    args: {
      message: "Hello World!"
    }
  });

  if (!result.ok) throw result.error;

  const value = result.value;
  // $end
  return value;
}
