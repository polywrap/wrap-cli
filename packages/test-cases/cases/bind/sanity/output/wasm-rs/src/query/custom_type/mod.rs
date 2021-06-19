use super::AnotherType;
use super::CustomEnum;
use crate::{Context, Read, ReadDecoder, Write, WriteEncoder, WriteSizer};
use num_bigint::BigInt;
use std::io::Result;

#[derive(Debug)]
pub struct CustomType {
    string: String,
    opt_string: Option<String>,
    u: u32,
    opt_u: Option<u32>,
    uint8: u8,
    uint16: u16,
    uint32: u32,
    uint64: u64,
    i: i32,
    int8: i8,
    int16: i16,
    int32: i32,
    int64: i64,
    bigint: BigInt,
    opt_bigint: Option<BigInt>,
    bytes: Vec<u8>,
    opt_bytes: Option<Vec<u8>>,
    boolean: bool,
    opt_boolean: Option<bool>,
    u_array: Vec<u32>,
    u_opt_array: Option<Vec<u32>>,
    opt_u_opt_array: Option<Vec<Option<u32>>>,
    opt_str_opt_array: Option<Option<Vec<String>>>,
    u_array_array: Vec<Vec<u32>>,
    u_opt_array_opt_array: Vec<Option<Vec<u64>>>,
    u_array_opt_array_array: Vec<Option<Vec<Vec<u64>>>>,
    crazy_array: Option<Vec<Option<Vec<Option<Vec<u64>>>>>>,
    object: AnotherType,
    opt_object: Option<AnotherType>,
    object_array: Vec<AnotherType>,
    opt_object_array: Option<Vec<AnotherType>>,
    en: CustomEnum,
    opt_en: Option<CustomEnum>,
    en_array: Vec<CustomEnum>,
    opt_en_array: Option<Vec<CustomEnum>>,
}

impl CustomType {
    pub fn serialize_custom_type(&mut self) -> Vec<u8> {
        let mut sizer_context = Context::new();
        sizer_context.description = "Serializing (sizing) object-type: CustomType".to_string();
        let sizer = WriteSizer::new(sizer_context);
        self.write_custom_type(sizer);
        let buffer: Vec<u8> = Vec::with_capacity(sizer.get_length() as usize);
        let mut encode_context = Context::new();
        encode_context.description = "Serializing (encoding) object-type: CustomType".to_string();
        let encoder = WriteEncoder::new(buffer.as_slice(), encode_context);
        self.write_custom_type(encoder);
        buffer
    }

