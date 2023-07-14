package test_import

type TestImport_Enum_Return int32

const (
	TestImport_Enum_ReturnSTRING = iota
	TestImport_Enum_ReturnBYTES  = iota
	testImport_Enum_ReturnMax    = iota
)

func SanitizeTestImport_Enum_ReturnValue(value int32) {
	if !(value >= 0 && value < int32(testImport_Enum_ReturnMax)) {
		panic("Invalid value for enum 'TestImport_Enum_Return'")
	}
}

func GetTestImport_Enum_ReturnValue(key string) TestImport_Enum_Return {
	switch key {
	case "STRING":
		return TestImport_Enum_ReturnSTRING
	case "BYTES":
		return TestImport_Enum_ReturnBYTES
	default:
		panic("Invalid key for enum 'TestImport_Enum_Return'")
	}
}

func GetTestImport_Enum_ReturnKey(value TestImport_Enum_Return) string {
	SanitizeTestImport_Enum_ReturnValue(int32(value))
	switch value {
	case TestImport_Enum_ReturnSTRING:
		return "STRING"
	case TestImport_Enum_ReturnBYTES:
		return "BYTES"
	default:
		panic("Invalid value for enum 'TestImport_Enum_Return'")
	}
}
