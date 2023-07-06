package module

import "github.com/polywrap/cli/packages/test-cases/cases/cli/build-cmd/wasm/go/001-sanity/wrap/types"

func Method(args *types.ArgsMethod) string {
	return args.Arg
}
