pub use polywrap_wasm_rs::{abort, invoke, subinvoke};
pub use polywrap_wasm_rs::{Context, Read, ReadDecoder, Write, WriteEncoder, WriteSizer};

mod mutation;
mod query;

pub use mutation::{mutation_method_wrapped, InputMutationMethod};
pub use query::{object_method_wrapped, query_method_wrapped};
pub use query::{AnotherType, CustomEnum, CustomType};
pub use query::{InputObjectMethod, InputQueryMethod};
pub use query::{TestImportAnotherObject, TestImportEnum, TestImportObject, TestImportQuery};
