package types

import (
	"github.com/polywrap/go-wrap/msgpack"
)

func serializeElse(value *Else) []byte {
	ctx := msgpack.NewContext("Serializing (encoding) env-type: Else")
	encoder := msgpack.NewWriteEncoder(ctx)
	writeElse(encoder, value)
	return encoder.Buffer()
}

func writeElse(writer msgpack.Write, value *Else) {
	writer.WriteMapLength(1)
	writer.Context().Push("else", "string", "writing property")
	writer.WriteString("else")
	{
		v := value.M_else
		writer.WriteString(v)
	}
	writer.Context().Pop()
}

func deserializeElse(data []byte) *Else {
	ctx := msgpack.NewContext("Deserializing (decoding) env-type: Else")
	reader := msgpack.NewReadDecoder(ctx, data)
	return readElse(reader)
}

func readElse(reader msgpack.Read) *Else {
	var (
		_else    string
		_elseSet bool
	)

	for i := int32(reader.ReadMapLength()); i > 0; i-- {
		field := reader.ReadString()
		reader.Context().Push(field, "unknown", "searching for property type")
		switch field {
		case "else":
			reader.Context().Push(field, "string", "type found, reading property")
			var ( value string )
			value = reader.ReadString()
			_else = value
			_elseSet = true
			reader.Context().Pop()
		}
		reader.Context().Pop()
	}

	if !_elseSet {
		panic(reader.Context().PrintWithContext("Missing required property: 'else: String'"))
	}
	return &Else{
		M_else: _else,
	}
}
