use polywrap_wasm_rs::{Context, Write, WriteEncoder};

#[test]
fn test_write_nil_with_empty_buffer() {
    let buf = [];
    let mut writer = WriteEncoder::new(&buf, Context::new());
    assert!(writer.get_buffer().is_empty());
    let res = writer.write_nil();
    assert_eq!(res.err(), None);
    assert_eq!(writer.get_buffer().as_slice(), [0xc0]);
}

#[test]
fn test_write_nil_with_buffer() {
    let buf = [0x00];
    let mut writer = WriteEncoder::new(&buf, Context::new());
    writer.write_nil().unwrap();
    assert_eq!([0xc0], writer.get_buffer().as_slice());
}

#[test]
fn test_write_bool_true() {
    let buf = [0x00];
    let mut writer = WriteEncoder::new(&buf, Context::new());
    writer.write_bool(true).unwrap();
    assert_eq!([0xc3], writer.get_buffer().as_slice());
}

#[test]
fn test_write_bool_false() {
    let buf = [0x00];
    let mut writer = WriteEncoder::new(&buf, Context::new());
    writer.write_bool(false).unwrap();
    assert_eq!([0xc2], writer.get_buffer().as_slice());
}

#[test]
fn test_write_f32() {
    let buf = [0x00, 0x00, 0x00, 0x00, 0x00];
    let mut writer = WriteEncoder::new(&buf, Context::new());
    Write::write_f32(&mut writer, f32::MIN).unwrap();
    assert_eq!(
        [0xca, 0xff, 0x7f, 0xff, 0xff],
        writer.get_buffer().as_slice()
    );
}

#[test]
fn test_write_f64() {
    let buf = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
    let mut writer = WriteEncoder::new(&buf, Context::new());
    Write::write_f64(&mut writer, f64::INFINITY).unwrap();
    assert_eq!(
        [0xcb, 0x7f, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        writer.get_buffer().as_slice()
    );
}

#[test]
fn test_write_i8() {
    let buf = [0x00, 0x00];
    let mut writer = WriteEncoder::new(&buf, Context::new());
    Write::write_i8(&mut writer, i8::MIN).unwrap();
    assert_eq!([0xd0, 0x80], writer.get_buffer().as_slice());
}

#[test]
fn test_write_i16() {
    let buf = [0x00, 0x00, 0x00];
    let mut writer = WriteEncoder::new(&buf, Context::new());
    Write::write_i16(&mut writer, i16::MIN).unwrap();
    assert_eq!([0xd1, 0x80, 0x00], writer.get_buffer().as_slice());
}

#[test]
fn test_write_i32() {
    let buf = [0x00, 0x00, 0x00, 0x00, 0x00];
    let mut writer = WriteEncoder::new(&buf, Context::new());
    Write::write_i32(&mut writer, i32::MIN).unwrap();
    assert_eq!(
        [0xd2, 0x80, 0x00, 0x00, 0x00],
        writer.get_buffer().as_slice()
    );
}

#[test]
fn test_write_i64() {
    let buf = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
    let mut writer = WriteEncoder::new(&buf, Context::new());
    Write::write_i64(&mut writer, i64::MIN).unwrap();
    assert_eq!(
        [0xd3, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        writer.get_buffer().as_slice()
    );
}

#[test]
fn test_write_u8() {
    let buf = [0x00, 0x00];
    let mut writer = WriteEncoder::new(&buf, Context::new());
    Write::write_u8(&mut writer, u8::MAX).unwrap();
    assert_eq!([0xcc, 0xff], writer.get_buffer().as_slice());
}

#[test]
fn test_write_u16() {
    let buf = [0x00, 0x00, 0x00];
    let mut writer = WriteEncoder::new(&buf, Context::new());
    Write::write_u16(&mut writer, u16::MAX).unwrap();
    assert_eq!([0xcd, 0xff, 0xff], writer.get_buffer().as_slice());
}

#[test]
fn test_write_u32() {
    let buf = [0x00, 0x00, 0x00, 0x00, 0x00];
    let mut writer = WriteEncoder::new(&buf, Context::new());
    Write::write_u32(&mut writer, u32::MAX).unwrap();
    assert_eq!(
        [0xce, 0xff, 0xff, 0xff, 0xff],
        writer.get_buffer().as_slice()
    );
}

#[test]
fn test_write_u64() {
    let buf = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
    let mut writer = WriteEncoder::new(&buf, Context::new());
    Write::write_u64(&mut writer, u64::MAX).unwrap();
    assert_eq!(
        [0xcf, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
        writer.get_buffer().as_slice()
    );
}
