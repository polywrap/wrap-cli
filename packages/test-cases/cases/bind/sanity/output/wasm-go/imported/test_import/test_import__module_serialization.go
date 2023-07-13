package test_import

import (
	"github.com/polywrap/go-wrap/msgpack"
)

type ArgsImportedMethod struct {
	Str            string
	OptStr         *string
	U              uint32
	OptU           *uint32
	UArrayArray    [][]*uint32
	Object         TestImport_Object
	OptObject      *TestImport_Object
	ObjectArray    []TestImport_Object
	OptObjectArray []*TestImport_Object
	En             TestImport_Enum
	OptEnum        *TestImport_Enum
	EnumArray      []TestImport_Enum
	OptEnumArray   []*TestImport_Enum
}

func SerializeImportedMethodArgs(value *ArgsImportedMethod) []byte {
	ctx := msgpack.NewContext("Serializing module-type: ImportedMethod")
	encoder := msgpack.NewWriteEncoder(ctx)
	WriteImportedMethodArgs(encoder, value)
	return encoder.Buffer()
}

func WriteImportedMethodArgs(writer msgpack.Write, value *ArgsImportedMethod) {
	writer.WriteMapLength(13)
	writer.Context().Push("str", "string", "writing property")
	writer.WriteString("str")
	{
		v := value.Str
		writer.WriteString(v)
	}
	writer.Context().Pop()
	writer.Context().Push("optStr", "*string", "writing property")
	writer.WriteString("optStr")
	{
		v := value.OptStr
		if v == nil {
			writer.WriteNil()
		} else {
			writer.WriteString(*v)
		}
	}
	writer.Context().Pop()
	writer.Context().Push("u", "uint32", "writing property")
	writer.WriteString("u")
	{
		v := value.U
		writer.WriteU32(v)
	}
	writer.Context().Pop()
	writer.Context().Push("optU", "*uint32", "writing property")
	writer.WriteString("optU")
	{
		v := value.OptU
		if v == nil {
			writer.WriteNil()
		} else {
			writer.WriteU32(*v)
		}
	}
	writer.Context().Pop()
	writer.Context().Push("uArrayArray", "[][]*uint32", "writing property")
	writer.WriteString("uArrayArray")
	if value.UArrayArray == nil {
		writer.WriteNil()
	} else if len(value.UArrayArray) == 0 {
		writer.WriteNil()
	} else {
		writer.WriteArrayLength(uint32(len(value.UArrayArray)))
		for i0 := range value.UArrayArray {
			if value.UArrayArray[i0] == nil {
				writer.WriteNil()
			} else if len(value.UArrayArray[i0]) == 0 {
				writer.WriteNil()
			} else {
				writer.WriteArrayLength(uint32(len(value.UArrayArray[i0])))
				for i1 := range value.UArrayArray[i0] {
					{
						v := value.UArrayArray[i0][i1]
						if v == nil {
							writer.WriteNil()
						} else {
							writer.WriteU32(*v)
						}
					}
				}
			}
		}
	}
	writer.Context().Pop()
	writer.Context().Push("object", "TestImport_Object", "writing property")
	writer.WriteString("object")
	{
		v := value.Object
		TestImport_ObjectWrite(writer, &v)
	}
	writer.Context().Pop()
	writer.Context().Push("optObject", "*TestImport_Object", "writing property")
	writer.WriteString("optObject")
	{
		v := value.OptObject
		TestImport_ObjectWrite(writer, v)
	}
	writer.Context().Pop()
	writer.Context().Push("objectArray", "[]TestImport_Object", "writing property")
	writer.WriteString("objectArray")
	if value.ObjectArray == nil {
		writer.WriteNil()
	} else if len(value.ObjectArray) == 0 {
		writer.WriteNil()
	} else {
		writer.WriteArrayLength(uint32(len(value.ObjectArray)))
		for i0 := range value.ObjectArray {
			{
				v := value.ObjectArray[i0]
				TestImport_ObjectWrite(writer, &v)
			}
		}
	}
	writer.Context().Pop()
	writer.Context().Push("optObjectArray", "[]*TestImport_Object", "writing property")
	writer.WriteString("optObjectArray")
	if value.OptObjectArray == nil {
		writer.WriteNil()
	} else if len(value.OptObjectArray) == 0 {
		writer.WriteNil()
	} else {
		writer.WriteArrayLength(uint32(len(value.OptObjectArray)))
		for i0 := range value.OptObjectArray {
			{
				v := value.OptObjectArray[i0]
				TestImport_ObjectWrite(writer, v)
			}
		}
	}
	writer.Context().Pop()
	writer.Context().Push("en", "TestImport_Enum", "writing property")
	writer.WriteString("en")
	{
		v := value.En
		writer.WriteI32(int32(v))
	}
	writer.Context().Pop()
	writer.Context().Push("optEnum", "*TestImport_Enum", "writing property")
	writer.WriteString("optEnum")
	{
		v := value.OptEnum
		if v == nil {
			writer.WriteNil()
		} else {
			writer.WriteI32(int32(*v))
		}
	}
	writer.Context().Pop()
	writer.Context().Push("enumArray", "[]TestImport_Enum", "writing property")
	writer.WriteString("enumArray")
	if value.EnumArray == nil {
		writer.WriteNil()
	} else if len(value.EnumArray) == 0 {
		writer.WriteNil()
	} else {
		writer.WriteArrayLength(uint32(len(value.EnumArray)))
		for i0 := range value.EnumArray {
			{
				v := value.EnumArray[i0]
				writer.WriteI32(int32(v))
			}
		}
	}
	writer.Context().Pop()
	writer.Context().Push("optEnumArray", "[]*TestImport_Enum", "writing property")
	writer.WriteString("optEnumArray")
	if value.OptEnumArray == nil {
		writer.WriteNil()
	} else if len(value.OptEnumArray) == 0 {
		writer.WriteNil()
	} else {
		writer.WriteArrayLength(uint32(len(value.OptEnumArray)))
		for i0 := range value.OptEnumArray {
			{
				v := value.OptEnumArray[i0]
				if v == nil {
					writer.WriteNil()
				} else {
					writer.WriteI32(int32(*v))
				}
			}
		}
	}
	writer.Context().Pop()
}

