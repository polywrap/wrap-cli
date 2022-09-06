package module

import "github.com/testorg/testrepo/wrap/types"

//go:generate polywrap build -v -m ../polywrap.yaml -o ../build

func GetKey(args *types.MethodArgsGetKey) int32 {
	return args.Foo.M_map[args.Key]
}

func ReturnMap(args *types.MethodArgsReturnMap) map[string]int32 {
	return args.M_map
}

func ReturnCustomMap(args *types.MethodArgsReturnCustomMap) types.CustomMap {
	return args.Foo
}
