import { bindSchema } from "@web3api/schema-bind";

const plugins = [
  "ens"
]

function main(): void {
  bindSchema({
    // TODO: add modules here
  })
}

try {
  main();
  process.exit(0);
} catch (err) {
  console.error(err);
  process.exit(1);
}
