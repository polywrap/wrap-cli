package module

import "github.com/testorg/testrepo/wrap/types"

func Method2(args *types.ArgsMethod2) []types.SanityEnum {
	return args.EnumArray
}