    pub fn write_custom_type<W: Write>(&mut self, mut writer: W) {
        writer.write_map_length(35);
        writer
            .context()
            .push("string", "string", "writing property");
        writer.write_string("string".to_string());
        writer.write_string(self.string.to_owned());
        writer.context().pop();
        writer
            .context()
            .push("opt_string", "Option<String>", "writing property");
        writer.write_string("opt_string".to_string());
        writer.write_nullable_string(self.opt_string.to_owned());
        writer.context().pop();
        writer.context().push("u", "u32", "writing property");
        writer.write_string("u".to_string());
        writer.write_u32(self.u);
        writer.context().pop();
        writer
            .context()
            .push("opt_u", "Option<u32>", "writing property");
        writer.write_string("opt_u".to_string());
        writer.write_nullable_u32(self.opt_u);
        writer.context().pop();
        writer.context().push("u8", "u8", "writing property");
        writer.write_string("u8".to_string());
        writer.write_u8(self.uint8);
        writer.context().pop();
        writer.context().push("u16", "u16", "writing property");
        writer.write_string("u16".to_string());
        writer.write_u16(self.uint16);
        writer.context().pop();
        writer.context().push("u32", "u32", "writing property");
        writer.write_string("u32".to_string());
        writer.write_u32(self.uint32);
        writer.context().pop();
        writer.context().push("u64", "u64", "writing property");
        writer.write_string("u64".to_string());
        writer.write_u64(self.uint64);
        writer.context().pop();
        writer.context().push("i", "i32", "writing property");
        writer.write_string("i".to_string());
        writer.write_i32(self.i);
        writer.context().pop();
        writer.context().push("i8", "i8", "writing property");
        writer.write_string("i8".to_string());
        writer.write_i8(self.int8);
        writer.context().pop();
        writer.context().push("i16", "i16", "writing property");
        writer.write_string("i16".to_string());
        writer.write_i16(self.int16);
        writer.context().pop();
        writer.context().push("i32", "i32", "writing property");
        writer.write_string("i32".to_string());
        writer.write_i32(self.int32);
        writer.context().pop();
        writer.context().push("i64", "i64", "writing property");
        writer.write_string("i64".to_string());
        writer.write_i64(self.int64);
        writer.context().pop();
        writer
            .context()
            .push("bigint", "BigInt", "writing property");
        writer.write_string("bigint".to_string());
        writer.write_bigint(self.bigint.to_owned());
        writer.context().pop();
        writer
            .context()
            .push("opt_bigint", "Option<BigInt>", "writing property");
        writer.write_string("opt_bigint".to_string());
        writer.write_nullable_bigint(self.opt_bigint.to_owned());
        writer.context().pop();
        writer
            .context()
            .push("bytes", "Vec<u8>", "writing property");
        writer.write_string("bytes".to_string());
        writer.write_bytes(self.bytes.as_slice());
        writer.context().pop();
        writer
            .context()
            .push("opt_bytes", "Option<Vec<u8>>", "writing property");
        writer.write_string("opt_bytes".to_string());
        writer.write_nullable_bytes(self.opt_bytes.to_owned());
        writer.context().pop();
        writer.context().push("boolean", "bool", "writing property");
        writer.write_string("boolean".to_string());
        writer.write_bool(self.boolean);
        writer.context().pop();
        writer
            .context()
            .push("opt_boolean", "Option<bool>", "writing property");
        writer.write_string("opt_boolean".to_string());
        writer.write_nullable_bool(self.opt_boolean);
        writer.context().pop();
        writer
            .context()
            .push("u_array", "Vec<u32>", "writing property");
        writer.write_string("u_array".to_string());
        // TODO: writer.write_array();
        writer.context().pop();
        writer
            .context()
            .push("u_opt_array", "Vec<Option<u32>>", "writing property");
        writer.write_string("u_opt_array".to_string());
        // TODO: writer.write_nullable_array();
        writer.context().pop();
        writer.context().push(
            "opt_u_opt_array",
            "Option<Vec<Option<u32>>>",
            "writing property",
        );
        writer.write_string("opt_u_opt_array".to_string());
        // TODO: writer.write_nullable_array();
        writer.context().pop();
        writer.context().push(
            "opt_string_opt_array",
            "Option<Option<Vec<String>>>",
            "writing property",
        );
        writer.write_string("opt_string_opt_array".to_string());
        // TODO: writer.write_nullable_array();
        writer.context().pop();
        writer
            .context()
            .push("u_array_array", "Vec<Vec<u32>>", "writing property");
        writer.write_string("u_array_array".to_string());
        // TODO: writer.write_array();
        writer.context().pop();
        writer.context().push(
            "u_opt_array_opt_array",
            "Vec<Option<Vec<u64>>>",
            "writing property",
        );
        writer.write_string("u_opt_array_opt_array".to_string());
        // TODO: writer.write_array();
        writer.context().pop();
        writer.context().push(
            "u_array_opt_array_array",
            "Vec<Option<Vec<Vec<u64>>>>",
            "writing property",
        );
        writer.write_string("u_array_opt_array_array".to_string());
        // TODO: writer.write_array();
        writer.context().pop();
        writer.context().push(
            "crazy_array",
            "Option<Vec<Option<Vec<Option<Vec<u64>>>>>>",
            "writing property",
        );
        writer.write_string("crazy_array".to_string());
        // TODO: writer.write_nullable_array();
        writer.context().pop();
        writer
            .context()
            .push("object", "AnotherType", "writing property");
        writer.write_string("object".to_string());
        self.object.write(writer.to_owned());
        writer.context().pop();
        writer
            .context()
            .push("opt_object", "Option<AnotherType>", "writing property");
        writer.write_string("opt_object".to_string());
        if self.opt_object.is_some() {
            self.opt_object.unwrap().write(writer.to_owned());
        } else {
            writer.write_nil();
        }
        writer.context().pop();
        writer
            .context()
            .push("object_array", "Vec<AnotherType>", "writing property");
        writer.write_string("object_array".to_string());
        // TODO: writer.write_array();
        writer.context().pop();
        writer.context().push(
            "opt_object_array",
            "Option<Vec<AnotherType>>",
            "writing property",
        );
        writer.write_string("opt_object_array".to_string());
        // TODO: writer.write_nullable_array();
        writer.context().pop();
        writer
            .context()
            .push("en", "CustomEnum", "writing property");
        writer.write_string("en".to_string());
        // TODO: writer.write_i32();
        writer.context().pop();
        writer
            .context()
            .push("opt_en", "Option<CustomEnum>", "writing property");
        writer.write_string("opt_en".to_string());
        // TODO: writer.write_nullable_i32();
        writer.context().pop();
        writer
            .context()
            .push("en_array", "Vec<CustomEnum>>", "writing property");
        writer.write_string("en_array".to_string());
        // TODO: writer.write_array();
        writer.context().pop();
        writer.context().push(
            "opt_en_array",
            "Option<Vec<CustomEnum>>>",
            "writing property",
        );
        writer.write_string("opt_en_array".to_string());
        // TODO: writer.write_nullable_array();
        writer.context().pop();
    }

