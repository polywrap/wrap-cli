package module

import "github.com/testorg/testrepo/wrap/types"

func I8Method(args *types.ArgsI8Method) int8 {
	return args.First + args.Second
}

func U8Method(args *types.ArgsU8Method) uint8 {
	return args.First + args.Second
}

func I16Method(args *types.ArgsI16Method) int16 {
	return args.First + args.Second
}

func U16Method(args *types.ArgsU16Method) uint16 {
	return args.First + args.Second
}

func I32Method(args *types.ArgsI32Method) int32 {
	return args.First + args.Second
}

func U32Method(args *types.ArgsU32Method) uint32 {
	return args.First + args.Second
}
