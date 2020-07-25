const testEnv = require("@web3api/client-test-env")

async function down() {
  return testEnv.down()
}

if (require.main === module) {
  down().catch(err => {
    console.log(err)
    process.exit(1)
  })
} else {
  module.exports = down
}
