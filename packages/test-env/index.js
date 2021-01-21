const { exec } = require('child_process');

const composeFiles = {
  base: 'docker-compose.base.yml',
  ganacheCli: ['docker-compose.dev-server-ganache.yml', 'docker-compose.ganache-cli.yml'],
  ipfs: 'docker-compose.ipfs.yml',
}

function getComposeFilesToUse(ganacheCli = true, ipfs = true) {
  let composeFilesToUse = [composeFiles.base];

  if (ganacheCli === true) {
    composeFiles.ganacheCli.forEach(function (value) {
      composeFilesToUse.push(value);
    })
  }
  if (ipfs === true) {
    composeFilesToUse.push(composeFiles.ipfs);
  }

  return composeFilesToUse;
}

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

async function up(quiet = false, ganacheCli = true, ipfs = true) {
  await runCommand(`docker-compose -f ${getComposeFilesToUse(ganacheCli, ipfs).join(' -f ')} up -d`, quiet)
}

async function down(quiet = false, ganacheCli = true, ipfs = true) {
  await runCommand(`docker-compose -f ${getComposeFilesToUse(ganacheCli, ipfs).join(' -f ')} down`, quiet)
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
