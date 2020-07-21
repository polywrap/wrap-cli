import { GluegunToolbox } from 'gluegun'

export default {
  alias: [],
  description: '🔥 The dEngine CLI 🔥',
  run: async (toolbox: GluegunToolbox) => {
    const { print, parameters } = toolbox
    if (parameters.first !== undefined) {
      print.error(`w3 ${parameters.first} is not a command`)
    } else {
      print.success("w3 up and running")
    }
  }
}