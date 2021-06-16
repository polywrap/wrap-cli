use crate::{Context, Read, ReadDecoder, Write, WriteEncoder, WriteSizer};

#[derive(Debug)]
pub struct InputQueryMethod {
    string: String,
    opt_string: String,
    //en: CustomEnum,
    //opt_enum: Option<CustomEnum>,
    //enum_array: Vec<CustomEnum>,
    //opt_enum_array: Vec<Option<CustomEnum>>,
}

#[derive(Debug)]
pub struct InputObjectMethod {
    //object: AnotherType
//opt_object: Option<AnotherType>,
//object_array: Vec<AnotherType>,
//opt_object_array: Vec<Option<AnotherType>>,
}
