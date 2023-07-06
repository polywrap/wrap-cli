package module

import "example.com/go-wrap-test/module/wrap/types"

func Method(args *types.MethodArgsMethod) string {
	return args.Arg
}
