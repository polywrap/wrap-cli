package types

type MethodArgsModuleMethod struct {
	Str           string
	OptStr        *string
	En            CustomEnum
	OptEnum       *CustomEnum
	EnumArray     []CustomEnum
	OptEnumArray  []*CustomEnum
	M_map         map[string]int32
	MapOfArr      map[string][]int32
	MapOfMap      map[string]map[string]int32
	MapOfObj      map[string]AnotherType
	MapOfArrOfObj map[string][]AnotherType
}

type MethodArgsObjectMethod struct {
	Object         AnotherType
	OptObject      *AnotherType
	ObjectArray    []AnotherType
	OptObjectArray []*AnotherType
}

type MethodArgsOptionalEnvMethod struct {
	Object         AnotherType
	OptObject      *AnotherType
	ObjectArray    []AnotherType
	OptObjectArray []*AnotherType
}

type MethodArgsIf struct {
	M_if Else
}
