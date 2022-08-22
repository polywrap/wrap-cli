package main

import (
	"github.com/consideritdone/polywrap-go/examples/demo1/wrap/module"
	"github.com/consideritdone/polywrap-go/polywrap"
)

//export _wrap_invoke
func _wrap_invoke(methodSize, argsSize, envSize uint32) bool {
	args := polywrap.WrapInvokeArgs(methodSize, argsSize)
	switch args.method {
	case "moduleMethod":
		return polywrap.WrapInvoke(args, envSize, module.ModuleMethodWrapped)
	case "objectMethod":
		return polywrap.WrapInvoke(args, envSize, module.ObjectMethodWrapped)
	case "optionalEnvMethod":
		return polywrap.WrapInvoke(args, envSize, module.OptionalEnvMethodWrapped)
	default:
		return polywrap.WrapInvoke(args, envSize, nil)
	}
}

func main() {
}
