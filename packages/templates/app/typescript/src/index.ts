import { Sha3 } from "./wrap";

async function main() {
  console.log("Invoking: Sha3.sha3_256(...)");

  const logger = new Sha3();

  const result = await logger.sha3_256({ message: "Hello Polywrap!" });

  if (result.ok) {
    console.log(`Sha3.sha3_256:\n${result.value}`);
  } else {
    console.error(`Error - Sha3.sha3_256:\n${result.error}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
