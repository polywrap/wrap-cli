package types

import (
	"github.com/polywrap/go-wrap/msgpack"
)

type CustomMapValue struct {
	Foo string
}

func CustomMapValueToBuffer(value *CustomMapValue) []byte {
	return serializeCustomMapValue(value)
}

func CustomMapValueFromBuffer(data []byte) *CustomMapValue {
	return deserializeCustomMapValue(data)
}

func CustomMapValueWrite(writer msgpack.Write, value *CustomMapValue) {
	writeCustomMapValue(writer, value)
}

func CustomMapValueRead(reader msgpack.Read) *CustomMapValue {
	return readCustomMapValue(reader)
}
