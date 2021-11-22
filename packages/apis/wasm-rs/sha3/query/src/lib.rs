//! SHA3 Polywrapper

pub mod w3;
use regex::Regex;
use tiny_keccak::{Hasher, Keccak, Sha3, Shake};
pub use w3::*;

pub fn sha3_512(input: InputSha3512) -> String {
    // set output buf
    let mut output = [0u8; 32];
    // create a SHA3-512 object
    let mut sha3 = Sha3::v512();
    // write input message
    sha3.update(input.message.as_bytes());
    // read hash digest
    sha3.finalize(&mut output);

    String::from_utf8(output.to_vec()).unwrap()
}

pub fn sha3_384(input: InputSha3384) -> String {
    // set output buf
    let mut output = [0u8; 32];
    // create a SHA3-384 object
    let mut sha3 = Sha3::v384();
    // write input message
    sha3.update(input.message.as_bytes());
    // read hash digest
    sha3.finalize(&mut output);

    String::from_utf8(output.to_vec()).unwrap()
}

pub fn sha3_256(input: InputSha3256) -> String {
    // set output buf
    let mut output = [0u8; 32];
    // create a SHA3-256 object
    let mut sha3 = Sha3::v256();
    // write input message
    sha3.update(input.message.as_bytes());
    // read hash digest
    sha3.finalize(&mut output);

    String::from_utf8(output.to_vec()).unwrap()
}

pub fn sha3_224(input: InputSha3224) -> String {
    // set output buf
    let mut output = [0u8; 32];
    // create a SHA3-224 object
    let mut sha3 = Sha3::v224();
    // write input message
    sha3.update(input.message.as_bytes());
    // read hash digest
    sha3.finalize(&mut output);

    String::from_utf8(output.to_vec()).unwrap()
}

pub fn keccak_512(input: InputKeccak512) -> String {
    // set output buf
    let mut output = [0u8; 32];
    // create a Keccak-512 object
    let mut keccak = Keccak::v512();
    // write input message
    keccak.update(input.message.as_bytes());
    // read hash digest
    keccak.finalize(&mut output);

    String::from_utf8(output.to_vec()).unwrap()
}

pub fn keccak_384(input: InputKeccak384) -> String {
    // set output buf
    let mut output = [0u8; 32];
    // create a Keccak-384 object
    let mut keccak = Keccak::v384();
    // write input message
    keccak.update(input.message.as_bytes());
    // read hash digest
    keccak.finalize(&mut output);

    String::from_utf8(output.to_vec()).unwrap()
}

pub fn keccak_256(input: InputKeccak256) -> String {
    // set output buf
    let mut output = [0u8; 32];
    // create a Keccak-256 object
    let mut keccak = Keccak::v256();
    // write input message
    keccak.update(input.message.as_bytes());
    // read hash digest
    keccak.finalize(&mut output);

    String::from_utf8(output.to_vec()).unwrap()
}

pub fn keccak_224(input: InputKeccak224) -> String {
    // set output buf
    let mut output = [0u8; 32];
    // create a Keccak-224 object
    let mut keccak = Keccak::v224();
    // write input message
    keccak.update(input.message.as_bytes());
    // read hash digest
    keccak.finalize(&mut output);

    String::from_utf8(output.to_vec()).unwrap()
}

pub fn hex_keccak_256(input: InputHexKeccak256) -> String {
    // remove the leading 0x
    let hex_string = input.message.replace("0x", "");

    // ensure even number of characters
    if hex_string.len() % 2 != 0 {
        panic!(
            "expecting an even number of characters in the hex_string: {}",
            hex_string.len().to_string()
        );
    }

    // check for some non-hex characters
    let bad = Regex::new(r"/[G-Z\s]/i");
    if bad.is_ok() {
        panic!("found non-hex characters: {}", bad.unwrap().to_string());
    }

    // split the string into pairs of octets
    let pairs = Regex::new(r"/[\dA-F]{2}/gi");
    if pairs.is_err() {
        panic!("invalid hex_string, unable to split into octets");
    }

    // set output buf
    let mut output = [0u8; 32];
    // create a Keccak-512 object
    let mut keccak = Keccak::v256();
    // write input message
    keccak.update(pairs.unwrap().to_string().as_bytes());
    // read hash digest
    keccak.finalize(&mut output);

    String::from_utf8(output.to_vec()).unwrap()
}

pub fn buffer_keccak_256(input: InputBufferKeccak256) -> String {
    // set output buf
    let mut output = [0u8; 32];
    // create a Keccak-256 object
    let mut keccak = Keccak::v256();
    // write input message
    keccak.update(&input.message);
    // read hash digest
    keccak.finalize(&mut output);

    String::from_utf8(output.to_vec()).unwrap()
}

pub fn shake_256(input: InputShake256) -> String {
    // set output buf
    let mut output = [0u8; 32];
    // create a Shake-256 object
    let mut shake = Shake::v256();
    // write input message
    let msg = input.message;
    let output_bits = input.output_bits;
    let bufs = [msg, output_bits.to_string()].concat();
    shake.update(bufs.as_bytes());
    // read hash digest
    shake.finalize(&mut output);

    String::from_utf8(output.to_vec()).unwrap()
}

pub fn shake_128(input: InputShake128) -> String {
    // set output buf
    let mut output = [0u8; 32];
    // create a Shake-128 object
    let mut shake = Shake::v128();
    // write input message
    let msg = input.message;
    let output_bits = input.output_bits;
    let bufs = [msg, output_bits.to_string()].concat();
    shake.update(bufs.as_bytes());
    // read hash digest
    shake.finalize(&mut output);

    String::from_utf8(output.to_vec()).unwrap()
}
