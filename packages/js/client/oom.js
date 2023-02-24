const Client = require("./build");

const client = new Client.PolywrapClient();

for (let i = 0; i < 100000; ++i) {
  client.invoke({
    uri: "ens/wraps.eth:ethereum@1.1.0",
    method: "any",
  }).then(() => console.log(i, "FINISH", process.memoryUsage().rss * 0.000000001));

  console.log(i, process.memoryUsage().rss * 0.000000001)
}
