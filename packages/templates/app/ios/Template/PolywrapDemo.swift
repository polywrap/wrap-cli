import UIKit
import PolywrapClient

func polywrapDemo() {
    print("Invoking: Sha3.sha3_256(...)")

    let sha3 = Sha3()
    let sha3_256Args = Sha3ArgsSha3256(message: "Hello Polywrap!")
    
    do{
        let result = try sha3.sha3_256(args: sha3_256Args)
        print("Sha3.sha3_256: \(result)")
    } catch {
        print("Error - Sha3.sha3_256: \(error)")
    }
}
