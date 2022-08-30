package module

import "github.com/testorg/testrepo/wrap/types"

func Method1(args *types.ArgsMethod1) types.SanityEnum {
	return args.En
}
