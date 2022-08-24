package main

import (
	"github.com/testorg/testrepo/wrap/types"
	"github.com/consideritdone/polywrap-go/polywrap"
)

//export _wrap_invoke
func _wrap_invoke(methodSize, argsSize, envSize uint32) bool {
	args := polywrap.WrapInvokeArgs(methodSize, argsSize)
	switch args.Method {
	case "moduleMethod":
		return polywrap.WrapInvoke(args, envSize, types.ModuleMethodWrapped)
	case "objectMethod":
		return polywrap.WrapInvoke(args, envSize, types.ObjectMethodWrapped)
	case "optionalEnvMethod":
		return polywrap.WrapInvoke(args, envSize, types.OptionalEnvMethodWrapped)
	case "if":
		return polywrap.WrapInvoke(args, envSize, types.IfWrapped)
	default:
		return polywrap.WrapInvoke(args, envSize, nil)
	}
}

func main() {
}
