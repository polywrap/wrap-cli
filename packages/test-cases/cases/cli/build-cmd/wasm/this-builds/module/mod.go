package module

import "example.com/go-wrap-test/main/types"

func Method(args *types.MethodArgsMethod) string {
	return args.Arg
}
