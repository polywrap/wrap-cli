import { OutputEntry, readDirectorySync } from "@web3api/os-js";
import { exec } from "child_process"

enum FileType {
  Directory = 'Directory',
  File = 'File'
}

const ROOT = __dirname + "/.."

function readTemplateDirectories({ type, name, data }: OutputEntry) {
  const currentPath = this ?? ""
  if (type === FileType.Directory && name !== "scripts" && name !== "node_modules" && name !== "interface") {
    (data as OutputEntry[]).forEach(readTemplateDirectories, currentPath + "/" + name )
  }
  if (type === FileType.File && name === "package.json") {
    executeTest(data as string, currentPath)
  }
}

const executeTest = (data: string, path: string) => {
    const templateJSON = JSON.parse(data)
    let command = "yarn"

    if ("build" in templateJSON.scripts) {
      command.concat(" && yarn build")
    }

    if ("test" in templateJSON.scripts) {
      command.concat(" && yarn test")
    } else {
      throw new Error("Test script must be added in template: " + templateJSON.name)
    }

    console.log(`Executing tests from template: ${path}`)
    exec(command, { cwd: ROOT.concat(path) }, err => {
      if (err) throw new Error(`Error in template ${path}: ${err.message}`)
    })
}

function main() {
  const { entries: templates } = readDirectorySync(ROOT)
  templates.forEach(readTemplateDirectories)
}

main()