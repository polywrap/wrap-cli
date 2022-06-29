// Why do we need 2 types of "invoke" interfaces?
// Anser: options & return values are different
// Invoker = Client
// Invocable = WasmWrapper, PluginWrapper

/*
  User -> "execute this invocation, give me {}"
    Invoker -> "okay, resolve uri, invoke invokable"
      Invokable -> return(data, error, encoded?)
    if (result.encoded && !options.encode) {
      return {
        data: decode(result.data),
        error: result.error
      }
    } else {
      return {
        data: result.data,
        error: result.error
      };
    }
*/
