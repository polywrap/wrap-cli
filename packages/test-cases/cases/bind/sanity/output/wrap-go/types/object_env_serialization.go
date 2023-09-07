package types

import (
	"github.com/polywrap/go-wrap/msgpack"
)

func serializeEnv(value *Env) []byte {
	ctx := msgpack.NewContext("Serializing (encoding) env-type: Env")
	encoder := msgpack.NewWriteEncoder(ctx)
	writeEnv(encoder, value)
	return encoder.Buffer()
}

func writeEnv(writer msgpack.Write, value *Env) {
	writer.WriteMapLength(3)
	writer.Context().Push("prop", "string", "writing property")
	writer.WriteString("prop")
	{
		v := value.Prop
		writer.WriteString(v)
	}
	writer.Context().Pop()
	writer.Context().Push("optProp", "*string", "writing property")
	writer.WriteString("optProp")
	{
		v := value.OptProp
		if v == nil {
			writer.WriteNil()
		} else {
			writer.WriteString(*v)
		}
	}
	writer.Context().Pop()
	writer.Context().Push("optMap", "map[string]*int32", "writing property")
	writer.WriteString("optMap")
	if value.OptMap == nil {
		writer.WriteNil()
	} else if len(value.OptMap) == 0 {
		writer.WriteNil()
	} else {
		for i0 := range value.OptMap {
			writer.WriteString(i0)
			{
				v := value.OptMap[i0]
				if v == nil {
					writer.WriteNil()
				} else {
					writer.WriteI32(*v)
				}
			}
		}
	}
	writer.Context().Pop()
}

func deserializeEnv(data []byte) *Env {
	ctx := msgpack.NewContext("Deserializing (decoding) env-type: Env")
	reader := msgpack.NewReadDecoder(ctx, data)
	return readEnv(reader)
}

func readEnv(reader msgpack.Read) *Env {
	var (
		_prop    string
		_propSet bool
		_optProp *string
		_optMap  map[string]*int32
	)

	for i := int32(reader.ReadMapLength()); i > 0; i-- {
		field := reader.ReadString()
		reader.Context().Push(field, "unknown", "searching for property type")
		switch field {
		case "prop":
			reader.Context().Push(field, "string", "type found, reading property")
			var ( value string )
			value = reader.ReadString()
			_prop = value
			_propSet = true
			reader.Context().Pop()
		case "optProp":
			reader.Context().Push(field, "*string", "type found, reading property")
			var ( value *string )
			value = nil
			if !reader.IsNil() {
				v := reader.ReadString()
				value = &v
			}
			_optProp = value
			reader.Context().Pop()
		case "optMap":
			reader.Context().Push(field, "map[string]*int32", "type found, reading property")
			var ( value map[string]*int32 )
			value = nil
			if reader.IsNil() {
				value = nil
			} else {
				value = make(map[string]*int32)
				ln0 := reader.ReadMapLength()
				for j0 := uint32(0); j0 < ln0; j0++ {
					i0 := reader.ReadString()
					if !reader.IsNil() {
						v := reader.ReadI32()
						value[i0] = &v
					}
				}
			}
			_optMap = value
			reader.Context().Pop()
		}
		reader.Context().Pop()
	}

	if !_propSet {
		panic(reader.Context().PrintWithContext("Missing required property: 'prop: String'"))
	}
	return &Env{
		Prop:    _prop,
		OptProp: _optProp,
		OptMap:  _optMap,
	}
}
