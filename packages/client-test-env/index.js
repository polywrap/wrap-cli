const { exec } = require('child_process');

async function runCommand(command) {
  console.log(`> ${command}`)

  return new Promise((resolve, reject) => {
    const callback = (err, stdout, stderr) => {
      if (err) {
        console.error(err)
        reject(err)
      } else {
        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`)
        console.log(`stderr: ${stderr}`)
        resolve()
      }
    }

    exec(command, { cwd: __dirname }, callback)
  })
}

async function up() {
  runCommand('docker-compose up -d')
}

async function down() {
  runCommand('docker-compose down')
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
