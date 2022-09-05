package module

import "github.com/testorg/testrepo/wrap/types"

//go:generate polywrap build -v -m ../polywrap.yaml -o ../build

func Method1(args *types.ArgsMethod1) types.SanityEnum {
	return args.En
}

func Method2(args *types.ArgsMethod2) []types.SanityEnum {
	return args.EnumArray
}
