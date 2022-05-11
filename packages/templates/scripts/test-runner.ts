import { OutputEntry, readDirectorySync } from "@web3api/os-js";
import { exec } from "child_process"

enum FileType {
  Directory = 'Directory',
  File = 'File'
}

const ROOT = __dirname + "/.."

function readTemplateDirectories({ type, name, data }: OutputEntry) {
  const currentPath = this ?? ""
  if (type === FileType.Directory && name !== "scripts" && name !== "node_modules") {
    (data as OutputEntry[]).forEach(readTemplateDirectories, currentPath + "/" + name )
  }
  if (type === FileType.File && name === "package.json") {
    executeTest(data as string, currentPath)
  }
}

const executeTest = (data: string, path: string) => {
    const templateJSON = JSON.parse(data)
    let command = "yarn test"

    if ("build" in templateJSON.scripts) {
      command = "yarn build && yarn test"
    }

    if (!("test" in templateJSON.scripts)) {
      throw new Error("Test script must be added in template: " + templateJSON.name)
    }

    exec(command, { cwd: ROOT.concat(path) }, (error, stdout, stderr) => {
      console.log("////////")
      console.log(stdout)
      console.log(stderr)
      if (error) throw new Error(`Error in template ${path}: ${error.message}`)
    })
}

function main() {
  const { entries: templates } = readDirectorySync(ROOT)
  templates.forEach(readTemplateDirectories)
}

main()