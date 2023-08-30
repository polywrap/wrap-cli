from .wrap import EthersUtils


if __name__ == "__main__":
    eth = EthersUtils()

    print("Invoking: EthersUtils.encodeParams(...)")

    result = eth.encode_params({
        "types": ["address", "uint256"],
        "values": ["0xB1B7586656116D546033e3bAFF69BFcD6592225E", "500"]
    })

    print(f"EthersUtils.encodeParams:\n{result}")
