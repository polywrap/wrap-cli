package types

type CustomEnum int32

const (
	CustomEnumSTRING = iota
	CustomEnumBYTES  = iota
	customEnumMax    = iota
)

func SanitizeCustomEnumValue(value int32) {
	if !(value >= 0 && value < int32(customEnumMax)) {
		panic("Invalid value for enum 'CustomEnum'")
	}
}

func GetCustomEnumValue(key string) CustomEnum {
	switch key {
	case "STRING":
		return CustomEnumSTRING
	case "BYTES":
		return CustomEnumBYTES
	default:
		panic("Invalid key for enum 'CustomEnum'")
	}
}

func GetCustomEnumKey(value CustomEnum) string {
	SanitizeCustomEnumValue(int32(value))
	switch value {
	case CustomEnumSTRING:
		return "STRING"
	case CustomEnumBYTES:
		return "BYTES"
	default:
		panic("Invalid value for enum 'CustomEnum'")
	}
}
