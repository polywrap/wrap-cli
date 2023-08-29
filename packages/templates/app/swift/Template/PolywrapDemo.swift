import UIKit
import PolywrapClient

func polywrapDemo() {
    print("Invoking: Logging.info(...)")

    let logger = Logging()
    let logArgs = LoggingArgsLog(level: .info, message: "Hello there")
    logger.log(args: logArgs)

    // Ethereum.encodeParams
    print("Invoking: Ethereum.encodeParams(...)")

    let eth = Ethereum()
    let encodeArgs = EthereumArgsEncodeParams(
            types: ["address", "uint256"],
            values: ["0xB1B7586656116D546033e3bAFF69BFcD6592225E", "500"]
    )
    let result = eth.encodeParams(args: encodeArgs)

    if (result.ok) {
        print("Ethereum.encodeParams:\n\(value)")
    } else {
        print("Error - Ethereum.encodeParams:\n\(error)")
    }
}