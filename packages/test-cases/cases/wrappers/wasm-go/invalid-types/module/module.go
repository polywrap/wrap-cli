package module

import (
	"github.com/testorg/testrepo/wrap/types"
)

//go:generate polywrap build -v -m ../polywrap.yaml -o ../build
func BoolMethod(args *types.ArgsBoolMethod) bool {
	return args.Arg
}

func IntMethod(args *types.ArgsIntMethod) int32 {
	return args.Arg
}

func UIntMethod(args *types.ArgsUIntMethod) uint32 {
	return args.Arg
}

func BytesMethod(args *types.ArgsBytesMethod) []byte {
	return args.Arg
}

func ArrayMethod(args *types.ArgsArrayMethod) []string {
	return args.Arg
}
