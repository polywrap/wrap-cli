package module

import (
	"github.com/testorg/testrepo/wrap/types"
	"github.com/valyala/fastjson"
)

//go:generate polywrap build -v -m ../polywrap.yaml -o ../build

func Parse(args *types.MethodArgsParse) *fastjson.Value {
	return fastjson.MustParse(args.Value)
}

func Stringify(args *types.MethodArgsStringify) string {
	str := ""
	for i := range args.Values {
		str += args.Values[i].String()
	}
	return str
}

func StringifyObject(args *types.MethodArgsStringifyObject) string {
	str := ""
	str += args.Object.JsonA.String()
	str += args.Object.JsonB.String()
	return str
}

func MethodJSON(args *types.MethodArgsMethodJSON) *fastjson.Value {
	arena := new(fastjson.Arena)
	result := arena.NewObject()
	result.Set("valueA", arena.NewNumberInt(int(args.ValueA)))
	result.Set("valueB", arena.NewString(args.ValueB))
	if args.ValueC {
		result.Set("valueC", arena.NewTrue())
	} else {
		result.Set("valueC", arena.NewFalse())
	}
	return result
}
