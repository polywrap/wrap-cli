//mod utils;
pub mod abort;
pub mod invoke;
pub mod msgpack;
pub mod subinvoke;

pub use msgpack::{
    context::Context, read::Read, read_decoder::ReadDecoder, write::Write,
    write_encoder::WriteEncoder, write_sizer::WriteSizer,
};
pub type Result = std::result::Result<(), failure::Error>;