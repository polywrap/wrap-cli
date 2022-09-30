use uri::{ Uri };
use uri_resolution::{ UriResolutionContext };

struct InvokeOptions {
  uri: Uri;
  method: String;
  // TODO
  args: Option<Record<String, Variant>>;
  env: Option<Record<String, Variant>>;
  resolution_context: Option<UriResolutionContext>;
}

// TODO
pub type InvokeResult = Result<Variant, Error>;

struct InvokerOptions {
  invoke_options: InvokeOptions;
  encode_result: Option<bool>;
}

// TODO
pub trait Invoker {
  fn invoke_wrapper(self) -> ...;
  fn invoke(self) -> ...;
}

/*
TODO:
interface InvocableResult extends InvokeResult {
  encoded?: boolean
}

interface Invocable {
  invoke
}
*/
