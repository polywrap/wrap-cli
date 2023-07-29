package test_import

import (
	"github.com/polywrap/go-wrap/msgpack"
)

type TestImport_Object struct {
	Object         TestImport_AnotherObject `json:"object"`
	OptObject      *TestImport_AnotherObject `json:"optObject"`
	ObjectArray    []TestImport_AnotherObject `json:"objectArray"`
	OptObjectArray []*TestImport_AnotherObject `json:"optObjectArray"`
	En             TestImport_Enum `json:"en"`
	OptEnum        *TestImport_Enum `json:"optEnum"`
	EnumArray      []TestImport_Enum `json:"enumArray"`
	OptEnumArray   []*TestImport_Enum `json:"optEnumArray"`
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
