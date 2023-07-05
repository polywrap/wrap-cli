package test_import

import (
	"github.com/polywrap/go-wrap/polywrap/msgpack"
)

func serializeTestImport_Env(value *TestImport_Env) []byte {
	ctx := msgpack.NewContext("Serializing (encoding) env-type: TestImport_Env")
	encoder := msgpack.NewWriteEncoder(ctx)
	writeTestImport_Env(encoder, value)
	return encoder.Buffer()
}

func writeTestImport_Env(writer msgpack.Write, value *TestImport_Env) {
	writer.WriteMapLength(1)
	writer.Context().Push("EnviroProp", "string", "writing property")
	writer.WriteString("EnviroProp")
	{
		v := value.EnviroProp
		writer.WriteString(v)
	}
	writer.Context().Pop()
}

func deserializeTestImport_Env(data []byte) *TestImport_Env {
	ctx := msgpack.NewContext("Deserializing (decoding) env-type: TestImport_Env")
	reader := msgpack.NewReadDecoder(ctx, data)
	return readTestImport_Env(reader)
}

func readTestImport_Env(reader msgpack.Read) *TestImport_Env {
  var (
		_enviroProp    string
		_enviroPropSet bool
  )

	for i := int32(reader.ReadMapLength()); i > 0; i-- {
		field := reader.ReadString()
		reader.Context().Push(field, "unknown", "searching for property type")
		switch field {
		case "EnviroProp":
			reader.Context().Push(field, "string", "type found, reading property")
			_enviroProp = reader.ReadString()
			_enviroPropSet = true
			reader.Context().Pop()
		}
		reader.Context().Pop()
	}

	if !_enviroPropSet {
		panic(reader.Context().PrintWithContext("Missing required property: 'enviroProp: String'"))
	}

	return &TestImport_Env{
		EnviroProp: _enviroProp,
	}
}
