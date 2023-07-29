package test_import

import (
	"github.com/polywrap/go-wrap/wrap"
)

func TestImport_ImportedMethod(uri string, args *TestImport_ArgsImportedMethod) (*TestImport_Object, error) {
	argsBuf := SerializeTestImport_ImportedMethodArgs(args)
	var (
		err error
		raw []byte
		data *TestImport_Object
	)
	raw, err = wrap.WrapSubinvokeImplementation("testimport.uri.eth", uri, "importedMethod", argsBuf)
	if err == nil {
		data = DeserializeTestImport_ImportedMethodResult(raw)
	}
	return data, err
}

func TestImport_AnotherMethod(uri string, args *TestImport_ArgsAnotherMethod) (int32, error) {
	argsBuf := SerializeTestImport_AnotherMethodArgs(args)
	var (
		err error
		raw []byte
		data int32
	)
	raw, err = wrap.WrapSubinvokeImplementation("testimport.uri.eth", uri, "anotherMethod", argsBuf)
	if err == nil {
		data = DeserializeTestImport_AnotherMethodResult(raw)
	}
	return data, err
}

func TestImport_ReturnsArrayOfEnums(uri string, args *TestImport_ArgsReturnsArrayOfEnums) ([]*TestImport_Enum_Return, error) {
	argsBuf := SerializeTestImport_ReturnsArrayOfEnumsArgs(args)
	var (
		err error
		raw []byte
		data []*TestImport_Enum_Return
	)
	raw, err = wrap.WrapSubinvokeImplementation("testimport.uri.eth", uri, "returnsArrayOfEnums", argsBuf)
	if err == nil {
		data = DeserializeTestImport_ReturnsArrayOfEnumsResult(raw)
	}
	return data, err
}
