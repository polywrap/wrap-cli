package module

import (
	"github.com/testorg/testrepo/wrap/interfaces"
	"github.com/testorg/testrepo/wrap/types"
)

func ModuleImplementations(*types.ArgsModuleImplementations) []string {
	return interfaces.InterfaceImplementations()
}

func ModuleMethod(args *types.ArgsModuleMethod) types.ImplementationType {
	return args.Arg
}

func AbstractModuleMethod(args *types.ImplementationType) string {
	return args.Str
}
