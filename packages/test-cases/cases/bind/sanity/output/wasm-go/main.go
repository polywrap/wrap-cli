package main

import (
	"github.com/consideritdone/polywrap-go/examples/demo1/wrap/module"
	"github.com/consideritdone/polywrap-go/polywrap"
)

//export _wrap_invoke
func _wrap_invoke(methodSize, argsSize, envSize uint32) bool {
    args := polywrap.WrapInvokeArgs(methodSize, argsSize)

	if args.Method == "moduleMethod" {
		return polywrap.WrapInvoke(args, envSize, module.ModuleMethodWrapped)
	} else if args.Method == "objectMethod" {
        return polywrap.WrapInvoke(args, envSize, module.ObjectMethodWrapped)
	} else if args.Method == "optionalEnvMethod" {
        return polywrap.WrapInvoke(args, envSize, module.OptionalEnvMethodWrapped)
	} else {
		return polywrap.WrapInvoke(args, envSize, nil)
	}
}

func main() {
}
