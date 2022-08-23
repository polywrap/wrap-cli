package types

import (
	"github.com/consideritdone/polywrap-go/polywrap/msgpack"
	"github.com/consideritdone/polywrap-go/polywrap/msgpack/big"
	"github.com/valyala/fastjson"
)

type CustomType struct {
	Str                 string
	OptStr              *string
	U                   uint32
	OptU                *uint32
	M_u8                uint8
	M_u16               uint16
	M_u32               uint32
	I                   int32
	M_i8                int8
	M_i16               int16
	M_i32               int32
	Bigint              *big.Int
	OptBigint           *big.Int
	Bignumber           *big.Int
	OptBignumber        *big.Int
	Json                *fastjson.Value
	OptJson             *fastjson.Value
	Bytes               []byte
	OptBytes            []byte
	M_boolean           bool
	OptBoolean          *bool
	UArray              []uint32
	UOptArray           []uint32
	OptUOptArray        []*uint32
	OptStrOptArray      []*string
	UArrayArray         [][]uint32
	UOptArrayOptArray   [][]*uint32
	UArrayOptArrayArray [][][]uint32
	CrazyArray          [][][][]uint32
	Object              AnotherType
	OptObject           *AnotherType
	ObjectArray         []AnotherType
	OptObjectArray      []*AnotherType
	En                  CustomEnum
	OptEnum             *CustomEnum
	EnumArray           []CustomEnum
	OptEnumArray        []*CustomEnum
	Map                 map[string]int32
	MapOfArr            map[string][]int32
	MapOfObj            map[string]AnotherType
	MapOfArrOfObj       map[string][]AnotherType
	MapCustomValue      map[string]*CustomMapValue
}

func CustomTypeToBuffer(value *CustomType) []byte {
	return serializeCustomType(value)
}

func CustomTypeFromBuffer(data []byte) *CustomType {
	return deserializeCustomType(data)
}

func CustomTypeWrite(writer msgpack.Write, value *CustomType) {
	writeCustomType(writer, value)
}

func CustomTypeRead(reader msgpack.Read) *CustomType {
	return readCustomType(reader)
}
