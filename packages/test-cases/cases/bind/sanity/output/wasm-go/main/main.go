package main

import (
	"github.com/testorg/testrepo/module/wrap/module_wrapped"
	"github.com/polywrap/go-wrap/polywrap"
)

//export _wrap_invoke
func _wrap_invoke(methodSize, argsSize, envSize uint32) bool {
	args := polywrap.WrapInvokeArgs(methodSize, argsSize)
	switch args.Method {
	case "moduleMethod":
		return polywrap.WrapInvoke(args, envSize, module_wrapped.ModuleMethodWrapped)
	case "objectMethod":
		return polywrap.WrapInvoke(args, envSize, module_wrapped.ObjectMethodWrapped)
	case "optionalEnvMethod":
		return polywrap.WrapInvoke(args, envSize, module_wrapped.OptionalEnvMethodWrapped)
	case "if":
		return polywrap.WrapInvoke(args, envSize, module_wrapped.IfWrapped)
	default:
		return polywrap.WrapInvoke(args, envSize, nil)
	}
}

func main() {
}