    pub fn deserialize_custom_type(&mut self, buffer: Vec<u8>) -> Self {
        let mut context = Context::new();
        context.description = "Deserializing object-type: CustomType".to_string();
        let reader = ReadDecoder::new(buffer.as_slice(), context);
        self.read_custom_type(reader)
            .expect("Failed to deserialize CustomType")
    }

    pub fn read_custom_type<R: Read>(&mut self, mut reader: R) -> Result<Self> {
        let mut num_of_fields = reader.read_map_length().unwrap_or_default();

        let mut string = "".to_string();
        let mut string_set = false;
        let mut opt_string: Option<String> = None;
        let mut u: u32 = 0;
        let mut u_set = false;
        let mut opt_u: Option<u32> = Some(0);
        let mut uint8: u8 = 0;
        let mut uint8_set = false;
        let mut uint16: u16 = 0;
        let mut uint16_set = false;
        let mut uint32: u32 = 0;
        let mut uint32_set = false;
        let mut uint64: u64 = 0;
        let mut uint64_set = false;
        let mut i: i32 = 0;
        let mut i_set = false;
        let mut int8: i8 = 0;
        let mut int8_set = false;
        let mut int16: i16 = 0;
        let mut int16_set = false;
        let mut int32: i32 = 0;
        let mut int32_set = false;
        let mut int64: i64 = 0;
        let mut int64_set = false;
        let mut bigint = BigInt::from_u16(0).unwrap_or_default();
        let mut bigint_set = false;
        let mut opt_bigint: Option<BigInt> = None;
        let mut bytes: Vec<u8> = vec![];
        let mut bytes_set = false;
        let mut opt_bytes: Option<Vec<u8>> = None;
        let mut boolean = false;
        let mut boolean_set = false;
        let mut opt_boolean: Option<bool> = Some(false);
        let mut u_array: Vec<u32> = vec![];
        let mut u_array_set = false;
        let mut u_opt_array: Option<Vec<u32>> = None;
        let mut opt_u_opt_array: Option<Vec<Option<u32>>> = None;
        let mut opt_str_opt_array: Option<Option<Vec<String>>> = None;
        let mut u_array_array: Vec<Vec<u32>> = vec![];
        let mut u_array_array_set = false;
        let mut u_opt_array_opt_array: Vec<Option<Vec<u64>>> = vec![];
        let mut u_opt_array_opt_array_set = false;
        let mut u_array_opt_array_array: Vec<Option<Vec<Vec<u64>>>> = vec![];
        let mut u_array_opt_array_array_set = false;
        let mut crazy_array: Option<Vec<Option<Vec<Option<Vec<u64>>>>>> = None;
        let mut object = AnotherType::new();
        let mut object_set = false;
        let mut opt_object: Option<AnotherType> = None;
        let mut object_array: Vec<AnotherType> = vec![];
        let mut object_array_set = false;
        let mut opt_object_array: Option<Vec<AnotherType>> = None;
        let mut en = CustomEnum::_MAX_(0);
        let mut en_set = false;
        let mut opt_en: Option<CustomEnum> = None;
        let mut en_array: Vec<CustomEnum> = vec![];
        let mut en_array_set = false;
        let mut opt_en_array: Option<Vec<CustomEnum>> = None;

        while num_of_fields > 0 {
            num_of_fields -= 1;
            let field = reader.read_string().unwrap_or_default().as_str();

            match field {
                "string" => {
                    reader
                        .context()
                        .push(field, "String", "type found, reading property");
                    string = reader.read_string().unwrap_or_default();
                    string_set = true;
                    reader.context().pop();
                }
                "opt_string" => {
                    reader
                        .context()
                        .push(field, "Option<String>", "type found, reading property");
                    opt_string = reader.read_nullable_string();
                    reader.context().pop();
                }
                "u" => {
                    reader
                        .context()
                        .push(field, "u32", "type found, reading property");
                    u = reader.read_u32().unwrap_or_default();
                    u_set = true;
                    reader.context().pop();
                }
                "opt_u" => {
                    reader
                        .context()
                        .push(field, "Option<u32>", "type found, reading property");
                    opt_u = reader.read_nullable_u32();
                    reader.context().pop();
                }
                "uint8" => {
                    reader
                        .context()
                        .push(field, "u8", "type found, reading property");
                    uint8 = reader.read_u8().unwrap_or_default();
                    uint8_set = true;
                    reader.context().pop();
                }
                "uint16" => {
                    reader
                        .context()
                        .push(field, "u16", "type found, reading property");
                    uint16 = reader.read_u16().unwrap_or_default();
                    uint16_set = true;
                    reader.context().pop();
                }
                "uint32" => {
                    reader
                        .context()
                        .push(field, "u32", "type found, reading property");
                    uint32 = reader.read_u32().unwrap_or_default();
                    uint32_set = true;
                    reader.context().pop();
                }
                "uint64" => {
                    reader
                        .context()
                        .push(field, "u64", "type found, reading property");
                    uint64 = reader.read_u64().unwrap_or_default();
                    uint64_set = true;
                    reader.context().pop();
                }
                "i" => {
                    reader
                        .context()
                        .push(field, "i32", "type found, reading property");
                    i = reader.read_i32().unwrap_or_default();
                    i_set = true;
                    reader.context().pop();
                }
                "int8" => {
                    reader
                        .context()
                        .push(field, "i8", "type found, reading property");
                    int8 = reader.read_i8().unwrap_or_default();
                    int8_set = true;
                    reader.context().pop();
                }
                "int16" => {
                    reader
                        .context()
                        .push(field, "i16", "type found, reading property");
                    int16 = reader.read_i16().unwrap_or_default();
                    int16_set = true;
                    reader.context().pop();
                }
                "int32" => {
                    reader
                        .context()
                        .push(field, "i32", "type found, reading property");
                    int32 = reader.read_i32().unwrap_or_default();
                    int32_set = true;
                    reader.context().pop();
                }
                "int64" => {
                    reader
                        .context()
                        .push(field, "i64", "type found, reading property");
                    int64 = reader.read_i64().unwrap_or_default();
                    int64_set = true;
                    reader.context().pop();
                }
                "bigint" => {
                    reader
                        .context()
                        .push(field, "BigInt", "type found, reading property");
                    bigint = reader.read_bigint().unwrap_or_default();
                    bigint_set = true;
                    reader.context().pop();
                }
                "opt_bigint" => {
                    reader
                        .context()
                        .push(field, "Option<BigInt>", "type found, reading property");
                    opt_bigint = reader.read_nullable_bigint();
                    reader.context().pop();
                }
                "bytes" => {
                    reader
                        .context()
                        .push(field, "Vec<u8>", "type found, reading property");
                    bytes = reader.read_bytes().unwrap_or_default();
                    bytes_set = true;
                    reader.context().pop();
                }
                "opt_bytes" => {
                    reader
                        .context()
                        .push(field, "Option<Vec<u8>>", "type found, reading property");
                    opt_bytes = reader.read_nullable_bytes();
                    reader.context().pop();
                }
                "boolean" => {
                    reader
                        .context()
                        .push(field, "bool", "type found, reading property");
                    int64 = reader.read_i64().unwrap_or_default();
                    boolean_set = true;
                    reader.context().pop();
                }
                "opt_boolean" => {
                    reader
                        .context()
                        .push(field, "Option<bool>", "type found, reading property");
                    opt_boolean = reader.read_nullable_bool();
                    reader.context().pop();
                }
                "u_array" => {
                    reader
                        .context()
                        .push(field, "Vec<u32>", "type found, reading property");
                    // TODO: u_array = reader.read_array().unwrap_or_default();
                    u_array_set = true;
                    reader.context().pop();
                }
                "u_opt_array" => {
                    reader.context().push(
                        field,
                        "Option<Vec<u32>>",
                        "type found, reading property",
                    );
                    // TODO: u_opt_array = reader.read_nullable_array();
                    reader.context().pop();
                }
                "opt_u_opt_array" => {
                    reader.context().push(
                        field,
                        "Option<Vec<Option<u32>>>",
                        "type found, reading property",
                    );
                    // TODO: opt_u_opt_array = reader.read_nullable_array();
                    reader.context().pop();
                }
                "opt_str_opt_array" => {
                    reader.context().push(
                        field,
                        "Option<Option<Vec<String>>>",
                        "type found, reading property",
                    );
                    // TODO: opt_str_opt_array = reader.read_nullable_array();
                    reader.context().pop();
                }
                "u_array_array" => {
                    reader
                        .context()
                        .push(field, "Vec<Vec<u32>>", "type found, reading property");
                    // TODO: u_array_array = reader.read_array();
                    u_array_array_set = true;
                    reader.context().pop();
                }
                "u_opt_array_opt_array" => {
                    reader.context().push(
                        field,
                        "Vec<Option<Vec<u64>>>",
                        "type found, reading property",
                    );
                    // TODO: u_opt_array_opt_array = reader.read_array();
                    u_opt_array_opt_array_set = true;
                    reader.context().pop();
                }
                "u_array_opt_array_array" => {
                    reader.context().push(
                        field,
                        "Vec<Option<Vec<Vec<u64>>>>",
                        "type found, reading property",
                    );
                    // TODO: u_array_opt_array_array = reader.read_array();
                    u_array_opt_array_array_set = true;
                    reader.context().pop();
                }
                "crazy_array" => {
                    reader.context().push(
                        field,
                        "Option<Vec<Option<Vec<Option<Vec<u64>>>>>>",
                        "type found, reading property",
                    );
                    // TODO: crazy_array = reader.read_nullable_array();
                    reader.context().pop();
                }
                "object" => {
                    reader
                        .context()
                        .push(field, "AnotherType", "type found, reading property");
                    object = self.object.read(reader.clone());
                    object_set = true;
                    reader.context().pop();
                }
                "opt_object" => {
                    reader.context().push(
                        field,
                        "Option<AnotherType>",
                        "type found, reading property",
                    );
                    if !reader.is_next_nil() {
                        opt_object = Some(self.object.read(reader.clone()));
                    }
                    reader.context().pop();
                }
                "object_array" => {
                    reader.context().push(
                        field,
                        "Vec<AnotherType>",
                        "type found, reading property",
                    );
                    // TODO: object_array = reader.read_array();
                    object_array_set = true;
                    reader.context().pop();
                }
                "opt_object_array" => {
                    reader.context().push(
                        field,
                        "Option<Vec<AnotherType>>",
                        "type found, reading property",
                    );
                    // TODO: opt_object_array = reader.read_nullable_array();
                    reader.context().pop();
                }
                "en" => {
                    reader
                        .context()
                        .push(field, "CustomEnum", "type found, reading property");
                    let mut value = CustomEnum::_MAX_(0);
                    if reader.is_next_string() {
                        value = self
                            .en
                            .get_custom_enum_value(
                                reader.read_string().unwrap_or_default().as_str(),
                            )
                            .unwrap();
                    } else {
                        let val = reader.read_i32().unwrap_or_default();
                        let _ = value.sanitize_custom_enum_value(val);
                    }
                    en = value;
                    en_set = true;
                    reader.context().pop();
                }
                "opt_en" => {
                    reader.context().push(
                        field,
                        "Option<CustomEnum>",
                        "type found, reading property",
                    );
                    let mut value: Option<CustomEnum> = None;
                    if !reader.is_next_nil() {
                        if reader.is_next_string() {
                            value = Some(
                                self.en
                                    .get_custom_enum_value(
                                        reader.read_string().unwrap_or_default().as_str(),
                                    )
                                    .unwrap(),
                            );
                        } else {
                            let val = reader.read_i32().unwrap_or_default();
                            let _ = value
                                .unwrap_or(CustomEnum::_MAX_(0))
                                .sanitize_custom_enum_value(val);
                        }
                    } else {
                        value = None;
                    }
                    opt_en = value;
                    reader.context().pop();
                }
                "en_array" => {
                    reader
                        .context()
                        .push(field, "Vec<CustomEnum>", "type found, reading property");
                    // TODO: en_array = reader.read_array();
                    en_array_set = true;
                    reader.context().pop();
                }
                "opt_en_array" => {
                    reader.context().push(
                        field,
                        "Option<Vec<CustomEnum>>",
                        "type found, reading property",
                    );
                    // TODO: opt_en_array = reader.read_nullable_array();
                    reader.context().pop();
                }
                _ => {
                    reader
                        .context()
                        .push(field, "unknown", "searching for property type");
                }
            }
        }

        if !string_set {
            let custom_error = reader
                .context()
                .print_with_context("Missing required property: 'string: String'");
            Err(custom_error.into())
        }
        if !u_set {
            let custom_error = reader
                .context()
                .print_with_context("Missing required property: 'u: uint'");
            Err(custom_error.into())
        }
        if !uint8_set {
            let custom_error = reader
                .context()
                .print_with_context("Missing required property: 'uint8: u8'");
            Err(custom_error.into())
        }
        if !uint16_set {
            let custom_error = reader
                .context()
                .print_with_context("Missing required property: 'uint16: u16'");
            Err(custom_error.into())
        }
        if !uint32_set {
            let custom_error = reader
                .context()
                .print_with_context("Missing required property: 'uint32: u32'");
            Err(custom_error.into())
        }
        if !uint64_set {
            let custom_error = reader
                .context()
                .print_with_context("Missing required property: 'uint64: u64'");
            Err(custom_error.into())
        }
        if !i_set {
            let custom_error = reader
                .context()
                .print_with_context("Missing required property: 'i: int'");
            Err(custom_error.into())
        }
        if !int8_set {
            let custom_error = reader
                .context()
                .print_with_context("Missing required property: 'int8: i8'");
            Err(custom_error.into())
        }
        if !int16_set {
            let custom_error = reader
                .context()
                .print_with_context("Missing required property: 'int16: i16'");
            Err(custom_error.into())
        }
        if !int32_set {
            let custom_error = reader
                .context()
                .print_with_context("Missing required property: 'int32: i32'");
            Err(custom_error.into())
        }
        if !int64_set {
            let custom_error = reader
                .context()
                .print_with_context("Missing required property: 'int64: i64'");
            Err(custom_error.into())
        }
        if !bigint_set {
            let custom_error = reader
                .context()
                .print_with_context("Missing required property: 'bigint: BigInt'");
            Err(custom_error.into())
        }
        if !bytes_set {
            let custom_error = reader
                .context()
                .print_with_context("Missing required property: 'bytes: Vec<u8>'");
            Err(custom_error.into())
        }
        if !boolean_set {
            let custom_error = reader
                .context()
                .print_with_context("Missing required property: 'boolean: bool'");
            Err(custom_error.into())
        }
        if !u_array_set {
            let custom_error = reader
                .context()
                .print_with_context("Missing required property: 'u_array: Vec<u32>'");
            Err(custom_error.into())
        }
        if !u_array_array_set {
            let custom_error = reader
                .context()
                .print_with_context("Missing required property: 'u_array_array: Vec<Vec<u32>>'");
            Err(custom_error.into())
        }
        if !u_opt_array_opt_array_set {
            let custom_error = reader.context().print_with_context(
                "Missing required property: 'u_opt_array_opt_array: Vec<Option<Vec<u64>>>'",
            );
            Err(custom_error.into())
        }
        if !u_array_opt_array_array_set {
            let custom_error = reader.context().print_with_context(
                "Missing required property: 'u_array_opt_array_array_set: Vec<Option<Vec<Vec<u64>>>>'",
            );
            Err(custom_error.into())
        }
        if !object_set {
            let custom_error = reader
                .context()
                .print_with_context("Missing required property: 'object: AnotherType'");
            Err(custom_error.into())
        }
        if !object_array_set {
            let custom_error = reader
                .context()
                .print_with_context("Missing required property: 'object_array: Vec<AnotherType>'");
            Err(custom_error.into())
        }
        if !en_set {
            let custom_error = reader
                .context()
                .print_with_context("Missing required property: 'en: CustomEnum'");
            Err(custom_error.into())
        }
        if !en_array_set {
            let custom_error = reader
                .context()
                .print_with_context("Missing required property: 'en_array: Vec<CustomEnum>'");
            Err(custom_error.into())
        }

        Ok(Self {
            string,
            opt_string,
            u,
            opt_u,
            uint8,
            uint16,
            uint32,
            uint64,
            i,
            int8,
            int16,
            int32,
            int64,
            bigint,
            opt_bigint,
            bytes,
            opt_bytes,
            boolean,
            opt_boolean,
            u_array,
            u_opt_array,
            opt_u_opt_array,
            opt_str_opt_array,
            u_array_array,
            u_opt_array_opt_array,
            u_array_opt_array_array,
            crazy_array,
            object,
            opt_object,
            object_array,
            opt_object_array,
            en,
            opt_en,
            en_array,
            opt_en_array,
        })
    }

    pub fn to_buffer(&mut self) -> Vec<u8> {
        todo!()
    }

    pub fn from_buffer(&mut self) -> Self {
        todo!()
    }

    pub fn write<W: Write>(&mut self, writer: W) {
        todo!()
    }

    pub fn read<R: Read>(&mut self, reader: R) -> Self {
        todo!()
    }
}
