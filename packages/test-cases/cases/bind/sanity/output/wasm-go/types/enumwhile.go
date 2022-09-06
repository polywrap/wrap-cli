package types

type While int32

const (
	Whilefor = iota
	Whilein  = iota
	whileMax = iota
)

func SanitizeWhileValue(value int32) {
	if !(value >= 0 && value < int32(whileMax)) {
		panic("Invalid value for enum 'While'")
	}
}

func GetWhileValue(key string) While {
	switch key {
	case "for":
		return Whilefor
	case "in":
		return Whilein
	default:
		panic("Invalid key for enum 'While'")
	}
}

func GetWhileKey(value While) string {
	SanitizeWhileValue(int32(value))
	switch value {
	case Whilefor:
		return "for"
	case Whilein:
		return "in"
	default:
		panic("Invalid value for enum 'While'")
	}
}
