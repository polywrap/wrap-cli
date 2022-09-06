package module

import (
	"github.com/consideritdone/polywrap-go/polywrap/msgpack/big"
	"github.com/testorg/testrepo/wrap/types"
)

//go:generate polywrap build -v -m ../polywrap.yaml -o ../build
func Method(args *types.MethodArgsMethod) *big.Int {
	result := new(big.Int).Mul(args.Arg1, args.Obj.Prop1)

	if args.Arg2 != nil {
		result = result.Mul(result, args.Arg2)
	}

	if args.Obj.Prop2 != nil {
		result = result.Mul(result, args.Obj.Prop2)
	}

	return result
}
