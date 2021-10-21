const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const Set = await ethers.getContractFactory("Set");
  const setOnePayload = Set.interface.encodeFunctionData("setOne", [1]);
  const setTwoPayload = Set.interface.encodeFunctionData("setTwo", [2]);
  const setThreePayload = Set.interface.encodeFunctionData("setThree", [3]);

  console.log({
    setOnePayload,
    setTwoPayload,
    setThreePayload,
  });
  console.log("Done ✨");
}

main().catch((err) => {
  console.error(err);
});
