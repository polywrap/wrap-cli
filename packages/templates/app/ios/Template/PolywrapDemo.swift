import UIKit
import PolywrapClient

func polywrapDemo() {
    print("Invoking: Logging.info(...)")

    let logger = Logging()
    let logArgs = LoggingArgsLog(level: .INFO, message: "Hello there")
    try? logger.log(args: logArgs)

    // Ethereum.encodeParams
    print("Invoking: Ethereum.encodeParams(...)")

    let eth = Ethereum()
    let encodeArgs = EthereumArgsEncodeParams(
            types: ["address", "uint256"],
            values: ["0xB1B7586656116D546033e3bAFF69BFcD6592225E", "500"]
    )
    do {
        let encoded = try eth.encodeParams(args: encodeArgs)
        print("Ethereum.encodeParams:\n\(encoded)")
    } catch {
        let logArgs = LoggingArgsLog(level: .ERROR, message: "Error - Ethereum.encodeParams: \(error)")
        try? logger.log(args: logArgs)
        return
    }
}