func DeserializeImportedMethodResult(argsBuf []byte) *TestImport_Object {
	ctx := msgpack.NewContext("Deserializing module-type: ImportedMethod")
	reader := msgpack.NewReadDecoder(ctx, argsBuf)

	reader.Context().Push("importedMethod", "*TestImport_Object", "reading function output")
	var value *TestImport_Object
	if v := TestImport_ObjectRead(reader); v != nil {
		value = v
	}
	reader.Context().Pop()
	return value
}

type ArgsAnotherMethod struct {
	Arg []string
}

func SerializeAnotherMethodArgs(value *ArgsAnotherMethod) []byte {
	ctx := msgpack.NewContext("Serializing module-type: AnotherMethod")
	encoder := msgpack.NewWriteEncoder(ctx)
	WriteAnotherMethodArgs(encoder, value)
	return encoder.Buffer()
}

func WriteAnotherMethodArgs(writer msgpack.Write, value *ArgsAnotherMethod) {
	writer.WriteMapLength(1)
	writer.Context().Push("arg", "[]string", "writing property")
	writer.WriteString("arg")
	if value.Arg == nil {
		writer.WriteNil()
	} else if len(value.Arg) == 0 {
		writer.WriteNil()
	} else {
		writer.WriteArrayLength(uint32(len(value.Arg)))
		for i0 := range value.Arg {
			{
				v := value.Arg[i0]
				writer.WriteString(v)
			}
		}
	}
	writer.Context().Pop()
}

func DeserializeAnotherMethodResult(argsBuf []byte) int32 {
	ctx := msgpack.NewContext("Deserializing module-type: AnotherMethod")
	reader := msgpack.NewReadDecoder(ctx, argsBuf)

	reader.Context().Push("anotherMethod", "int32", "reading function output")
	var value int32
	value = reader.ReadI32()
	reader.Context().Pop()
	return value
}

type ArgsReturnsArrayOfEnums struct {
	Arg string
}

func SerializeReturnsArrayOfEnumsArgs(value *ArgsReturnsArrayOfEnums) []byte {
	ctx := msgpack.NewContext("Serializing module-type: ReturnsArrayOfEnums")
	encoder := msgpack.NewWriteEncoder(ctx)
	WriteReturnsArrayOfEnumsArgs(encoder, value)
	return encoder.Buffer()
}

func WriteReturnsArrayOfEnumsArgs(writer msgpack.Write, value *ArgsReturnsArrayOfEnums) {
	writer.WriteMapLength(1)
	writer.Context().Push("arg", "string", "writing property")
	writer.WriteString("arg")
	{
		v := value.Arg
		writer.WriteString(v)
	}
	writer.Context().Pop()
}

func DeserializeReturnsArrayOfEnumsResult(argsBuf []byte) []*TestImport_Enum_Return {
	ctx := msgpack.NewContext("Deserializing module-type: ReturnsArrayOfEnums")
	reader := msgpack.NewReadDecoder(ctx, argsBuf)

	reader.Context().Push("returnsArrayOfEnums", "[]*TestImport_Enum_Return", "reading function output")
	var value []*TestImport_Enum_Return
	if reader.IsNil() {
		value = nil
	} else {
		ln0 := reader.ReadArrayLength()
		value = make([]*TestImport_Enum_Return, ln0)
		for i0 := uint32(0); i0 < ln0; i0++ {
			if !reader.IsNil() {
				v := TestImport_Enum_Return(reader.ReadI32())
				SanitizeTestImport_Enum_ReturnValue(int32(v))
				_returnsArrayOfEnums[i0] = &v
			}
		}
	}
	reader.Context().Pop()
	return value
}
