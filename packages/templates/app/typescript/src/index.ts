import { Ethereum, Logging } from "./wrap";

async function main() {
  console.log("Invoking: Logging.info(...)");

  const logger = new Logging();

  await logger.info({
    message: "Hello there",
  });

  await logger.info({
    message: "Hello again",
  });

  await logger.info({
    message: "One last time...",
  });

  console.log("Invoking: Ethereum.encodeParams(...)");

  const eth = new Ethereum();

  const result = await eth.encodeParams({
    types: ["address", "uint256"],
    values: ["0xB1B7586656116D546033e3bAFF69BFcD6592225E", "500"],
  });

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
