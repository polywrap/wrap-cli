import { GluegunToolbox } from 'gluegun'

export default {
  alias: [],
  description: '🔥 The dEngine CLI 🔥',
  run: async (toolbox: GluegunToolbox) => {
    toolbox.print.success("w3 up and running!")
  }
}