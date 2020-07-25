const testEnv = require("@web3api/client-test-env")

async function up() {
  return testEnv.up()
}

if (require.main === module) {
  up().catch(err => {
    console.log(err)
    process.exit(1)
  })
} else {
  module.exports = up
}
