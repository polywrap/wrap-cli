package module

import (
	"github.com/testorg/testrepo/wrap/types"
)

func ModuleMethod(args *types.ArgsModuleMethod) types.ImplementationType {
	return args.Arg
}
