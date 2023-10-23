from .wrap import Sha3


if __name__ == "__main__":
    sha3 = Sha3()

    print("Invoking: Sha3.sha3_256(...)")

    result = sha3.sha3_256({
        "message": "Hello Polywrap!"
    })

    print(f"Sha3.sha3_256:\n{result}")
