package main

import (
	moduleWrapped "example.com/go-wrap-test/main/module_wrapped"
	"github.com/polywrap/go-wrap/polywrap"
)

//export _wrap_invoke
func _wrap_invoke(methodSize, argsSize, envSize uint32) bool {
	args := polywrap.WrapInvokeArgs(methodSize, argsSize)
	switch args.Method {
	case "method":
		return polywrap.WrapInvoke(args, envSize, moduleWrapped.MethodWrapped)
	default:
		return polywrap.WrapInvoke(args, envSize, nil)
	}
}

func main() {
	
}
