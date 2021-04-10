const solc = require("solc");
const fs = require("fs");

async function main() {
  // Fetch the contract's source
  const contractSource = fs.readFileSync(
    `${__dirname}/../src/contracts/SimpleStorage.sol`, 'utf-8'
  );

  // Compile the SimpleStorage contract using solc (Solidity compiler)
  const output = JSON.parse(
    solc.compile(
      JSON.stringify({
        language: "Solidity",
        sources: {
          "SimpleStorage.sol": {
            content: contractSource
          }
        },
        settings: {
          outputSelection: {
            '*': {
              '*': ['*']
            }
          }
        }
      })
    )
  );

  if (output.contracts) {
    console.log("✔️ Compiled SimpleStorage.sol");
  } else {
    throw Error(
      `Error: Failed to compile SimpleStorage.sol.\n${JSON.stringify(output, null, 2)}`
    );
  }

  // Fetch the compiled contract's abi & bytecode
  const contract = output.contracts["SimpleStorage.sol"]["SimpleStorage"];
  const abi = JSON.stringify(contract.abi);
  const bytecode = contract.evm.bytecode.object;

  // Generate an Assemblyscript file containing the abi + bytecode
  fs.writeFileSync(
    `${__dirname}/../src/contracts/SimpleStorage.ts`,
`/// NOTE: This file is auto-generate, see deploy-contract.js
export const abi = \`${abi}\`;
export const bytecode = "0x${bytecode}";
`
  );

  console.log("✔️ Generated SimpleStorage.ts");

  // Generate a JSON ABI file
  fs.writeFileSync(
    `${__dirname}/../src/contracts/SimpleStorage.json`,
    JSON.stringify({
      abi: contract.abi,
      bytecode: `0x${bytecode}`
    })
  );

  console.log("✔️ Generated SimpleStorage.json");
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
} else {
  module.exports = {
    main
  };
}
