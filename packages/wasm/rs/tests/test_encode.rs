use polywrap_wasm_rs::{BigInt, BigNumber, Context, Write, WriteEncoder, JSON};
use std::collections::BTreeMap;
use std::str::FromStr;

#[derive(Default, Debug)]
struct Case<T> {
    name: String,
    input: T,
    want: Vec<u8>,
}

impl<T> Case<T> {
    fn new(name: &str, input: T, want: &[u8]) -> Self {
        Self {
            name: name.to_string(),
            input,
            want: want.to_vec(),
        }
    }
}

#[test]
fn test_write_nil() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    writer.write_nil().unwrap();
    assert_eq!([192], writer.get_buffer().as_slice());
}

#[test]
fn test_write_bool_false() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    writer.write_bool(&false).unwrap();
    assert_eq!([194], writer.get_buffer().as_slice());
}

#[test]
fn test_write_bool_true() {
    let mut writer = WriteEncoder::new(&[0x00], Context::new());
    writer.write_bool(&true).unwrap();
    assert_eq!([195], writer.get_buffer().as_slice());
}

#[test]
fn test_write_u8() {
    let cases = [
        Case::new("zero", 0, &[0]),
        Case::new("positive fixed int", 1, &[1]),
        Case::new("positive fixed int", 127, &[127]),
        Case::new("8-bit unsigned int", 200, &[204, 200]),
        Case::new("8-bit unsigned int", 255, &[204, 255]),
    ];
    for case in cases {
        let mut writer = WriteEncoder::new(&[], Context::new());
        writer.write_u8(&case.input).unwrap();
        assert_eq!(case.want, writer.get_buffer().as_slice());
    }
}

#[test]
fn test_write_u16() {
    let cases = [
        Case::new("16-bit unsigned int", 256, &[205, 1, 0]),
        Case::new("16-bit unsigned int", 32767, &[205, 127, 255]),
        Case::new("16-bit unsigned int", 32768, &[205, 128, 0]),
        Case::new("16-bit unsigned int", 65535, &[205, 255, 255]),
    ];
    for case in cases {
        let mut writer = WriteEncoder::new(&[], Context::new());
        writer.write_u16(&case.input).unwrap();
        assert_eq!(case.want, writer.get_buffer().as_slice());
    }
}

#[test]
fn test_write_u32() {
    let cases = [
        Case::new("32-bit unsigned int", 65536, &[206, 0, 1, 0, 0]),
        Case::new("32-bit unsigned int", 123456, &[206, 0, 1, 226, 64]),
        Case::new("32-bit unsigned int", 2147483648, &[206, 128, 0, 0, 0]),
        Case::new(
            "32-bit unsigned int",
            4294967295,
            &[206, 255, 255, 255, 255],
        ),
    ];
    for case in cases {
        let mut writer = WriteEncoder::new(&[], Context::new());
        writer.write_u32(&case.input).unwrap();
        assert_eq!(case.want, writer.get_buffer().as_slice());
    }
}

#[test]
fn test_write_i8() {
    let cases = [
        Case::new("zero", 0, &[0]),
        Case::new("negative fixed int", -1, &[255]),
        Case::new("negative fixed int", -31, &[225]),
        Case::new("negative fixed int", -32, &[224]),
        Case::new("positive fixed int", 1, &[1]),
        Case::new("positive fixed int", 127, &[127]),
        Case::new("8-bit signed int", -128, &[208, 128]),
        Case::new("8-bit signed int", -100, &[208, 156]),
        Case::new("8-bit signed int", -33, &[208, 223]),
    ];
    for case in cases {
        let mut writer = WriteEncoder::new(&[], Context::new());
        writer.write_i8(&case.input).unwrap();
        assert_eq!(case.want, writer.get_buffer().as_slice());
    }
}

#[test]
fn test_write_i16() {
    let cases = [
        Case::new("16-bit signed int (negative)", -32768, &[209, 128, 0]),
        Case::new("16-bit signed int (negative)", -32767, &[209, 128, 1]),
        Case::new("16-bit signed int (negative)", -3262, &[209, 243, 66]),
        Case::new("16-bit signed int (negative)", -129, &[209, 255, 127]),
        Case::new("16-bit signed int (positive)", 128, &[209, 0, 128]),
        Case::new("16-bit signed int (positive)", 32767, &[209, 127, 255]),
    ];
    for case in cases {
        let mut writer = WriteEncoder::new(&[], Context::new());
        writer.write_i16(&case.input).unwrap();
        assert_eq!(case.want, writer.get_buffer().as_slice());
    }
}

