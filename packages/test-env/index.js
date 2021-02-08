const { exec } = require("child_process");

const modulesToDockerComposeFiles = new Map([
  ["devserver", "devserver.yaml"],
  ["ganache", "ganache.yaml"],
  ["ipfs", "ipfs.yaml"],
]);

function getFileCommand(configFilePath = "", ci = false, modules = []) {
  let fileCommand = "";
  if (ci === true) {
    fileCommand =
      ` -f ${modulesToDockerComposeFiles.get("devserver")}` +
      ` -f ${modulesToDockerComposeFiles.get("ganache")}` +
      ` -f ${modulesToDockerComposeFiles.get("ipfs")}`;
  }
  else if (modules.length > 0) {
    let filePath = "";
    modules.forEach(function (module) {
      filePath = modulesToDockerComposeFiles.get(module);
      if (!filePath) {
        throw `File path of ${filePath} for module ${module} not found`;
      }
      fileCommand =
        fileCommand.concat(` -f ${filePath}`);
    })
  }
  else {
    fileCommand = ci === ` -f ${configFilePath}`;
  }
  return fileCommand;
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

async function up(quiet = false, configFilePath = "", ci = false, modules = []) {
  let fileCommand = getFileCommand(configFilePath, ci, modules);
  await runCommand(`docker-compose${fileCommand} up -d`, quiet, ci)
}

async function down(quiet = false, configFilePath = "", ci = false, modules = []) {
  let fileCommand = getFileCommand(configFilePath, ci, modules);
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
    down,
    modulesToDockerComposeFiles
  }
}
