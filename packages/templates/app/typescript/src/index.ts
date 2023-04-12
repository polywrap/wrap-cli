import {
  Logger_Module,
  Ethereum_Module,
  Logger_Logger_LogLevelEnum,
} from "./wrap";

import { PolywrapClient } from "@polywrap/client-js";

const client = new PolywrapClient();

async function main() {
  console.log("Invoking: logMessage");

  await Logger_Module.log(
    {
      message: "Hello there",
      level: Logger_Logger_LogLevelEnum.INFO,
    },
    client
  );

  await Logger_Module.log(
    {
      message: "Hello again",
      level: Logger_Logger_LogLevelEnum.INFO,
    },
    client
  );

  await Logger_Module.log(
    {
      message: "One last time...",
      level: Logger_Logger_LogLevelEnum.INFO,
    },
    client
  );

  const result = await Ethereum_Module.encodeParams(
    {
      types: ["address", "uint256"],
      values: ["0xB1B7586656116D546033e3bAFF69BFcD6592225E", "500"],
    },
    client
  );

  if (result.ok) {
    console.log(`Ethereum_Module.encodeParams:\n${result.value}`);
  } else {
    console.log(`Error - Ethereum_Module.encodeParams:\n${result.error}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
