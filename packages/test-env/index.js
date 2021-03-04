const { exec } = require('child_process');
const waitPort = require('wait-port');

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

async function up(quiet = false) {
  await runCommand('docker-compose up -d', quiet)

  // Wait for the development server to be online
  await new Promise((resolve, reject) => {
    waitPort({
      host: 'localhost',
      port: process.env.DEV_SERVER_PORT || 4040,
      quiet: true
    })
    .then((open) => {
      if (open) {
        resolve();
      }
      else {
        reject('The port did not open before the timeout...');
      }
    })
    .catch((err) => {
      reject(`An unknown error occured while waiting for the port: ${err}`);
    });
  });
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
