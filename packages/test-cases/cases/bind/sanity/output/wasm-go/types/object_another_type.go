package types

import (
	"github.com/polywrap/go-wrap/polywrap/msgpack"
)

type AnotherType struct {
	Prop     *string
	Circular *CustomType
	M_const  *string
}

func AnotherTypeToBuffer(value *AnotherType) []byte {
	return serializeAnotherType(value)
}

func AnotherTypeFromBuffer(data []byte) *AnotherType {
	return deserializeAnotherType(data)
}

func AnotherTypeWrite(writer msgpack.Write, value *AnotherType) {
	writeAnotherType(writer, value)
}

func AnotherTypeRead(reader msgpack.Read) *AnotherType {
	return readAnotherType(reader)
}
