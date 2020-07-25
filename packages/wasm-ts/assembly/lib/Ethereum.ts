// TODO

export class Ethereum {
  static function sendTransaction(...) {
    __w3_eth_sendRPC(`{
      "method": "eth_send",
      "args": "..."
    }`)
  }
}
