package module

import (
	"github.com/testorg/testrepo/wrap/interfaces"
	"github.com/testorg/testrepo/wrap/types"
)

//go:generate polywrap build -v -m ../polywrap.yaml -o ../build

func ModuleImplementations() []string {
	return interfaces.InterfaceImplementations()
}

func ModuleMethod(args *types.MethodArgsModuleMethod) types.ImplementationType {
	return args.Arg
}

func AbstractModuleMethod(args *types.MethodArgsAbstractModuleMethod) string {
	return args.Arg.Str
}
