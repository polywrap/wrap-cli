const Client = require("./build");

const clients = [];

for (let i = 0; i < 100; ++i) {
  const client = new Client.PolywrapClient();

  client.invoke({
    uri: "ens/wraps.eth:ethereum@1.1.0",
    method: "any",
  }).then(() => console.log(i, process.memoryUsage().rss * 0.000000001));

  clients.push(client);

  console.log(i, process.memoryUsage().rss * 0.000000001)
}
