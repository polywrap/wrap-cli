package module

import "github.com/testorg/testrepo/wrap/types"

//go:generate polywrap build -v -m ../polywrap.yaml -o ../build
func ExternalEnvMethod(env *types.Env) types.Env {
	return *env
}
