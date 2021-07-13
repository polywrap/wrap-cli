pub mod serialization;
pub mod wrapped;
pub use serialization::{
    InputMutationMethod,
    InputObjectMethod,
};
pub use wrapped::{
    mutation_method_wrapped,
    object_method_wrapped,
};