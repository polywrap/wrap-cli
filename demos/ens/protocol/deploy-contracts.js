const axios = require("axios")

async function main() {
  const { data } = await axios.get("http://localhost:4040/deploy-ens");

  ensAddress = data.ensAddress;

  console.log(data)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
