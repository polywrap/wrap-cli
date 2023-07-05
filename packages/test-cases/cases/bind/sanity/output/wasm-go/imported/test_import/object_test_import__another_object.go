package test_import

import (
	"github.com/polywrap/go-wrap/polywrap/msgpack"
)

type TestImport_AnotherObject struct {
	Prop string
}

func TestImport_AnotherObjectToBuffer(value *TestImport_AnotherObject) []byte {
	return serializeTestImport_AnotherObject(value)
}

func TestImport_AnotherObjectFromBuffer(data []byte) *TestImport_AnotherObject {
	return deserializeTestImport_AnotherObject(data)
}

func TestImport_AnotherObjectWrite(writer msgpack.Write, value *TestImport_AnotherObject) {
	writeTestImport_AnotherObject(writer, value)
}

func TestImport_AnotherObjectRead(reader msgpack.Read) *TestImport_AnotherObject {
	return readTestImport_AnotherObject(reader)
}
