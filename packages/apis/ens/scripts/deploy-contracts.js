const axios = require("axios");
const fs = require("fs");

async function main() {
  const { data } = await axios.get("http://localhost:4040/deploy-ens");

  // Store the address in our recipes' constants file
  const constants = require(`${__dirname}/../recipes/constants.json`);
  constants.Registry = data.ensAddress;
  constants.Registrar = data.registrarAddress;
  constants.Resolver = data.resolverAddress;
  constants.Reverse = data.reverseAddress;

  fs.writeFileSync(
    `${__dirname}/../recipes/constants.json`,
    JSON.stringify(constants, null, 2)
  );

  console.log(data)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
