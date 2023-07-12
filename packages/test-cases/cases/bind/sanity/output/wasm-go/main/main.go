package main

import (
	"github.com/testorg/testrepo/module/wrap/module_wrapped"
	"github.com/polywrap/go-wrap/wrap"
)

//export _wrap_invoke
func _wrap_invoke(methodSize, argsSize, envSize uint32) bool {
	args := wrap.WrapInvokeArgs(methodSize, argsSize)
	switch args.Method {
	case "moduleMethod":
		return wrap.WrapInvoke(args, envSize, module_wrapped.ModuleMethodWrapped)
	case "objectMethod":
		return wrap.WrapInvoke(args, envSize, module_wrapped.ObjectMethodWrapped)
	case "optionalEnvMethod":
		return wrap.WrapInvoke(args, envSize, module_wrapped.OptionalEnvMethodWrapped)
	case "if":
		return wrap.WrapInvoke(args, envSize, module_wrapped.IfWrapped)
	default:
		return wrap.WrapInvoke(args, envSize, nil)
	}
}

func main() {
}
