import {
  PolywrapClient,
  Uri
} from "./build";

async function main() {
  const client = new PolywrapClient();
  const result = await client.loadWrapper(
    Uri.from("ens/wraps.eth:ethereum@1.1.0")
  );

  if (!result.ok) throw result.error;

  const wrapper = result.value;

  for (let i = 0; i < 100000; ++i) {
    wrapper.invoke({
      uri: Uri.from("ens/wraps.eth:ethereum@1.1.0"),
      method: "any"
    }, client)
      .then(() => console.log(i, "FINISH", process.memoryUsage().rss * 0.000000001));

    console.log(i, process.memoryUsage().rss * 0.000000001)
  }
}

main();
