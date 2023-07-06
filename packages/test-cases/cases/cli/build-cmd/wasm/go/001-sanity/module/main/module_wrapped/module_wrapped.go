package module_wrapped

import (
	methods "example.com/go-wrap-test"
)

func MethodWrapped(argsBuf []byte, envSize uint32) []byte {

	args := DeserializeMethodArgs(argsBuf)

	result := methods.Method(args)
	return SerializeMethodResult(result)
}
