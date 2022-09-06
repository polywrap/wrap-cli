package module

import (
	. "github.com/testorg/testrepo/wrap/types"
	"github.com/consideritdone/polywrap-go/polywrap"
	methods "github.com/testorg/testrepo/module"
)

func ModuleMethodWrapped(argsBuf []byte, envSize uint32) []byte {

	args := DeserializeModuleMethodArgs(argsBuf)

	result := methods.ModuleMethod(args)
	return SerializeModuleMethodResult(result)
}

func ObjectMethodWrapped(argsBuf []byte, envSize uint32) []byte {
	var env *Env
	if envSize == 0 {
		panic("Environment is not set, and it is required by method 'objectMethod'")
	}
	if envSize > 0 {
		envBuf := polywrap.WrapLoadEnv(envSize)
		env = EnvFromBuffer(envBuf)
	}

	args := DeserializeObjectMethodArgs(argsBuf)

	result := methods.ObjectMethod(args,env)
	return SerializeObjectMethodResult(result)
}

func OptionalEnvMethodWrapped(argsBuf []byte, envSize uint32) []byte {
	var env *Env
	if envSize > 0 {
		envBuf := polywrap.WrapLoadEnv(envSize)
		env = EnvFromBuffer(envBuf)
	}

	args := DeserializeOptionalEnvMethodArgs(argsBuf)

	result := methods.OptionalEnvMethod(args,env)
	return SerializeOptionalEnvMethodResult(result)
}

func IfWrapped(argsBuf []byte, envSize uint32) []byte {

	args := DeserializeIfArgs(argsBuf)

	result := methods.If(args)
	return SerializeIfResult(result)
}
