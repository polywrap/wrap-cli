package test_import

import (
	"github.com/consideritdone/polywrap-go/polywrap/msgpack"
)

type TestImport_Object struct {
	Object         TestImport_AnotherObject
	OptObject      *TestImport_AnotherObject
	ObjectArray    []TestImport_AnotherObject
	OptObjectArray []*TestImport_AnotherObject
	En             TestImport_Enum
	OptEnum        *TestImport_Enum
	EnumArray      []TestImport_Enum
	OptEnumArray   []*TestImport_Enum
}

func TestImport_ObjectToBuffer(value *TestImport_Object) []byte {
	return serializeTestImport_Object(value)
}

func TestImport_ObjectFromBuffer(data []byte) *TestImport_Object {
	return deserializeTestImport_Object(data)
}

func TestImport_ObjectWrite(writer msgpack.Write, value *TestImport_Object) {
	writeTestImport_Object(writer, value)
}

func TestImport_ObjectRead(reader msgpack.Read) *TestImport_Object {
	return readTestImport_Object(reader)
}
