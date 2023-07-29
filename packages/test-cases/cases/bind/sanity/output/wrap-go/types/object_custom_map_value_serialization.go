package types

import (
	"github.com/polywrap/go-wrap/msgpack"
)

func serializeCustomMapValue(value *CustomMapValue) []byte {
	ctx := msgpack.NewContext("Serializing (encoding) env-type: CustomMapValue")
	encoder := msgpack.NewWriteEncoder(ctx)
	writeCustomMapValue(encoder, value)
	return encoder.Buffer()
}

func writeCustomMapValue(writer msgpack.Write, value *CustomMapValue) {
	writer.WriteMapLength(1)
	writer.Context().Push("foo", "string", "writing property")
	writer.WriteString("foo")
	{
		v := value.Foo
		writer.WriteString(v)
	}
	writer.Context().Pop()
}

func deserializeCustomMapValue(data []byte) *CustomMapValue {
	ctx := msgpack.NewContext("Deserializing (decoding) env-type: CustomMapValue")
	reader := msgpack.NewReadDecoder(ctx, data)
	return readCustomMapValue(reader)
}

func readCustomMapValue(reader msgpack.Read) *CustomMapValue {
	var (
		_foo    string
		_fooSet bool
	)

	for i := int32(reader.ReadMapLength()); i > 0; i-- {
		field := reader.ReadString()
		reader.Context().Push(field, "unknown", "searching for property type")
		switch field {
		case "foo":
			reader.Context().Push(field, "string", "type found, reading property")
			_foo = reader.ReadString()
			_fooSet = true
			reader.Context().Pop()
		}
		reader.Context().Pop()
	}

	if !_fooSet {
		panic(reader.Context().PrintWithContext("Missing required property: 'foo: String'"))
	}
	return &CustomMapValue{
		Foo: _foo,
	}
}
