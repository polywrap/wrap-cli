package main

import (
	"github.com/testorg/testrepo/wrap/module"
	"github.com/consideritdone/polywrap-go/polywrap"
)

//export _wrap_invoke
func _wrap_invoke(methodSize, argsSize, envSize uint32) bool {
	args := polywrap.WrapInvokeArgs(methodSize, argsSize)
	switch args.Method {
	case "moduleMethod":
		return polywrap.WrapInvoke(args, envSize, module.ModuleMethodWrapped)
	case "objectMethod":
		return polywrap.WrapInvoke(args, envSize, module.ObjectMethodWrapped)
	case "optionalEnvMethod":
		return polywrap.WrapInvoke(args, envSize, module.OptionalEnvMethodWrapped)
	case "if":
		return polywrap.WrapInvoke(args, envSize, module.IfWrapped)
	default:
		return polywrap.WrapInvoke(args, envSize, nil)
	}
}

func main() {
}
