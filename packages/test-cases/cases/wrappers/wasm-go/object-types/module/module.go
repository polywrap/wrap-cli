package module

import "github.com/testorg/testrepo/wrap/types"

//go:generate polywrap build -v -m ../polywrap.yaml -o ../build

func Method1(args *types.MethodArgsMethod1) []types.Output {
	out1 := types.Output{
		Prop: args.Arg1.Prop,
		Nested: types.Nested{
			Prop: args.Arg1.Nested.Prop,
		},
	}
	out2 := types.Output{}
	if args.Arg2 != nil {
		out2 = types.Output{
			Prop: args.Arg2.Prop,
			Nested: types.Nested{
				Prop: args.Arg2.Circular.Prop,
			},
		}
	}
	return []types.Output{out1, out2}
}

func Method2(args *types.MethodArgsMethod2) *types.Output {
	if args == nil {
		return nil
	}
	return &types.Output{
		Prop: args.Arg.Prop,
		Nested: types.Nested{
			Prop: args.Arg.Nested.Prop,
		},
	}
}

func Method3(args *types.MethodArgsMethod3) []*types.Output {
	out2 := &types.Output{
		Prop: args.Arg.Prop,
		Nested: types.Nested{
			Prop: args.Arg.Nested.Prop,
		},
	}
	return []*types.Output{nil, out2}
}

func Method5(args *types.MethodArgsMethod5) types.Output {
	return types.Output{
		Prop: string(args.Arg.Prop),
		Nested: types.Nested{
			Prop: "nested prop",
		},
	}
}
