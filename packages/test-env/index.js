const { exec } = require('child_process');

async function runCommand(command, quiet, ci) {

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

async function up(quiet = false, configFilePath = "", ci = false) {
  let fileCommand = ci === false? ` -f ${configFilePath}`: "";
  await runCommand(`docker-compose${fileCommand} up -d`, quiet, ci)
}

async function down(quiet = false, configFilePath = "", ci = false) {
  let fileCommand = ci === false? ` -f ${configFilePath}`: "";
  await runCommand(`docker-compose${fileCommand} down`, quiet, ci)
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
