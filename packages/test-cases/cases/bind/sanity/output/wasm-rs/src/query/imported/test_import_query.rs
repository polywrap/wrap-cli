use super::{TestImportEnum, TestImportObject};
use crate::{subinvoke, Context, Read, ReadDecoder, Write, WriteEncoder, WriteSizer};
use num_bigint::BigInt;
use std::io::{Error, ErrorKind, Result};

pub const URI: String = "testimport.uri.eth".to_string();

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TestImportQuery;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InputImportedMethod {
    string: String,
    opt_string: Option<String>,
    u: u32,
    opt_u: Option<u32>,
    u_array_array: Vec<Vec<u32>>,
    object: TestImportObject,
    opt_object: Option<TestImportObject>,
    object_array: Vec<TestImportObject>,
    opt_object_array: Option<Vec<TestImportObject>>,
    en: TestImportEnum,
    opt_enum: Option<TestImportEnum>,
    enum_array: Vec<TestImportEnum>,
    opt_enum_array: Option<Vec<TestImportEnum>>,
}

impl InputImportedMethod {
    pub fn imported_method(&mut self) -> TestImportObject {
        let args = self.serialize_imported_method_args();
        let result = subinvoke::w3_subinvoke(
            URI,
            "query".to_string(),
            "imported_method".to_string(),
            args,
        )
        .unwrap_or_default();
        self.deserialize_imported_method_result(result.as_slice())
    }

    pub fn serialize_imported_method_args(&mut self) -> Vec<u8> {
        let mut sizer_context = Context::new();
        sizer_context.description =
            "Serializing (sizing) imported query-type: InputImportedMethod".to_string();
        let sizer = WriteSizer::new(sizer_context);
        self.write_imported_method_args(sizer);
        let buffer: Vec<u8> = Vec::with_capacity(sizer.get_length() as usize);
        let mut encoder_context = Context::new();
        encoder_context.description =
            "Serializing (encoding) imported query-type: InputImportedMethod".to_string();
        let encoder = WriteEncoder::new(buffer.as_slice(), encoder_context);
        self.write_imported_method_args(encoder);
        buffer
    }

    pub fn write_imported_method_args<W: Write>(&mut self, mut writer: W) {
        writer.write_map_length(13);
        writer
            .context()
            .push("string", "String", "writing property");
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

        writer
            .context()
            .push("u_array_array", "Vec<Vec<u32>>", "writing property");
        writer.write_string("u_array_array".to_string());
        // TODO: writer.write_array();
        writer.context().pop();

        writer
            .context()
            .push("object", "TestImportObject", "writing property");
        writer.write_string("object".to_string());
        self.object.write(writer.to_owned());
        writer.context().pop();
        writer
            .context()
            .push("opt_object", "Option<TestImportObject>", "writing property");
        writer.write_string("opt_object".to_string());
        if self.opt_object.is_some() {
            self.opt_object.unwrap().write(writer.to_owned());
        } else {
            writer.write_nil();
        }
        writer.context().pop();
        writer
            .context()
            .push("object_array", "Vec<TestImportObject>", "writing property");
        writer.write_string("object_array".to_string());
        // TODO: writer.write_array();
        writer.context().pop();
        writer.context().push(
            "opt_object_array",
            "Option<Vec<TestImportObject>>",
            "writing property",
        );
        writer.write_string("opt_object_array".to_string());
        // TODO: writer.write_nullable_array();
        writer.context().pop();
        writer
            .context()
            .push("en", "TestImportEnum", "writing property");
        writer.write_string("en".to_string());
        // TODO: writer.write_i32();
        writer.context().pop();
        writer
            .context()
            .push("opt_enum", "Option<TestImportEnum>", "writing property");
        writer.write_string("opt_enum".to_string());
        // TODO: writer.write_nullable_i32();
        writer.context().pop();
        writer
            .context()
            .push("enum_array", "Vec<TestImportEnum>>", "writing property");
        writer.write_string("enum_array".to_string());
        // TODO: writer.write_array();
        writer.context().pop();
        writer.context().push(
            "opt_enum_array",
            "Option<Vec<CustomEnum>>>",
            "writing property",
        );
        writer.write_string("opt_enum_array".to_string());
        // TODO: writer.write_nullable_array();
        writer.context().pop();
    }

    pub fn deserialize_imported_method_result(&mut self, buffer: &[u8]) -> TestImportObject {
        let mut context = Context::new();
        context.description = "Deserializing imported query-type: ImportedMethod".to_string();
        let mut reader = ReadDecoder::new(buffer, context);

        reader.context().push(
            "imported_method",
            "TestImportObject",
            "reading function output",
        );
        if !reader.is_next_nil() {
            self.object = self.object.read(reader.clone());
        }
        let object = self.object.clone();
        reader.context().pop();
        object
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InputAnotherMethod {
    args: Vec<String>,
}

impl InputAnotherMethod {
    pub fn new() -> Self {
        Self { args: vec![] }
    }

    pub fn another_method(&mut self) -> i64 {
        let args = self.serialize_another_method_args();
        let result =
            subinvoke::w3_subinvoke(URI, "query".to_string(), "another_method".to_string(), args)
                .unwrap_or_default();
        self.deserialize_another_method_result(result.as_slice())
    }

    pub fn serialize_another_method_args(&mut self) -> Vec<u8> {
        let mut sizer_context = Context::new();
        sizer_context.description =
            "Serializing (sizing) imported query-type: InputAnotherMethod".to_string();
        let sizer = WriteSizer::new(sizer_context);
        self.write_another_method_args(sizer);

        let buffer: Vec<u8> = Vec::with_capacity(sizer.get_length() as usize);
        let mut encoder_context = Context::new();
        encoder_context.description =
            "Serializing (encoding) imported query-type: InputAnotherMethod".to_string();
        let encoder = WriteEncoder::new(buffer.as_slice(), encoder_context);
        self.write_another_method_args(encoder);
        buffer
    }

    pub fn write_another_method_args<W: Write>(&mut self, mut writer: W) {
        writer.write_map_length(1);
        writer
            .context()
            .push("arg", "Vec<String>", "writing property");
        writer.write_string("arg".to_string());
        // TODO: writer.write_array();
        writer.context().pop();
    }

    pub fn deserialize_another_method_result(&mut self, buffer: &[u8]) -> i64 {
        let mut context = Context::new();
        context.description = "Deserializing imported query-type: InputAnotherMethod".to_string();
        let mut reader = ReadDecoder::new(buffer, context);
        reader
            .context()
            .push("another_method", "i64", "reading function output");
        let result = reader.read_i64().unwrap_or_default();
        reader.context().pop();
        result
    }
}
