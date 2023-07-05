package types

import (
	"github.com/polywrap/go-wrap/polywrap/msgpack"
)

func serializeAnotherType(value *AnotherType) []byte {
	ctx := msgpack.NewContext("Serializing (encoding) env-type: AnotherType")
	encoder := msgpack.NewWriteEncoder(ctx)
	writeAnotherType(encoder, value)
	return encoder.Buffer()
}

func writeAnotherType(writer msgpack.Write, value *AnotherType) {
	writer.WriteMapLength(3)
	writer.Context().Push("Prop", "*string", "writing property")
	writer.WriteString("Prop")
	{
		v := value.Prop
		if v == nil {
			writer.WriteNil()
		} else {
			writer.WriteString(*v)
		}
	}
	writer.Context().Pop()
	writer.Context().Push("Circular", "*CustomType", "writing property")
	writer.WriteString("Circular")
	{
		v := value.Circular
		CustomTypeWrite(writer, v)
	}
	writer.Context().Pop()
	writer.Context().Push("M_const", "*string", "writing property")
	writer.WriteString("M_const")
	{
		v := value.M_const
		if v == nil {
			writer.WriteNil()
		} else {
			writer.WriteString(*v)
		}
	}
	writer.Context().Pop()
}

func deserializeAnotherType(data []byte) *AnotherType {
	ctx := msgpack.NewContext("Deserializing (decoding) env-type: AnotherType")
	reader := msgpack.NewReadDecoder(ctx, data)
	return readAnotherType(reader)
}

func readAnotherType(reader msgpack.Read) *AnotherType {
	var (
		_prop     *string
		_circular *CustomType
		_const    *string
	)

	for i := int32(reader.ReadMapLength()); i > 0; i-- {
		field := reader.ReadString()
		reader.Context().Push(field, "unknown", "searching for property type")
		switch field {
		case "Prop":
			reader.Context().Push(field, "*string", "type found, reading property")
			if !reader.IsNil() {
				v := reader.ReadString()
				_prop = &v
			}
			reader.Context().Pop()
		case "Circular":
			reader.Context().Push(field, "*CustomType", "type found, reading property")
			if v := CustomTypeRead(reader); v != nil {
				_circular = v
			}
			reader.Context().Pop()
		case "M_const":
			reader.Context().Push(field, "*string", "type found, reading property")
			if !reader.IsNil() {
				v := reader.ReadString()
				_const = &v
			}
			reader.Context().Pop()
		}
		reader.Context().Pop()
	}

	return &AnotherType{
		Prop:     _prop,
		Circular: _circular,
		M_const:  _const,
	}
}
