package types

import (
	"github.com/consideritdone/polywrap-go/polywrap/msgpack"
)

type ArgsModuleMethod struct {
	Str           string
	OptStr        *string
	En            CustomEnum
	OptEnum       *CustomEnum
	EnumArray     []CustomEnum
	OptEnumArray  []*CustomEnum
	Map           map[string]int32
	MapOfArr      map[string][]int32
	MapOfObj      map[string]AnotherType
	MapOfArrOfObj map[string][]AnotherType
}

type ArgsObjectMethod struct {
	Object         AnotherType
	OptObject      *AnotherType
	ObjectArray    []AnotherType
	OptObjectArray []*AnotherType
}

type ArgsOptionalEnvMethod struct {
	Object         AnotherType
	OptObject      *AnotherType
	ObjectArray    []AnotherType
	OptObjectArray []*AnotherType
}

type ArgsIf struct {
	M_if Else
}
