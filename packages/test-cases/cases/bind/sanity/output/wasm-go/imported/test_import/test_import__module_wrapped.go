package test_import

import (
	"github.com/polywrap/go-wrap/polywrap"
)

func MethodImportedMethod(uri string, args *ArgsImportedMethod) (*TestImport_Object, error) {
	argsBuf := SerializeImportedMethodArgs(args)
	var (
		err error
		raw []byte
		data *TestImport_Object
	)
	raw, err = polywrap.WrapSubinvokeImplementation("testimport.uri.eth", uri, "importedMethod", argsBuf)
	if err == nil {
		data = DeserializeImportedMethodResult(raw)
	}
	return data, err
}

func MethodAnotherMethod(uri string, args *ArgsAnotherMethod) (int32, error) {
	argsBuf := SerializeAnotherMethodArgs(args)
	var (
		err error
		raw []byte
		data int32
	)
	raw, err = polywrap.WrapSubinvokeImplementation("testimport.uri.eth", uri, "anotherMethod", argsBuf)
	if err == nil {
		data = DeserializeAnotherMethodResult(raw)
	}
	return data, err
}