#[test]
fn test_write_i32() {
    let cases = [
        Case::new(
            "32-bit signed int (negative)",
            -32769,
            &[210, 255, 255, 127, 255],
        ),
        Case::new(
            "32-bit signed int (negative)",
            -2147483648,
            &[210, 128, 0, 0, 0],
        ),
        Case::new(
            "32-bit signed int (negative)",
            -2147483647,
            &[210, 128, 0, 0, 1],
        ),
        Case::new("32-bit signed int (positive)", 32768, &[210, 0, 0, 128, 0]),
        Case::new(
            "32-bit signed int (positive)",
            123456,
            &[210, 0, 1, 226, 64],
        ),
        Case::new(
            "32-bit signed int (positive)",
            2147483647,
            &[210, 127, 255, 255, 255],
        ),
    ];
    for case in cases {
        let mut writer = WriteEncoder::new(&[], Context::new());
        writer.write_i32(&case.input).unwrap();
        assert_eq!(case.want, writer.get_buffer().as_slice());
    }
}

#[test]
fn write_u64() {
    let cases = [Case::new(
        "64-bit unsigned int",
        u64::MAX,
        &[207, 255, 255, 255, 255, 255, 255, 255, 255],
    )];
    for case in cases {
        let mut writer = WriteEncoder::new(&[], Context::new());
        // u64::MAX == 18446744073709551615
        writer.write_u64(&case.input).unwrap();
        assert_eq!(case.want, writer.get_buffer().as_slice());
    }
}

#[test]
fn write_i64() {
    let cases = [
        Case::new(
            "64-bit signed int",
            i64::MAX,
            &[211, 127, 255, 255, 255, 255, 255, 255, 255],
        ),
        Case::new(
            "64-bit signed int",
            i64::MIN,
            &[211, 128, 0, 0, 0, 0, 0, 0, 0],
        ),
    ];
    for case in cases {
        let mut writer = WriteEncoder::new(&[], Context::new());
        // i64::MAX == 9_223_372_036_854_775_807
        writer.write_i64(&case.input).unwrap();
        assert_eq!(case.want, writer.get_buffer().as_slice());
    }
}

#[test]
fn test_write_f32() {
    let cases = [Case::new("32-bit float", 0.5, &[202, 63, 0, 0, 0])];

    for case in cases {
        let mut writer = WriteEncoder::new(&[], Context::new());
        writer.write_f32(&case.input).unwrap();
        assert_eq!(case.want, writer.get_buffer().as_slice());
    }
}

#[test]
fn test_write_f64() {
    let cases = [Case::new(
        "64-bit float",
        3.141592653589793,
        &[203, 64, 9, 33, 251, 84, 68, 45, 24],
    )];

    for case in cases {
        let mut writer = WriteEncoder::new(&[], Context::new());
        writer.write_f64(&case.input).unwrap();
        assert_eq!(case.want, writer.get_buffer().as_slice());
    }
}

