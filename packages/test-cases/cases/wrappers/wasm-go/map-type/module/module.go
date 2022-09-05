package module

import "github.com/testorg/testrepo/wrap/types"

//go:generate polywrap build -v -m ../polywrap.yaml -o ../build

func GetKey(args *types.ArgsGetKey) int32 {
	return args.Foo.Map[args.Key]
}

func ReturnMap(args *types.ArgsReturnMap) map[string]int32 {
	return args.Map
}

func ReturnCustomMap(args *types.ArgsReturnCustomMap) types.CustomMap {
	return args.Foo
}
