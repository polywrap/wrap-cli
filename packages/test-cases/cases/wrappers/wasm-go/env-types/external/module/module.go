package module

import "github.com/testorg/testrepo/wrap/types"

func ExternalEnvMethod(args *types.ArgsExternalEnvMethod, env *types.Env) types.Env {
	return *env
}
