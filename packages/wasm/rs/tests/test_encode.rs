use polywrap_wasm_rs::{Context, Write, WriteEncoder};

#[test]
fn test_write_nil_with_empty_buffer() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    assert!(writer.get_buffer().is_empty());
    assert_eq!(writer.write_nil().err(), None);
    assert_eq!(writer.get_buffer().as_slice(), [0xc0]);
}

#[test]
fn test_write_nil_with_buffer() {
    let mut writer = WriteEncoder::new(&[0x00], Context::new());
    writer.write_nil().unwrap();
    assert_eq!([0xc0], writer.get_buffer().as_slice());
}

#[test]
fn test_write_bool_true() {
    let mut writer = WriteEncoder::new(&[0x00], Context::new());
    writer.write_bool(true).unwrap();
    assert_eq!([0xc3], writer.get_buffer().as_slice());
}

#[test]
fn test_write_bool_false() {
    let mut writer = WriteEncoder::new(&[0x00], Context::new());
    writer.write_bool(false).unwrap();
    assert_eq!([0xc2], writer.get_buffer().as_slice());
}

#[test]
fn test_write_f32() {
    let mut writer = WriteEncoder::new(&[0x00, 0x00, 0x00, 0x00, 0x00], Context::new());
    writer.write_f32(f32::MIN).unwrap();
    assert_eq!(
        [0xca, 0xff, 0x7f, 0xff, 0xff],
        writer.get_buffer().as_slice()
    );
}

#[test]
fn test_write_f64() {
    let mut writer = WriteEncoder::new(
        &[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        Context::new(),
    );
    writer.write_f64(f64::INFINITY).unwrap();
    assert_eq!(
        [0xcb, 0x7f, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        writer.get_buffer().as_slice()
    );
}

#[test]
fn test_write_i8() {
    let mut writer = WriteEncoder::new(&[0x00, 0x00], Context::new());
    writer.write_i8(i8::MIN).unwrap();
    assert_eq!([0xd0, 0x80], writer.get_buffer().as_slice());
}

#[test]
fn test_write_i16() {
    let mut writer = WriteEncoder::new(&[0x00, 0x00, 0x00], Context::new());
    writer.write_i16(i16::MIN).unwrap();
    assert_eq!([0xd1, 0x80, 0x00], writer.get_buffer().as_slice());
}

#[test]
fn test_write_i32() {
    let mut writer = WriteEncoder::new(&[0x00, 0x00, 0x00, 0x00, 0x00], Context::new());
    writer.write_i32(i32::MIN).unwrap();
    assert_eq!(
        [0xd2, 0x80, 0x00, 0x00, 0x00],
        writer.get_buffer().as_slice()
    );
}

#[test]
fn test_write_i64() {
    let mut writer = WriteEncoder::new(
        &[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        Context::new(),
    );
    writer.write_i64(i64::MIN).unwrap();
    assert_eq!(
        [0xd3, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        writer.get_buffer().as_slice()
    );
}

#[test]
fn test_write_u8() {
    let mut writer = WriteEncoder::new(&[0x00, 0x00], Context::new());
    writer.write_u8(u8::MAX).unwrap();
    assert_eq!([0xcc, 0xff], writer.get_buffer().as_slice());
}

#[test]
fn test_write_u16() {
    let mut writer = WriteEncoder::new(&[0x00, 0x00, 0x00], Context::new());
    writer.write_u16(u16::MAX).unwrap();
    assert_eq!([0xcd, 0xff, 0xff], writer.get_buffer().as_slice());
}

#[test]
fn test_write_u32() {
    let mut writer = WriteEncoder::new(&[0x00, 0x00, 0x00, 0x00, 0x00], Context::new());
    writer.write_u32(u32::MAX).unwrap();
    assert_eq!(
        [0xce, 0xff, 0xff, 0xff, 0xff],
        writer.get_buffer().as_slice()
    );
}

#[test]
fn test_write_u64() {
    let mut writer = WriteEncoder::new(
        &[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        Context::new(),
    );
    writer.write_u64(u64::MAX).unwrap();
    assert_eq!(
        [0xcf, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
        writer.get_buffer().as_slice()
    );
}
