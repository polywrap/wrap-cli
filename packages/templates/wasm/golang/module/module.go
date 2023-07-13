package module

import (
	"example.com/template-wasm-go/module/wrap/types"
)

func SampleMethod(args *types.ArgsSampleMethod) types.SampleResult {
	return types.SampleResult{
		Result: args.Arg,
	}
}
