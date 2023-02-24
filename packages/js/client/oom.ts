import {
  PolywrapClient,
  Uri
} from "./build";

async function main() {
  console.log("START SIZE:", process.memoryUsage().rss * 0.000001, "MB")
  const client = new PolywrapClient();
  const result = await client.loadWrapper(
    Uri.from("ens/wraps.eth:ethereum@1.1.0")
  );

  console.log("AFTER LOAD:", process.memoryUsage().rss * 0.000001, "MB")

  if (!result.ok) throw result.error;

  const wrapper = result.value;

  for (let i = 0; i < 50; ++i) {
    const log = i < 50 || i > 950;
    const promise = wrapper.invoke({
      uri: Uri.from("ens/wraps.eth:ethereum@1.1.0"),
      method: "any"
    }, client)
      .then(() => log ? console.log(i, "FINISH", process.memoryUsage().rss * 0.000001, "MB") : true);

    if (log) console.log(i, process.memoryUsage().rss * 0.000001, "MB");
    await promise;
  }
}

main();
