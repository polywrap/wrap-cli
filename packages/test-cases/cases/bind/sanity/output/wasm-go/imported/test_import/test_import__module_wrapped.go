package test_import

import (
	"github.com/consideritdone/polywrap-go/polywrap"
)

func MethodImportedMethod(uri string, args *ArgsImportedMethod) (*TestImport_Object, error) {
	argsBuf := SerializeImportedMethodArgs(args)
	data, err := polywrap.WrapSubinvokeImplementation("testimport.uri.eth", uri, "importedMethod", argsBuf)
	if err != nil {
		return nil, err
	}
	return DeserializeImportedMethodResult(data), nil
}

func MethodAnotherMethod(uri string, args *ArgsAnotherMethod) (int32, error) {
	argsBuf := SerializeAnotherMethodArgs(args)
	data, err := polywrap.WrapSubinvokeImplementation("testimport.uri.eth", uri, "anotherMethod", argsBuf)
	if err != nil {
		return nil, err
	}
	return DeserializeAnotherMethodResult(data), nil
}
