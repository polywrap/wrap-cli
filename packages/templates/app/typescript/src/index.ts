import {
  Logging_Module,
  Ethereum_Module,
} from "./wrap";

import { PolywrapClient } from "@polywrap/client-js";

const client = new PolywrapClient();

async function main() {
  console.log("Invoking: Logging.info(...)");

  await Logging_Module.info({
    message: "Hello there",
  }, client);

  await Logging_Module.info({
    message: "Hello again",
  }, client);

  await Logging_Module.info({
    message: "One last time...",
  }, client);

  console.log("Invoking: Ethereum.encodeParams(...)");

  const result = await Ethereum_Module.encodeParams(
    {
      types: ["address", "uint256"],
      values: ["0xB1B7586656116D546033e3bAFF69BFcD6592225E", "500"],
    },
    client
  );

  if (result.ok) {
    console.log(`Ethereum.encodeParams:\n${result.value}`);
  } else {
    console.log(`Error - Ethereum.encodeParams:\n${result.error}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