#[test]
fn test_write_string() {
    let cases = [
        Case::new("Empty String", "", &[160]),
        Case::new("5-char String", "hello", &[165, 104, 101, 108, 108, 111]),
        Case::new(
            "11-char String",
            "hello world",
            &[171, 104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100],
        ),
        Case::new(
            "31-char String",
            "-This string contains 31 chars-",
            &[
                191, 45, 84, 104, 105, 115, 32, 115, 116, 114, 105, 110, 103, 32, 99, 111, 110,
                116, 97, 105, 110, 115, 32, 51, 49, 32, 99, 104, 97, 114, 115, 45,
            ],
        ),
        Case::new(
            "255-char String",
        concat!("This is a str 8 string of 255 bytes ",
      "AC53LgxLLOKm0hfsPa1V0nfMjXtnmkEttruCPjc51dtEMLRJIEu1YoRGd9", "oXnM4CxcIiTc9V2DnAidZz22foIzc3kqHBoXgYskevfoJ5RK",
      "Yp52qvoDPufUebLksFl7astBNEnjPVUX2e3O9O6VKeUpB0iiHQXfzOOjTEK6Xy6ks4zAG2M6jCL01flIJlxplRXCV7 sadsadsadsadasdasaaaaa"),
            &[
            217, 255, 84, 104, 105, 115, 32, 105, 115, 32, 97, 32, 115, 116, 114, 32, 56, 32, 115,
            116, 114, 105, 110, 103, 32, 111, 102, 32, 50, 53, 53, 32, 98, 121, 116, 101, 115, 32,
            65, 67, 53, 51, 76, 103, 120, 76, 76, 79, 75, 109, 48, 104, 102, 115, 80, 97, 49, 86,
            48, 110, 102, 77, 106, 88, 116, 110, 109, 107, 69, 116, 116, 114, 117, 67, 80, 106, 99,
            53, 49, 100, 116, 69, 77, 76, 82, 74, 73, 69, 117, 49, 89, 111, 82, 71, 100, 57, 111,
            88, 110, 77, 52, 67, 120, 99, 73, 105, 84, 99, 57, 86, 50, 68, 110, 65, 105, 100, 90,
            122, 50, 50, 102, 111, 73, 122, 99, 51, 107, 113, 72, 66, 111, 88, 103, 89, 115, 107,
            101, 118, 102, 111, 74, 53, 82, 75, 89, 112, 53, 50, 113, 118, 111, 68, 80, 117, 102,
            85, 101, 98, 76, 107, 115, 70, 108, 55, 97, 115, 116, 66, 78, 69, 110, 106, 80, 86, 85,
            88, 50, 101, 51, 79, 57, 79, 54, 86, 75, 101, 85, 112, 66, 48, 105, 105, 72, 81, 88,
            102, 122, 79, 79, 106, 84, 69, 75, 54, 88, 121, 54, 107, 115, 52, 122, 65, 71, 50, 77,
            54, 106, 67, 76, 48, 49, 102, 108, 73, 74, 108, 120, 112, 108, 82, 88, 67, 86, 55, 32,
            115, 97, 100, 115, 97, 100, 115, 97, 100, 115, 97, 100, 97, 115, 100, 97, 115, 97, 97,
            97, 97, 97
        ])
    ];

    for case in cases {
        let mut writer = WriteEncoder::new(&[], Context::new());
        writer.write_string(&case.input).unwrap();
        assert_eq!(case.want, writer.get_buffer().as_slice());
    }
}

#[test]
fn test_write_bytes() {
    let cases = [Case::new("Bytes", [1], &[196, 1, 1])];

    for case in cases {
        let mut writer = WriteEncoder::new(&[], Context::new());
        writer.write_bytes(&case.input).unwrap();
        assert_eq!(case.want, writer.get_buffer().as_slice());
    }
}

#[test]
fn test_write_bigint() {
    let cases = [
        // i128::MAX
        Case::new(
            "BigInt",
            BigInt::from(170_141_183_460_469_231_731_687_303_715_884_105_727i128),
            &[
                217, 39, 49, 55, 48, 49, 52, 49, 49, 56, 51, 52, 54, 48, 52, 54, 57, 50, 51, 49,
                55, 51, 49, 54, 56, 55, 51, 48, 51, 55, 49, 53, 56, 56, 52, 49, 48, 53, 55, 50, 55,
            ],
        ),
    ];

    for case in cases {
        let mut writer = WriteEncoder::new(&[], Context::new());
        writer.write_bigint(&case.input).unwrap();
        assert_eq!(case.want, writer.get_buffer().as_slice());
    }
}

#[test]
fn test_write_bignumber() {
    let cases = [Case::new(
        "BigNumber",
        BigNumber::from_str("3124124512.598273468017578125").unwrap(),
        &[
            189, 51, 49, 50, 52, 49, 50, 52, 53, 49, 50, 46, 53, 57, 56, 50, 55, 51, 52, 54, 56,
            48, 49, 55, 53, 55, 56, 49, 50, 53,
        ],
    )];

    for case in cases {
        let mut writer = WriteEncoder::new(&[], Context::new());
        writer.write_bignumber(&case.input).unwrap();
        assert_eq!(case.want, writer.get_buffer().as_slice());
    }
}

#[test]
fn test_write_json() {
    let cases = [
        Case::new(
            "JSON",
            JSON::json!({ "language": "rust", "edition": "2021" }),
            &[
                217, 36, 123, 34, 101, 100, 105, 116, 105, 111, 110, 34, 58, 34, 50, 48, 50, 49,
                34, 44, 34, 108, 97, 110, 103, 117, 97, 103, 101, 34, 58, 34, 114, 117, 115, 116,
                34, 125,
            ],
        ),
        Case::new(
            "JSON",
            JSON::json!({ "foo": "bar" }),
            &[
                173, 123, 34, 102, 111, 111, 34, 58, 34, 98, 97, 114, 34, 125,
            ],
        ),
    ];

    for case in cases {
        let mut writer = WriteEncoder::new(&[], Context::new());
        // the `JSON` will be converted to a `String` internally: "{\"edition\":\"2021\",\"language\":\"rust\"}"
        println!("{:#?}", case.input.to_string());
        writer.write_json(&case.input).unwrap();
        assert_eq!(case.want, writer.get_buffer().as_slice());
    }
}

