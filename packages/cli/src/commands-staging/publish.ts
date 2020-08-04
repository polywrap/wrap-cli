import { GluegunToolbox } from 'gluegun'
import { insertProtocol } from '../lib/textile/bucket-connection'

var WebSocket = require('ws')
global.WebSocket = WebSocket

export default {
  alias: ["p"],
  description: 'Publish your protocol to IPFS',
  run: async (toolbox: GluegunToolbox) => {
    const { parameters, print } = toolbox
    const spinner = print.spin("Uploading to IPFS")
    try {
      const protocol = parameters.first as string;
      const hash = await insertProtocol(protocol)
      spinner.succeed("Protocol uploaded to IPFS!")
      print.success(`https://gateway.ipfs.io${hash.root}`)
    } catch(e) {
      spinner.fail(`Protocol upload failed: ${e}`)
    }
  }
}