package module

import (
	"github.com/testorg/testrepo/wrap/types"
	"github.com/valyala/fastjson"
)

func Parse(args *types.ArgsParse) *fastjson.Value {
	return fastjson.MustParse(args.Value)
}

func Stringify(args *types.ArgsStringify) string {
	str := ""
	for i := range args.Values {
		str += args.Values[i].String()
	}
	return str
}

func StringifyObject(args *types.ArgsStringifyObject) string {
	str := ""
	str += args.Object.JsonA.String()
	str += args.Object.JsonB.String()
	return str
}

func MethodJSON(args *types.ArgsMethodJSON) *fastjson.Value {
	result := new(fastjson.Arena).NewObject()
	result.Set("valueB", fastjson.MustParse("\""+args.ValueB+"\""))
	return result
}
