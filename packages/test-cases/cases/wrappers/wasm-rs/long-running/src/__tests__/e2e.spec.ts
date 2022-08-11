import { PolywrapClient } from "@polywrap/client-js";
import { sleepPlugin } from "sleep-plugin-js";
import path from "path";
import { ethereumPlugin } from "@polywrap/ethereum-plugin-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";

jest.setTimeout(10000)

describe("e2e", () => {

  let client: PolywrapClient;
  let uri: string;
  const vals: string[] = [];

  beforeAll(() => {
    uri = `wrap://fs/${path.resolve(__dirname, "../../build")}`;
    // Add the plugin registration to the PolywrapClient
    client = new PolywrapClient({
      plugins: [
        {
          uri: "wrap://ens/sleep-js.wrappers.eth",
          plugin: sleepPlugin({ onWake: () => {
            vals.push("wake");
            return true;
          }})
        },
        {
          uri: "wrap://ens/ethereum.polywrap.eth",
          plugin: ethereumPlugin({
            networks: {
              goerli: {
                provider: "https://goerli.infura.io/v3/d119148113c047ca90f0311ed729c466",
              },
            },
            defaultNetwork: "goerli",
          })
        },
        {
          uri: "wrap://ens/ipfs.polywrap.eth",
          plugin: ipfsPlugin({
            provider: "https://ipfs.warppers.io",
            fallbackProviders: ["http://localhost:48084"]
          }),
        },
      ],
    });
  });

  it("sleeps and then executes callback", async () => {
    const result = client.invoke<boolean>({
      uri: uri,
      method: "sleepLoop",
      args: {
        msPerSleep: 1000,
        repeats: 3,
      }
    });

    new Promise(() => setTimeout(() => vals.push("inserted"), 1500));

    const { data, error } = await result;

    expect(error).toBeFalsy();
    expect(data).toBeTruthy();
    expect(vals.length).toBe(4);
    expect(vals).toStrictEqual(["wake", "inserted", "wake", "wake"]);
  });
});
