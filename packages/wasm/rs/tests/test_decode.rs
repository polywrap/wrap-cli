use polywrap_wasm_rs::{Context, Read, ReadDecoder};

#[test]
fn test_read_nil() {
    let mut reader = ReadDecoder::new(&[0xc0], Context::new());
    assert_eq!(reader.read_nil().unwrap(), ());
}

#[test]
fn test_read_bool_true() {
    let mut reader = ReadDecoder::new(&[0xc3], Context::new());
    assert!(reader.read_bool().unwrap());
}

#[test]
fn test_read_bool_false() {
    let mut reader = ReadDecoder::new(&[0xc2], Context::new());
    assert!(!reader.read_bool().unwrap());
}

#[test]
fn test_read_f32() {
    let mut reader = ReadDecoder::new(&[0xca, 0xff, 0x7f, 0xff, 0xff], Context::new());
    assert_eq!(f32::MIN, reader.read_f32().unwrap());
}

#[test]
fn test_read_f64() {
    let mut reader = ReadDecoder::new(
        &[0xcb, 0x7f, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        Context::new(),
    );
    assert_eq!(f64::INFINITY, reader.read_f64().unwrap());
}

#[test]
fn test_read_i8() {
    let mut reader = ReadDecoder::new(&[0xd0, 0x80], Context::new());
    assert_eq!(i8::MIN, reader.read_i8().unwrap());
}

#[test]
fn test_read_i16() {
    let mut reader = ReadDecoder::new(&[0xd1, 0x80, 0x00], Context::new());
    assert_eq!(i16::MIN, reader.read_i16().unwrap());
}

#[test]
fn test_read_i32() {
    let mut reader = ReadDecoder::new(&[0xd2, 0x80, 0x00, 0x00, 0x00], Context::new());
    assert_eq!(i32::MIN, reader.read_i32().unwrap());
}

#[test]
fn test_read_i64() {
    let mut reader = ReadDecoder::new(
        &[0xd3, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        Context::new(),
    );
    assert_eq!(i64::MIN, reader.read_i64().unwrap());
}

#[test]
fn test_read_u8() {
    let mut reader = ReadDecoder::new(&[0xcc, 0xff], Context::new());
    assert_eq!(u8::MAX, reader.read_u8().unwrap());
}

#[test]
fn test_read_u16() {
    let mut reader = ReadDecoder::new(&[0xcd, 0xff, 0xff], Context::new());
    assert_eq!(u16::MAX, reader.read_u16().unwrap());
}

#[test]
fn test_read_u32() {
    let mut reader = ReadDecoder::new(&[0xce, 0xff, 0xff, 0xff, 0xff], Context::new());
    assert_eq!(u32::MAX, reader.read_u32().unwrap());
}

#[test]
fn test_read_u64() {
    let mut reader = ReadDecoder::new(
        &[0xcf, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
        Context::new(),
    );
    assert_eq!(u64::MAX, reader.read_u64().unwrap());
}