#[test]
fn test_write_array() {
    let cases = [
        Case::new(
            "fixarray",
            vec![1, 2, 545345],
            &[147, 1, 2, 210, 0, 8, 82, 65],
        ),
        Case::new(
            "array 16",
            vec![
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
                24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
            ],
            &[
                220, 0, 36, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
            ],
        ),
    ];

    for case in cases {
        let mut writer = WriteEncoder::new(&[], Context::new());
        writer.write_array(&case.input, |writer, item| writer.write_i32(item));
        assert_eq!(case.want, writer.get_buffer().as_slice());
    }
}

#[test]
fn test_write_map() {
    let mut map1: BTreeMap<String, Vec<i32>> = BTreeMap::new();
    let _ = map1.insert("Polywrap".to_string(), vec![3, 5, 9]);
    let _ = map1.insert("Rust".to_string(), vec![1, 4, 7]);
    let mut map2: BTreeMap<String, Vec<i32>> = BTreeMap::new();
    for i in 0..16 {
        map2.insert(i.to_string(), vec![i, i + 1, i + 2]);
    }
    let cases = [
        Case::new(
            "fixmap",
            map1,
            &[
                130, 168, 80, 111, 108, 121, 119, 114, 97, 112, 147, 3, 5, 9, 164, 82, 117, 115,
                116, 147, 1, 4, 7,
            ],
        ),
        Case::new(
            "map 16",
            map2,
            &[
                222, 0, 16, 161, 48, 147, 0, 1, 2, 161, 49, 147, 1, 2, 3, 162, 49, 48, 147, 10, 11,
                12, 162, 49, 49, 147, 11, 12, 13, 162, 49, 50, 147, 12, 13, 14, 162, 49, 51, 147,
                13, 14, 15, 162, 49, 52, 147, 14, 15, 16, 162, 49, 53, 147, 15, 16, 17, 161, 50,
                147, 2, 3, 4, 161, 51, 147, 3, 4, 5, 161, 52, 147, 4, 5, 6, 161, 53, 147, 5, 6, 7,
                161, 54, 147, 6, 7, 8, 161, 55, 147, 7, 8, 9, 161, 56, 147, 8, 9, 10, 161, 57, 147,
                9, 10, 11,
            ],
        ),
    ];

    for case in cases {
        let mut writer = WriteEncoder::new(&[], Context::new());
        writer
            .write_map(
                &case.input,
                |writer, key| writer.write_string(key),
                |writer, value| writer.write_array(value, |writer, item| writer.write_i32(item)),
            )
            .unwrap();
        assert_eq!(case.want, writer.get_buffer().as_slice());
    }
}

#[test]
fn test_write_ext_generic_map() {
    let mut map1: BTreeMap<i32, Vec<i32>> = BTreeMap::new();
    let _ = map1.insert(1, vec![3, 5, 9]);
    let _ = map1.insert(2, vec![1, 4, 7]);
    let mut map2: BTreeMap<i32, Vec<i32>> = BTreeMap::new();
    for i in 0..16 {
        map2.insert(i, vec![i, i + 1, i + 2]);
    }
    let cases = [
        Case::new(
            "map 8",
            map1,
            &[199, 11, 1, 130, 1, 147, 3, 5, 9, 2, 147, 1, 4, 7],
        ),
        Case::new(
            "map 16",
            map2,
            &[
                199, 83, 1, 222, 0, 16, 0, 147, 0, 1, 2, 1, 147, 1, 2, 3, 2, 147, 2, 3, 4, 3, 147,
                3, 4, 5, 4, 147, 4, 5, 6, 5, 147, 5, 6, 7, 6, 147, 6, 7, 8, 7, 147, 7, 8, 9, 8,
                147, 8, 9, 10, 9, 147, 9, 10, 11, 10, 147, 10, 11, 12, 11, 147, 11, 12, 13, 12,
                147, 12, 13, 14, 13, 147, 13, 14, 15, 14, 147, 14, 15, 16, 15, 147, 15, 16, 17,
            ],
        ),
    ];

    for case in cases {
        let mut writer = WriteEncoder::new(&[], Context::new());
        writer
            .write_ext_generic_map(
                &case.input,
                |writer, key| writer.write_i32(key),
                |writer, value| writer.write_array(value, |writer, item| writer.write_i32(item)),
            )
            .unwrap();
        assert_eq!(case.want, writer.get_buffer().as_slice());
    }
}
