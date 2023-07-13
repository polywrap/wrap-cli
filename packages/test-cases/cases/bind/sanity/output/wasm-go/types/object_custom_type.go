package types

import (
	"github.com/polywrap/go-wrap/msgpack"
	"github.com/polywrap/go-wrap/msgpack/big"
	"github.com/valyala/fastjson"
)

type CustomType struct {
	Str                 string `json:"str"`
	OptStr              *string `json:"optStr"`
	U                   uint32 `json:"u"`
	OptU                *uint32 `json:"optU"`
	M_u8                uint8 `json:"u8"`
	M_u16               uint16 `json:"u16"`
	M_u32               uint32 `json:"u32"`
	I                   int32 `json:"i"`
	M_i8                int8 `json:"i8"`
	M_i16               int16 `json:"i16"`
	M_i32               int32 `json:"i32"`
	Bigint              *big.Int `json:"bigint"`
	OptBigint           *big.Int `json:"optBigint"`
	Bignumber           *big.Int `json:"bignumber"`
	OptBignumber        *big.Int `json:"optBignumber"`
	Json                *fastjson.Value `json:"json"`
	OptJson             *fastjson.Value `json:"optJson"`
	Bytes               []byte `json:"bytes"`
	OptBytes            []byte `json:"optBytes"`
	M_boolean           bool `json:"boolean"`
	OptBoolean          *bool `json:"optBoolean"`
	U_array             []uint32 `json:"u_array"`
	UOpt_array          []uint32 `json:"uOpt_array"`
	_opt_uOptArray      []*uint32 `json:"_opt_uOptArray"`
	OptStrOptArray      []*string `json:"optStrOptArray"`
	UArrayArray         [][]uint32 `json:"uArrayArray"`
	UOptArrayOptArray   [][]*uint32 `json:"uOptArrayOptArray"`
	UArrayOptArrayArray [][][]uint32 `json:"uArrayOptArrayArray"`
	CrazyArray          [][][][]uint32 `json:"crazyArray"`
	Object              AnotherType `json:"object"`
	OptObject           *AnotherType `json:"optObject"`
	ObjectArray         []AnotherType `json:"objectArray"`
	OptObjectArray      []*AnotherType `json:"optObjectArray"`
	En                  CustomEnum `json:"en"`
	OptEnum             *CustomEnum `json:"optEnum"`
	EnumArray           []CustomEnum `json:"enumArray"`
	OptEnumArray        []*CustomEnum `json:"optEnumArray"`
	M_map               map[string]int32 `json:"map"`
	MapOfArr            map[string][]int32 `json:"mapOfArr"`
	MapOfObj            map[string]AnotherType `json:"mapOfObj"`
	MapOfArrOfObj       map[string][]AnotherType `json:"mapOfArrOfObj"`
	MapCustomValue      map[string]*CustomMapValue `json:"mapCustomValue"`
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
