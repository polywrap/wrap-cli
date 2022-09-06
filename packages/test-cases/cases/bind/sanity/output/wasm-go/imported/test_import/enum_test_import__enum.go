package test_import

type TestImport_Enum int32

const (
	TestImport_EnumSTRING = iota
	TestImport_EnumBYTES  = iota
	testImport_EnumMax    = iota
)

func SanitizeTestImport_EnumValue(value int32) {
	if !(value >= 0 && value < int32(testImport_EnumMax)) {
		panic("Invalid value for enum 'TestImport_Enum'")
	}
}

func GetTestImport_EnumValue(key string) TestImport_Enum {
	switch key {
	case "STRING":
		return TestImport_EnumSTRING
	case "BYTES":
		return TestImport_EnumBYTES
	default:
		panic("Invalid key for enum 'TestImport_Enum'")
	}
}

func GetTestImport_EnumKey(value TestImport_Enum) string {
	SanitizeTestImport_EnumValue(int32(value))
	switch value {
	case TestImport_EnumSTRING:
		return "STRING"
	case TestImport_EnumBYTES:
		return "BYTES"
	default:
		panic("Invalid value for enum 'TestImport_Enum'")
	}
}
