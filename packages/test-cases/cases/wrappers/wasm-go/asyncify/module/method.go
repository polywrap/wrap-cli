package module

import (
	"strconv"

	"github.com/testorg/testrepo/wrap/imported/storage"
	"github.com/testorg/testrepo/wrap/types"
)

//go:generate polywrap build -v -m ../polywrap.yaml -o ../build

func GetData() uint32 {
	res, err := storage.MethodGetData(nil)
	if err != nil {
		panic(err)
	}
	return uint32(res)
}

func ReturnTrue() bool {
	return true
}

func SetDataWithLargeArgs(args *types.MethodArgsSetDataWithLargeArgs) string {
	largeString := args.Value
	num, err := strconv.ParseInt(largeString, 10, 32)
	if err != nil {
		panic(err)
	}
	_, err = storage.MethodSetData(&storage.ArgsSetData{Value: int32(num)})
	if err != nil {
		panic(err)
	}
	return largeString
}

func SetDataWithManyArgs(args *types.MethodArgsSetDataWithManyArgs) string {
	argsA := args.ValueA
	argsB := args.ValueB
	argsC := args.ValueC
	argsD := args.ValueD
	argsE := args.ValueE
	argsF := args.ValueF
	argsG := args.ValueG
	argsH := args.ValueH
	argsI := args.ValueI
	argsJ := args.ValueJ
	argsK := args.ValueK
	argsL := args.ValueL

	_, err := storage.MethodSetData(&storage.ArgsSetData{Value: 55})
	if err != nil {
		panic(err)
	}

	return argsA + argsB + argsC + argsD + argsE + argsF + argsG + argsH + argsI + argsJ + argsK + argsL
}

func SetDataWithManyStructuredArgs(args *types.MethodArgsSetDataWithManyStructuredArgs) bool {
	_, err := storage.MethodSetData(&storage.ArgsSetData{Value: 44})
	if err != nil {
		panic(err)
	}
	return true
}

func LocalVarMethod() bool {
	functionArg := false
	functionArg = ReturnTrue()

	_, err := storage.MethodSetData(&storage.ArgsSetData{Value: 88})
	if err != nil {
		panic(err)
	}

	return functionArg
}

var globalValue bool = false

func GlobalVarMethod() bool {
	globalValue = true

	_, err := storage.MethodSetData(&storage.ArgsSetData{Value: 77})
	if err != nil {
		panic(err)
	}

	return globalValue
}

func SubsequentInvokes(args *types.MethodArgsSubsequentInvokes) []string {
	result := make([]string, args.NumberOfTimes)
	for i := int32(0); i < args.NumberOfTimes; i++ {
		_, err := storage.MethodSetData(&storage.ArgsSetData{Value: i})
		if err != nil {
			panic(err)
		}
		res, err := storage.MethodGetData(nil)
		if err != nil {
			panic(err)
		}
		result[i] = strconv.FormatInt(int64(res), 10)
	}

	return result
}
