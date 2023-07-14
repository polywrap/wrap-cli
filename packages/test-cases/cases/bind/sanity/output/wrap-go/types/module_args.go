package types

type ArgsModuleMethod struct {
	Str           string `json:"str"`
	OptStr        *string `json:"optStr"`
	En            CustomEnum `json:"en"`
	OptEnum       *CustomEnum `json:"optEnum"`
	EnumArray     []CustomEnum `json:"enumArray"`
	OptEnumArray  []*CustomEnum `json:"optEnumArray"`
	M_map         map[string]int32 `json:"map"`
	MapOfArr      map[string][]int32 `json:"mapOfArr"`
	MapOfMap      map[string]map[string]int32 `json:"mapOfMap"`
	MapOfObj      map[string]AnotherType `json:"mapOfObj"`
	MapOfArrOfObj map[string][]AnotherType `json:"mapOfArrOfObj"`
}

type ArgsObjectMethod struct {
	Object         AnotherType `json:"object"`
	OptObject      *AnotherType `json:"optObject"`
	ObjectArray    []AnotherType `json:"objectArray"`
	OptObjectArray []*AnotherType `json:"optObjectArray"`
}

type ArgsOptionalEnvMethod struct {
	Object         AnotherType `json:"object"`
	OptObject      *AnotherType `json:"optObject"`
	ObjectArray    []AnotherType `json:"objectArray"`
	OptObjectArray []*AnotherType `json:"optObjectArray"`
}

type ArgsIf struct {
	M_if Else `json:"if"`
}
