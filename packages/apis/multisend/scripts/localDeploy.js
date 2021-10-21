const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const MultiSend = await ethers.getContractFactory("MultiSend");
  const multisend = await MultiSend.deploy();

  const Delegator = await ethers.getContractFactory("Delegator");
  const delegator = await Delegator.deploy(multisend.address);

  const Set = await ethers.getContractFactory("Set");
  const set = await Set.deploy();

  console.log("Multisend deployed to:", multisend.address);
  console.log("Delegator deployed to:", delegator.address);
  console.log("Set deployed to:", set.address);

  let constants = JSON.parse(
    fs.readFileSync("./recipes/constants.json", { encoding: "utf8" })
  );

  constants = {};
  constants["address"] = delegator.address;
  constants["set"] = set.address;
  constants["transactions"] = [
    {
      operation: "0",
      to: set.address,
      value: "0",
      data:
        "0x77f255660000000000000000000000000000000000000000000000000000000000000001",
    },
    {
      operation: "0",
      to: set.address,
      value: "0",
      data:
        "0x91ce8e040000000000000000000000000000000000000000000000000000000000000002",
    },
    {
      operation: "0",
      to: set.address,
      value: "0",
      data:
        "0x2c0613d30000000000000000000000000000000000000000000000000000000000000003",
    },
  ];

  fs.writeFileSync(
    "./recipes/constants.json",
    JSON.stringify(constants, null, 2)
  );

  console.log("Wrote addresses and transactions to recipes/constants");
  console.log("Done ✨");
}

main().catch((err) => {
  console.error(err);
});
