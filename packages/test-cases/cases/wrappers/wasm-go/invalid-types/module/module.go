package module

import (
	"github.com/testorg/testrepo/wrap/types"
)

//go:generate polywrap build -v -m ../polywrap.yaml -o ../build
func BoolMethod(args *types.MethodArgsBoolMethod) bool {
	return args.Arg
}

func IntMethod(args *types.MethodArgsIntMethod) int32 {
	return args.Arg
}

func UIntMethod(args *types.MethodArgsUIntMethod) uint32 {
	return args.Arg
}

func BytesMethod(args *types.MethodArgsBytesMethod) []byte {
	return args.Arg
}

func ArrayMethod(args *types.MethodArgsArrayMethod) []string {
	return args.Arg
}
