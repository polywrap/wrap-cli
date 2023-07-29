package test_import

import (
	"github.com/polywrap/go-wrap/msgpack"
)

type TestImport_Env struct {
	Object         TestImport_AnotherObject `json:"object"`
	OptObject      *TestImport_AnotherObject `json:"optObject"`
	ObjectArray    []TestImport_AnotherObject `json:"objectArray"`
	OptObjectArray []*TestImport_AnotherObject `json:"optObjectArray"`
	En             TestImport_Enum `json:"en"`
	OptEnum        *TestImport_Enum `json:"optEnum"`
	EnumArray      []TestImport_Enum `json:"enumArray"`
	OptEnumArray   []*TestImport_Enum `json:"optEnumArray"`
}

func TestImport_EnvToBuffer(value *TestImport_Env) []byte {
	return serializeTestImport_Env(value)
}

func TestImport_EnvFromBuffer(data []byte) *TestImport_Env {
	return deserializeTestImport_Env(data)
}

func TestImport_EnvWrite(writer msgpack.Write, value *TestImport_Env) {
	writeTestImport_Env(writer, value)
}

func TestImport_EnvRead(reader msgpack.Read) *TestImport_Env {
	return readTestImport_Env(reader)
}
