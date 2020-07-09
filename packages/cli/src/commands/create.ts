import * as fs from 'fs'
import { GluegunToolbox } from 'gluegun'

export default {
  alias: ['c'],
  description: 'Create a new project with w3 CLI',
  run: async (toolbox: GluegunToolbox) => {
    const { parameters, strings, print, runtime } = toolbox
    const { isBlank } = strings

    // grab the project name
    const projectName = (parameters.first || '').toString();
    if (isBlank(projectName)) {
      print.info(`${runtime!.brand} new <projectName>\n`)
      print.error('Project name is required')
    }

    if (!fs.existsSync(projectName)){
      fs.mkdirSync(projectName);
      print.newline()
      print.info(`🔥 You are ready to turn your Protocol into a Web3API 🔥`)
    } else {
      print.error(`Directory with name ${projectName} already exists`)
    }
  }
}