package module_wrapped

import (
	. "example.com/go-wrap-test/main/types"
	"github.com/polywrap/go-wrap/polywrap/msgpack"
)

func DeserializeMethodArgs(argsBuf []byte) *MethodArgsMethod {
	ctx := msgpack.NewContext("Deserializing module-type: Method")
	reader := msgpack.NewReadDecoder(ctx, argsBuf)

	var (
		_arg    string
		_argSet bool
	)

	for i := int32(reader.ReadMapLength()); i > 0; i-- {
		field := reader.ReadString()
		reader.Context().Push(field, "unknown", "searching for property type")
		switch field {
		case "arg":
			reader.Context().Push(field, "string", "type found, reading property")
			_arg = reader.ReadString()
			_argSet = true
			reader.Context().Pop()
		}
		reader.Context().Pop()
	}

	if !_argSet {
		panic(reader.Context().PrintWithContext("Missing required property: 'arg: String'"))
	}

	return &MethodArgsMethod{
		Arg: _arg,
	}
}

func SerializeMethodResult(value string) []byte {
	ctx := msgpack.NewContext("Serializing module-type: Method")
	encoder := msgpack.NewWriteEncoder(ctx)
	WriteMethodResult(encoder, value);
	return encoder.Buffer()
}

func WriteMethodResult(writer msgpack.Write, value string) {
	writer.Context().Push("method", "string", "writing property")
	{
		v := value
		writer.WriteString(v)
	}
	writer.Context().Pop()
}
