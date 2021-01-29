const { exec } = require('child_process');

async function runCommand(command, quiet, directory, ci) {

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

    exec(command, { cwd: ci === true ? __dirname : directory }, callback)
  })
}

async function up(quiet = false, directory = "", ci = false) {
  await runCommand('docker-compose up -d', quiet, directory, ci)
}

async function down(quiet = false, directory = "", ci = false) {
  await runCommand('docker-compose down', quiet, directory, ci)
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
