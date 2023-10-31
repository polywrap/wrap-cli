mod wrap;

use polywrap::ByteBuf;
use wrap::types::*;

pub fn main() {
    let sha3 = Sha3::new(None);

    let data = sha3
        .sha3_256(
            &Sha3ArgsSha3256 {
                message: "Hello Polywrap!".to_string(),
            },
            None,
        )
        .unwrap();

    println!("{}", data);

    assert_eq!(data, "ba5a5d5fb7674f5975f0ecd0cd9a2f4bcadc9c04f5ac2ab3a887d8f10355fc38");
}

#[cfg(test)]
mod client_tests {

    #[test]
    fn test_client() {
        super::main();
    }
}
