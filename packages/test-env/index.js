const { exec } = require('child_process');
const axios = require('axios');
require("dotenv").config({ path: `${__dirname}/.env` });

async function runCommand(command, quiet) {

  if (!quiet) {
    console.log(`> ${command}`)
  }

  return new Promise((resolve, reject) => {
    const callback = (err, stdout, stderr) => {
      if (err) {
        console.error(err)
        reject(err)
      } else {
        if (!quiet) {
          // the *entire* stdout and stderr (buffered)
          console.log(`stdout: ${stdout}`)
          console.log(`stderr: ${stderr}`)
        }

        resolve()
      }
    }

    exec(command, { cwd: __dirname }, callback)
  })
}

async function awaitResponse(url, expectedRes, getPost, timeout, maxTimeout, data) {
  let time = 0;

  while (time < maxTimeout) {
    const success = await axios[getPost](url, data)
      .then(function (response) {
        const responseData = JSON.stringify(response.data);
        return responseData.indexOf(expectedRes) > -1
      })
      .catch(function () {
        return false;
      });

    if (success) {
      return true;
    }

    await new Promise(function (resolve) {
      setTimeout(() => resolve(), timeout);
    });

    time += timeout;
  }

  return false;
}

async function up(quiet = false) {
  await runCommand('docker-compose up -d', quiet)

  // Wait for all endpoints to become available
  let success = false;

  // IPFS
  success = await awaitResponse(
    `http://localhost:${process.env.IPFS_PORT}/api/v0/version`,
    '"Version":',
    'get',
    2000,
    20000
  );

  if (!success) {
    throw Error("test-env: IPFS failed to start");
  }

  // Ganache
  success = await awaitResponse(
    `http://localhost:${process.env.ETH_TESTNET_PORT}`,
    '"jsonrpc":',
    'post',
    2000,
    20000,
    '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":83}'
  );

  if (!success) {
    throw Error("test-env: Ganache failed to start");
  }

  // Dev Server
  success = await awaitResponse(
    `http://localhost:${process.env.DEV_SERVER_PORT}/status`,
    '"running":true',
    'get',
    2000,
    20000
  );

  if (!success) {
    throw Error("test-env: DevServer failed to start");
  }
}

async function down(quiet = false) {
  await runCommand('docker-compose down', quiet)
  // Sleep for a few seconds to make sure all services are torn down
  await new Promise((resolve) =>
    setTimeout(() => resolve(), 5000)
  )
}

if (require.main === module) {
  up().catch(err => {
    console.log(err)
    process.exit(1)
  })
} else {
  module.exports = {
    up,
    down
  }
}
