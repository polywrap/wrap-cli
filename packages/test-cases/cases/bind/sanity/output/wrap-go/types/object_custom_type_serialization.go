package types

import (
	"github.com/polywrap/go-wrap/msgpack"
	"github.com/polywrap/go-wrap/msgpack/big"
	"github.com/valyala/fastjson"
)

func serializeCustomType(value *CustomType) []byte {
	ctx := msgpack.NewContext("Serializing (encoding) env-type: CustomType")
	encoder := msgpack.NewWriteEncoder(ctx)
	writeCustomType(encoder, value)
	return encoder.Buffer()
}

func writeCustomType(writer msgpack.Write, value *CustomType) {
	writer.WriteMapLength(42)
	writer.Context().Push("str", "string", "writing property")
	writer.WriteString("str")
	{
		v := value.Str
		writer.WriteString(v)
	}
	writer.Context().Pop()
	writer.Context().Push("optStr", "*string", "writing property")
	writer.WriteString("optStr")
	{
		v := value.OptStr
		if v == nil {
			writer.WriteNil()
		} else {
			writer.WriteString(*v)
		}
	}
	writer.Context().Pop()
	writer.Context().Push("u", "uint32", "writing property")
	writer.WriteString("u")
	{
		v := value.U
		writer.WriteU32(v)
	}
	writer.Context().Pop()
	writer.Context().Push("optU", "*uint32", "writing property")
	writer.WriteString("optU")
	{
		v := value.OptU
		if v == nil {
			writer.WriteNil()
		} else {
			writer.WriteU32(*v)
		}
	}
	writer.Context().Pop()
	writer.Context().Push("u8", "uint8", "writing property")
	writer.WriteString("u8")
	{
		v := value.M_u8
		writer.WriteU8(v)
	}
	writer.Context().Pop()
	writer.Context().Push("u16", "uint16", "writing property")
	writer.WriteString("u16")
	{
		v := value.M_u16
		writer.WriteU16(v)
	}
	writer.Context().Pop()
	writer.Context().Push("u32", "uint32", "writing property")
	writer.WriteString("u32")
	{
		v := value.M_u32
		writer.WriteU32(v)
	}
	writer.Context().Pop()
	writer.Context().Push("i", "int32", "writing property")
	writer.WriteString("i")
	{
		v := value.I
		writer.WriteI32(v)
	}
	writer.Context().Pop()
	writer.Context().Push("i8", "int8", "writing property")
	writer.WriteString("i8")
	{
		v := value.M_i8
		writer.WriteI8(v)
	}
	writer.Context().Pop()
	writer.Context().Push("i16", "int16", "writing property")
	writer.WriteString("i16")
	{
		v := value.M_i16
		writer.WriteI16(v)
	}
	writer.Context().Pop()
	writer.Context().Push("i32", "int32", "writing property")
	writer.WriteString("i32")
	{
		v := value.M_i32
		writer.WriteI32(v)
	}
	writer.Context().Pop()
	writer.Context().Push("bigint", "*big.Int", "writing property")
	writer.WriteString("bigint")
	{
		v := value.Bigint
		writer.WriteBigInt(v)
	}
	writer.Context().Pop()
	writer.Context().Push("optBigint", "*big.Int", "writing property")
	writer.WriteString("optBigint")
	{
		v := value.OptBigint
		if v == nil {
			writer.WriteNil()
		} else {
			writer.WriteBigInt(v)
		}
	}
	writer.Context().Pop()
	writer.Context().Push("bignumber", "*big.Int", "writing property")
	writer.WriteString("bignumber")
	{
		v := value.Bignumber
		writer.WriteBigInt(v)
	}
	writer.Context().Pop()
	writer.Context().Push("optBignumber", "*big.Int", "writing property")
	writer.WriteString("optBignumber")
	{
		v := value.OptBignumber
		if v == nil {
			writer.WriteNil()
		} else {
			writer.WriteBigInt(v)
		}
	}
	writer.Context().Pop()
	writer.Context().Push("json", "*fastjson.Value", "writing property")
	writer.WriteString("json")
	{
		v := value.Json
		writer.WriteJson(v)
	}
	writer.Context().Pop()
	writer.Context().Push("optJson", "*fastjson.Value", "writing property")
	writer.WriteString("optJson")
	{
		v := value.OptJson
		if v == nil {
			writer.WriteNil()
		} else {
			writer.WriteJson(v)
		}
	}
	writer.Context().Pop()
	writer.Context().Push("bytes", "[]byte", "writing property")
	writer.WriteString("bytes")
	{
		v := value.Bytes
		writer.WriteBytes(v)
	}
	writer.Context().Pop()
	writer.Context().Push("optBytes", "[]byte", "writing property")
	writer.WriteString("optBytes")
	{
		v := value.OptBytes
		if v == nil {
			writer.WriteNil()
		} else {
			writer.WriteBytes(v)
		}
	}
	writer.Context().Pop()
	writer.Context().Push("boolean", "bool", "writing property")
	writer.WriteString("boolean")
	{
		v := value.M_boolean
		writer.WriteBool(v)
	}
	writer.Context().Pop()
	writer.Context().Push("optBoolean", "*bool", "writing property")
	writer.WriteString("optBoolean")
	{
		v := value.OptBoolean
		if v == nil {
			writer.WriteNil()
		} else {
			writer.WriteBool(*v)
		}
	}
	writer.Context().Pop()
	writer.Context().Push("u_array", "[]uint32", "writing property")
	writer.WriteString("u_array")
	if value.U_array == nil {
		writer.WriteNil()
	} else if len(value.U_array) == 0 {
		writer.WriteNil()
	} else {
		writer.WriteArrayLength(uint32(len(value.U_array)))
		for i0 := range value.U_array {
			{
				v := value.U_array[i0]
				writer.WriteU32(v)
			}
		}
	}
	writer.Context().Pop()
	writer.Context().Push("uOpt_array", "[]uint32", "writing property")
	writer.WriteString("uOpt_array")
	if value.UOpt_array == nil {
		writer.WriteNil()
	} else if len(value.UOpt_array) == 0 {
		writer.WriteNil()
	} else {
		writer.WriteArrayLength(uint32(len(value.UOpt_array)))
		for i0 := range value.UOpt_array {
			{
				v := value.UOpt_array[i0]
				writer.WriteU32(v)
			}
		}
	}
	writer.Context().Pop()
	writer.Context().Push("_opt_uOptArray", "[]*uint32", "writing property")
	writer.WriteString("_opt_uOptArray")
	if value._opt_uOptArray == nil {
		writer.WriteNil()
	} else if len(value._opt_uOptArray) == 0 {
		writer.WriteNil()
	} else {
		writer.WriteArrayLength(uint32(len(value._opt_uOptArray)))
		for i0 := range value._opt_uOptArray {
			{
				v := value._opt_uOptArray[i0]
				if v == nil {
					writer.WriteNil()
				} else {
					writer.WriteU32(*v)
				}
			}
		}
	}
	writer.Context().Pop()
	writer.Context().Push("optStrOptArray", "[]*string", "writing property")
	writer.WriteString("optStrOptArray")
	if value.OptStrOptArray == nil {
		writer.WriteNil()
	} else if len(value.OptStrOptArray) == 0 {
		writer.WriteNil()
	} else {
		writer.WriteArrayLength(uint32(len(value.OptStrOptArray)))
		for i0 := range value.OptStrOptArray {
			{
				v := value.OptStrOptArray[i0]
				if v == nil {
					writer.WriteNil()
				} else {
					writer.WriteString(*v)
				}
			}
		}
	}
	writer.Context().Pop()
	writer.Context().Push("uArrayArray", "[][]uint32", "writing property")
	writer.WriteString("uArrayArray")
	if value.UArrayArray == nil {
		writer.WriteNil()
	} else if len(value.UArrayArray) == 0 {
		writer.WriteNil()
	} else {
		writer.WriteArrayLength(uint32(len(value.UArrayArray)))
		for i0 := range value.UArrayArray {
			if value.UArrayArray[i0] == nil {
				writer.WriteNil()
			} else if len(value.UArrayArray[i0]) == 0 {
				writer.WriteNil()
			} else {
				writer.WriteArrayLength(uint32(len(value.UArrayArray[i0])))
				for i1 := range value.UArrayArray[i0] {
					{
						v := value.UArrayArray[i0][i1]
						writer.WriteU32(v)
					}
				}
			}
		}
	}
	writer.Context().Pop()
	writer.Context().Push("uOptArrayOptArray", "[][]*uint32", "writing property")
	writer.WriteString("uOptArrayOptArray")
	if value.UOptArrayOptArray == nil {
		writer.WriteNil()
	} else if len(value.UOptArrayOptArray) == 0 {
		writer.WriteNil()
	} else {
		writer.WriteArrayLength(uint32(len(value.UOptArrayOptArray)))
		for i0 := range value.UOptArrayOptArray {
			if value.UOptArrayOptArray[i0] == nil {
				writer.WriteNil()
			} else if len(value.UOptArrayOptArray[i0]) == 0 {
				writer.WriteNil()
			} else {
				writer.WriteArrayLength(uint32(len(value.UOptArrayOptArray[i0])))
				for i1 := range value.UOptArrayOptArray[i0] {
					{
						v := value.UOptArrayOptArray[i0][i1]
						if v == nil {
							writer.WriteNil()
						} else {
							writer.WriteU32(*v)
						}
					}
				}
			}
		}
	}
	writer.Context().Pop()
	writer.Context().Push("uArrayOptArrayArray", "[][][]uint32", "writing property")
	writer.WriteString("uArrayOptArrayArray")
	if value.UArrayOptArrayArray == nil {
		writer.WriteNil()
	} else if len(value.UArrayOptArrayArray) == 0 {
		writer.WriteNil()
	} else {
		writer.WriteArrayLength(uint32(len(value.UArrayOptArrayArray)))
		for i0 := range value.UArrayOptArrayArray {
			if value.UArrayOptArrayArray[i0] == nil {
				writer.WriteNil()
			} else if len(value.UArrayOptArrayArray[i0]) == 0 {
				writer.WriteNil()
			} else {
				writer.WriteArrayLength(uint32(len(value.UArrayOptArrayArray[i0])))
				for i1 := range value.UArrayOptArrayArray[i0] {
					if value.UArrayOptArrayArray[i0][i1] == nil {
						writer.WriteNil()
					} else if len(value.UArrayOptArrayArray[i0][i1]) == 0 {
						writer.WriteNil()
					} else {
						writer.WriteArrayLength(uint32(len(value.UArrayOptArrayArray[i0][i1])))
						for i2 := range value.UArrayOptArrayArray[i0][i1] {
							{
								v := value.UArrayOptArrayArray[i0][i1][i2]
								writer.WriteU32(v)
							}
						}
					}
				}
			}
		}
	}
	writer.Context().Pop()
	writer.Context().Push("crazyArray", "[][][][]uint32", "writing property")
	writer.WriteString("crazyArray")
	if value.CrazyArray == nil {
		writer.WriteNil()
	} else if len(value.CrazyArray) == 0 {
		writer.WriteNil()
	} else {
		writer.WriteArrayLength(uint32(len(value.CrazyArray)))
		for i0 := range value.CrazyArray {
			if value.CrazyArray[i0] == nil {
				writer.WriteNil()
			} else if len(value.CrazyArray[i0]) == 0 {
				writer.WriteNil()
			} else {
				writer.WriteArrayLength(uint32(len(value.CrazyArray[i0])))
				for i1 := range value.CrazyArray[i0] {
					if value.CrazyArray[i0][i1] == nil {
						writer.WriteNil()
					} else if len(value.CrazyArray[i0][i1]) == 0 {
						writer.WriteNil()
					} else {
						writer.WriteArrayLength(uint32(len(value.CrazyArray[i0][i1])))
						for i2 := range value.CrazyArray[i0][i1] {
							if value.CrazyArray[i0][i1][i2] == nil {
								writer.WriteNil()
							} else if len(value.CrazyArray[i0][i1][i2]) == 0 {
								writer.WriteNil()
							} else {
								writer.WriteArrayLength(uint32(len(value.CrazyArray[i0][i1][i2])))
								for i3 := range value.CrazyArray[i0][i1][i2] {
									{
										v := value.CrazyArray[i0][i1][i2][i3]
										writer.WriteU32(v)
									}
								}
							}
						}
					}
				}
			}
		}
	}
	writer.Context().Pop()
	writer.Context().Push("object", "AnotherType", "writing property")
	writer.WriteString("object")
	{
		v := value.Object
		AnotherTypeWrite(writer, &v)
	}
	writer.Context().Pop()
	writer.Context().Push("optObject", "*AnotherType", "writing property")
	writer.WriteString("optObject")
	{
		v := value.OptObject
		AnotherTypeWrite(writer, v)
	}
	writer.Context().Pop()
	writer.Context().Push("objectArray", "[]AnotherType", "writing property")
	writer.WriteString("objectArray")
	if value.ObjectArray == nil {
		writer.WriteNil()
	} else if len(value.ObjectArray) == 0 {
		writer.WriteNil()
	} else {
		writer.WriteArrayLength(uint32(len(value.ObjectArray)))
		for i0 := range value.ObjectArray {
			{
				v := value.ObjectArray[i0]
				AnotherTypeWrite(writer, &v)
			}
		}
	}
	writer.Context().Pop()
	writer.Context().Push("optObjectArray", "[]*AnotherType", "writing property")
	writer.WriteString("optObjectArray")
	if value.OptObjectArray == nil {
		writer.WriteNil()
	} else if len(value.OptObjectArray) == 0 {
		writer.WriteNil()
	} else {
		writer.WriteArrayLength(uint32(len(value.OptObjectArray)))
		for i0 := range value.OptObjectArray {
			{
				v := value.OptObjectArray[i0]
				AnotherTypeWrite(writer, v)
			}
		}
	}
	writer.Context().Pop()
	writer.Context().Push("en", "CustomEnum", "writing property")
	writer.WriteString("en")
	{
		v := value.En
		writer.WriteI32(int32(v))
	}
	writer.Context().Pop()
	writer.Context().Push("optEnum", "*CustomEnum", "writing property")
	writer.WriteString("optEnum")
	{
		v := value.OptEnum
		if v == nil {
			writer.WriteNil()
		} else {
			writer.WriteI32(int32(*v))
		}
	}
	writer.Context().Pop()
	writer.Context().Push("enumArray", "[]CustomEnum", "writing property")
	writer.WriteString("enumArray")
	if value.EnumArray == nil {
		writer.WriteNil()
	} else if len(value.EnumArray) == 0 {
		writer.WriteNil()
	} else {
		writer.WriteArrayLength(uint32(len(value.EnumArray)))
		for i0 := range value.EnumArray {
			{
				v := value.EnumArray[i0]
				writer.WriteI32(int32(v))
			}
		}
	}
	writer.Context().Pop()
	writer.Context().Push("optEnumArray", "[]*CustomEnum", "writing property")
	writer.WriteString("optEnumArray")
	if value.OptEnumArray == nil {
		writer.WriteNil()
	} else if len(value.OptEnumArray) == 0 {
		writer.WriteNil()
	} else {
		writer.WriteArrayLength(uint32(len(value.OptEnumArray)))
		for i0 := range value.OptEnumArray {
			{
				v := value.OptEnumArray[i0]
				if v == nil {
					writer.WriteNil()
				} else {
					writer.WriteI32(int32(*v))
				}
			}
		}
	}
	writer.Context().Pop()
	writer.Context().Push("map", "map[string]int32", "writing property")
	writer.WriteString("map")
	if value.M_map == nil {
		writer.WriteNil()
	} else if len(value.M_map) == 0 {
		writer.WriteNil()
	} else {
		for i0 := range value.M_map {
			writer.WriteString(i0)
			{
				v := value.M_map[i0]
				writer.WriteI32(v)
			}
		}
	}
	writer.Context().Pop()
	writer.Context().Push("mapOfArr", "map[string][]int32", "writing property")
	writer.WriteString("mapOfArr")
	if value.MapOfArr == nil {
		writer.WriteNil()
	} else if len(value.MapOfArr) == 0 {
		writer.WriteNil()
	} else {
		for i0 := range value.MapOfArr {
			writer.WriteString(i0)
			if value.MapOfArr[i0] == nil {
				writer.WriteNil()
			} else if len(value.MapOfArr[i0]) == 0 {
				writer.WriteNil()
			} else {
				writer.WriteArrayLength(uint32(len(value.MapOfArr[i0])))
				for i1 := range value.MapOfArr[i0] {
					{
						v := value.MapOfArr[i0][i1]
						writer.WriteI32(v)
					}
				}
			}
		}
	}
	writer.Context().Pop()
	writer.Context().Push("mapOfObj", "map[string]AnotherType", "writing property")
	writer.WriteString("mapOfObj")
	if value.MapOfObj == nil {
		writer.WriteNil()
	} else if len(value.MapOfObj) == 0 {
		writer.WriteNil()
	} else {
		for i0 := range value.MapOfObj {
			writer.WriteString(i0)
			{
				v := value.MapOfObj[i0]
				AnotherTypeWrite(writer, &v)
			}
		}
	}
	writer.Context().Pop()
	writer.Context().Push("mapOfArrOfObj", "map[string][]AnotherType", "writing property")
	writer.WriteString("mapOfArrOfObj")
	if value.MapOfArrOfObj == nil {
		writer.WriteNil()
	} else if len(value.MapOfArrOfObj) == 0 {
		writer.WriteNil()
	} else {
		for i0 := range value.MapOfArrOfObj {
			writer.WriteString(i0)
			if value.MapOfArrOfObj[i0] == nil {
				writer.WriteNil()
			} else if len(value.MapOfArrOfObj[i0]) == 0 {
				writer.WriteNil()
			} else {
				writer.WriteArrayLength(uint32(len(value.MapOfArrOfObj[i0])))
				for i1 := range value.MapOfArrOfObj[i0] {
					{
						v := value.MapOfArrOfObj[i0][i1]
						AnotherTypeWrite(writer, &v)
					}
				}
			}
		}
	}
	writer.Context().Pop()
	writer.Context().Push("mapCustomValue", "map[string]*CustomMapValue", "writing property")
	writer.WriteString("mapCustomValue")
	if value.MapCustomValue == nil {
		writer.WriteNil()
	} else if len(value.MapCustomValue) == 0 {
		writer.WriteNil()
	} else {
		for i0 := range value.MapCustomValue {
			writer.WriteString(i0)
			{
				v := value.MapCustomValue[i0]
				CustomMapValueWrite(writer, v)
			}
		}
	}
	writer.Context().Pop()
}

func deserializeCustomType(data []byte) *CustomType {
	ctx := msgpack.NewContext("Deserializing (decoding) env-type: CustomType")
	reader := msgpack.NewReadDecoder(ctx, data)
	return readCustomType(reader)
}

func readCustomType(reader msgpack.Read) *CustomType {
	var (
		_str                    string
		_strSet                 bool
		_optStr                 *string
		_u                      uint32
		_uSet                   bool
		_optU                   *uint32
		_u8                     uint8
		_u8Set                  bool
		_u16                    uint16
		_u16Set                 bool
		_u32                    uint32
		_u32Set                 bool
		_i                      int32
		_iSet                   bool
		_i8                     int8
		_i8Set                  bool
		_i16                    int16
		_i16Set                 bool
		_i32                    int32
		_i32Set                 bool
		_bigint                 *big.Int
		_bigintSet              bool
		_optBigint              *big.Int
		_bignumber              *big.Int
		_bignumberSet           bool
		_optBignumber           *big.Int
		_json                   *fastjson.Value
		_jsonSet                bool
		_optJson                *fastjson.Value
		_bytes                  []byte
		_bytesSet               bool
		_optBytes               []byte
		_boolean                bool
		_booleanSet             bool
		_optBoolean             *bool
		_u_array                []uint32
		_u_arraySet             bool
		_uOpt_array             []uint32
		__opt_uOptArray         []*uint32
		_optStrOptArray         []*string
		_uArrayArray            [][]uint32
		_uArrayArraySet         bool
		_uOptArrayOptArray      [][]*uint32
		_uOptArrayOptArraySet   bool
		_uArrayOptArrayArray    [][][]uint32
		_uArrayOptArrayArraySet bool
		_crazyArray             [][][][]uint32
		_object                 AnotherType
		_objectSet              bool
		_optObject              *AnotherType
		_objectArray            []AnotherType
		_objectArraySet         bool
		_optObjectArray         []*AnotherType
		_en                     CustomEnum
		_enSet                  bool
		_optEnum                *CustomEnum
		_enumArray              []CustomEnum
		_enumArraySet           bool
		_optEnumArray           []*CustomEnum
		_map                    map[string]int32
		_mapSet                 bool
		_mapOfArr               map[string][]int32
		_mapOfArrSet            bool
		_mapOfObj               map[string]AnotherType
		_mapOfObjSet            bool
		_mapOfArrOfObj          map[string][]AnotherType
		_mapOfArrOfObjSet       bool
		_mapCustomValue         map[string]*CustomMapValue
		_mapCustomValueSet      bool
	)

	for i := int32(reader.ReadMapLength()); i > 0; i-- {
		field := reader.ReadString()
		reader.Context().Push(field, "unknown", "searching for property type")
		switch field {
		case "str":
			reader.Context().Push(field, "string", "type found, reading property")
			var ( value string )
			value = reader.ReadString()
			_str = value
			_strSet = true
			reader.Context().Pop()
		case "optStr":
			reader.Context().Push(field, "*string", "type found, reading property")
			var ( value *string )
			value = nil
			if !reader.IsNil() {
				v := reader.ReadString()
				value = &v
			}
			_optStr = value
			reader.Context().Pop()
		case "u":
			reader.Context().Push(field, "uint32", "type found, reading property")
			var ( value uint32 )
			value = reader.ReadU32()
			_u = value
			_uSet = true
			reader.Context().Pop()
		case "optU":
			reader.Context().Push(field, "*uint32", "type found, reading property")
			var ( value *uint32 )
			value = nil
			if !reader.IsNil() {
				v := reader.ReadU32()
				value = &v
			}
			_optU = value
			reader.Context().Pop()
		case "u8":
			reader.Context().Push(field, "uint8", "type found, reading property")
			var ( value uint8 )
			value = reader.ReadU8()
			_u8 = value
			_u8Set = true
			reader.Context().Pop()
		case "u16":
			reader.Context().Push(field, "uint16", "type found, reading property")
			var ( value uint16 )
			value = reader.ReadU16()
			_u16 = value
			_u16Set = true
			reader.Context().Pop()
		case "u32":
			reader.Context().Push(field, "uint32", "type found, reading property")
			var ( value uint32 )
			value = reader.ReadU32()
			_u32 = value
			_u32Set = true
			reader.Context().Pop()
		case "i":
			reader.Context().Push(field, "int32", "type found, reading property")
			var ( value int32 )
			value = reader.ReadI32()
			_i = value
			_iSet = true
			reader.Context().Pop()
		case "i8":
			reader.Context().Push(field, "int8", "type found, reading property")
			var ( value int8 )
			value = reader.ReadI8()
			_i8 = value
			_i8Set = true
			reader.Context().Pop()
		case "i16":
			reader.Context().Push(field, "int16", "type found, reading property")
			var ( value int16 )
			value = reader.ReadI16()
			_i16 = value
			_i16Set = true
			reader.Context().Pop()
		case "i32":
			reader.Context().Push(field, "int32", "type found, reading property")
			var ( value int32 )
			value = reader.ReadI32()
			_i32 = value
			_i32Set = true
			reader.Context().Pop()
		case "bigint":
			reader.Context().Push(field, "*big.Int", "type found, reading property")
			var ( value *big.Int )
			value = reader.ReadBigInt()
			_bigint = value
			_bigintSet = true
			reader.Context().Pop()
		case "optBigint":
			reader.Context().Push(field, "*big.Int", "type found, reading property")
			var ( value *big.Int )
			value = nil
			if !reader.IsNil() {
				v := reader.ReadBigInt()
				value = v
			}
			_optBigint = value
			reader.Context().Pop()
		case "bignumber":
			reader.Context().Push(field, "*big.Int", "type found, reading property")
			var ( value *big.Int )
			value = reader.ReadBigInt()
			_bignumber = value
			_bignumberSet = true
			reader.Context().Pop()
		case "optBignumber":
			reader.Context().Push(field, "*big.Int", "type found, reading property")
			var ( value *big.Int )
			value = nil
			if !reader.IsNil() {
				v := reader.ReadBigInt()
				value = v
			}
			_optBignumber = value
			reader.Context().Pop()
		case "json":
			reader.Context().Push(field, "*fastjson.Value", "type found, reading property")
			var ( value *fastjson.Value )
			value = reader.ReadJson()
			_json = value
			_jsonSet = true
			reader.Context().Pop()
		case "optJson":
			reader.Context().Push(field, "*fastjson.Value", "type found, reading property")
			var ( value *fastjson.Value )
			value = nil
			if !reader.IsNil() {
				v := reader.ReadJson()
				value = v
			}
			_optJson = value
			reader.Context().Pop()
		case "bytes":
			reader.Context().Push(field, "[]byte", "type found, reading property")
			var ( value []byte )
			value = reader.ReadBytes()
			_bytes = value
			_bytesSet = true
			reader.Context().Pop()
		case "optBytes":
			reader.Context().Push(field, "[]byte", "type found, reading property")
			var ( value []byte )
			value = nil
			if !reader.IsNil() {
				v := reader.ReadBytes()
				value = v
			}
			_optBytes = value
			reader.Context().Pop()
		case "boolean":
			reader.Context().Push(field, "bool", "type found, reading property")
			var ( value bool )
			value = reader.ReadBool()
			_boolean = value
			_booleanSet = true
			reader.Context().Pop()
		case "optBoolean":
			reader.Context().Push(field, "*bool", "type found, reading property")
			var ( value *bool )
			value = nil
			if !reader.IsNil() {
				v := reader.ReadBool()
				value = &v
			}
			_optBoolean = value
			reader.Context().Pop()
		case "u_array":
			reader.Context().Push(field, "[]uint32", "type found, reading property")
			var ( value []uint32 )
			if reader.IsNil() {
				value = nil
			} else {
				value = make([]uint32, reader.ReadArrayLength())
				ln0 := uint32(len(value))
				for i0 := uint32(0); i0 < ln0; i0++ {
					value[i0] = reader.ReadU32()
				}
			}
			_u_array = value
			_u_arraySet = true
			reader.Context().Pop()
		case "uOpt_array":
			reader.Context().Push(field, "[]uint32", "type found, reading property")
			var ( value []uint32 )
			value = nil
			if reader.IsNil() {
				value = nil
			} else {
				value = make([]uint32, reader.ReadArrayLength())
				ln0 := uint32(len(value))
				for i0 := uint32(0); i0 < ln0; i0++ {
					value[i0] = reader.ReadU32()
				}
			}
			_uOpt_array = value
			reader.Context().Pop()
		case "_opt_uOptArray":
			reader.Context().Push(field, "[]*uint32", "type found, reading property")
			var ( value []*uint32 )
			value = nil
			if reader.IsNil() {
				value = nil
			} else {
				value = make([]*uint32, reader.ReadArrayLength())
				ln0 := uint32(len(value))
				for i0 := uint32(0); i0 < ln0; i0++ {
					if !reader.IsNil() {
						v := reader.ReadU32()
						value[i0] = &v
					}
				}
			}
			__opt_uOptArray = value
			reader.Context().Pop()
		case "optStrOptArray":
			reader.Context().Push(field, "[]*string", "type found, reading property")
			var ( value []*string )
			value = nil
			if reader.IsNil() {
				value = nil
			} else {
				value = make([]*string, reader.ReadArrayLength())
				ln0 := uint32(len(value))
				for i0 := uint32(0); i0 < ln0; i0++ {
					if !reader.IsNil() {
						v := reader.ReadString()
						value[i0] = &v
					}
				}
			}
			_optStrOptArray = value
			reader.Context().Pop()
		case "uArrayArray":
			reader.Context().Push(field, "[][]uint32", "type found, reading property")
			var ( value [][]uint32 )
			if reader.IsNil() {
				value = nil
			} else {
				value = make([][]uint32, reader.ReadArrayLength())
				ln0 := uint32(len(value))
				for i0 := uint32(0); i0 < ln0; i0++ {
					if reader.IsNil() {
						value[i0] = nil
					} else {
						value[i0] = make([]uint32, reader.ReadArrayLength())
						ln1 := uint32(len(value[i0]))
						for i1 := uint32(0); i1 < ln1; i1++ {
							value[i0][i1] = reader.ReadU32()
						}
					}
				}
			}
			_uArrayArray = value
			_uArrayArraySet = true
			reader.Context().Pop()
		case "uOptArrayOptArray":
			reader.Context().Push(field, "[][]*uint32", "type found, reading property")
			var ( value [][]*uint32 )
			if reader.IsNil() {
				value = nil
			} else {
				value = make([][]*uint32, reader.ReadArrayLength())
				ln0 := uint32(len(value))
				for i0 := uint32(0); i0 < ln0; i0++ {
					if reader.IsNil() {
						value[i0] = nil
					} else {
						value[i0] = make([]*uint32, reader.ReadArrayLength())
						ln1 := uint32(len(value[i0]))
						for i1 := uint32(0); i1 < ln1; i1++ {
							if !reader.IsNil() {
								v := reader.ReadU32()
								value[i0][i1] = &v
							}
						}
					}
				}
			}
			_uOptArrayOptArray = value
			_uOptArrayOptArraySet = true
			reader.Context().Pop()
		case "uArrayOptArrayArray":
			reader.Context().Push(field, "[][][]uint32", "type found, reading property")
			var ( value [][][]uint32 )
			if reader.IsNil() {
				value = nil
			} else {
				value = make([][][]uint32, reader.ReadArrayLength())
				ln0 := uint32(len(value))
				for i0 := uint32(0); i0 < ln0; i0++ {
					if reader.IsNil() {
						value[i0] = nil
					} else {
						value[i0] = make([][]uint32, reader.ReadArrayLength())
						ln1 := uint32(len(value[i0]))
						for i1 := uint32(0); i1 < ln1; i1++ {
							if reader.IsNil() {
								value[i0][i1] = nil
							} else {
								value[i0][i1] = make([]uint32, reader.ReadArrayLength())
								ln2 := uint32(len(value[i0][i1]))
								for i2 := uint32(0); i2 < ln2; i2++ {
									value[i0][i1][i2] = reader.ReadU32()
								}
							}
						}
					}
				}
			}
			_uArrayOptArrayArray = value
			_uArrayOptArrayArraySet = true
			reader.Context().Pop()
		case "crazyArray":
			reader.Context().Push(field, "[][][][]uint32", "type found, reading property")
			var ( value [][][][]uint32 )
			value = nil
			if reader.IsNil() {
				value = nil
			} else {
				value = make([][][][]uint32, reader.ReadArrayLength())
				ln0 := uint32(len(value))
				for i0 := uint32(0); i0 < ln0; i0++ {
					if reader.IsNil() {
						value[i0] = nil
					} else {
						value[i0] = make([][][]uint32, reader.ReadArrayLength())
						ln1 := uint32(len(value[i0]))
						for i1 := uint32(0); i1 < ln1; i1++ {
							if reader.IsNil() {
								value[i0][i1] = nil
							} else {
								value[i0][i1] = make([][]uint32, reader.ReadArrayLength())
								ln2 := uint32(len(value[i0][i1]))
								for i2 := uint32(0); i2 < ln2; i2++ {
									if reader.IsNil() {
										value[i0][i1][i2] = nil
									} else {
										value[i0][i1][i2] = make([]uint32, reader.ReadArrayLength())
										ln3 := uint32(len(value[i0][i1][i2]))
										for i3 := uint32(0); i3 < ln3; i3++ {
											value[i0][i1][i2][i3] = reader.ReadU32()
										}
									}
								}
							}
						}
					}
				}
			}
			_crazyArray = value
			reader.Context().Pop()
		case "object":
			reader.Context().Push(field, "AnotherType", "type found, reading property")
			var ( value AnotherType )
			if v := AnotherTypeRead(reader); v != nil {
				value = *v
			}
			_object = value
			_objectSet = true
			reader.Context().Pop()
		case "optObject":
			reader.Context().Push(field, "*AnotherType", "type found, reading property")
			var ( value *AnotherType )
			value = nil
			if v := AnotherTypeRead(reader); v != nil {
				value = v
			}
			_optObject = value
			reader.Context().Pop()
		case "objectArray":
			reader.Context().Push(field, "[]AnotherType", "type found, reading property")
			var ( value []AnotherType )
			if reader.IsNil() {
				value = nil
			} else {
				value = make([]AnotherType, reader.ReadArrayLength())
				ln0 := uint32(len(value))
				for i0 := uint32(0); i0 < ln0; i0++ {
					if v := AnotherTypeRead(reader); v != nil {
						value[i0] = *v
					}
				}
			}
			_objectArray = value
			_objectArraySet = true
			reader.Context().Pop()
		case "optObjectArray":
			reader.Context().Push(field, "[]*AnotherType", "type found, reading property")
			var ( value []*AnotherType )
			value = nil
			if reader.IsNil() {
				value = nil
			} else {
				value = make([]*AnotherType, reader.ReadArrayLength())
				ln0 := uint32(len(value))
				for i0 := uint32(0); i0 < ln0; i0++ {
					if v := AnotherTypeRead(reader); v != nil {
						value[i0] = v
					}
				}
			}
			_optObjectArray = value
			reader.Context().Pop()
		case "en":
			reader.Context().Push(field, "CustomEnum", "type found, reading property")
			var ( value CustomEnum )
			value = CustomEnum(reader.ReadI32())
			SanitizeCustomEnumValue(int32(value))
			_en = value
			_enSet = true
			reader.Context().Pop()
		case "optEnum":
			reader.Context().Push(field, "*CustomEnum", "type found, reading property")
			var ( value *CustomEnum )
			value = nil
			if !reader.IsNil() {
				v := CustomEnum(reader.ReadI32())
				SanitizeCustomEnumValue(int32(v))
				value = &v
			}
			_optEnum = value
			reader.Context().Pop()
		case "enumArray":
			reader.Context().Push(field, "[]CustomEnum", "type found, reading property")
			var ( value []CustomEnum )
			if reader.IsNil() {
				value = nil
			} else {
				value = make([]CustomEnum, reader.ReadArrayLength())
				ln0 := uint32(len(value))
				for i0 := uint32(0); i0 < ln0; i0++ {
					value[i0] = CustomEnum(reader.ReadI32())
					SanitizeCustomEnumValue(int32(value[i0]))
				}
			}
			_enumArray = value
			_enumArraySet = true
			reader.Context().Pop()
		case "optEnumArray":
			reader.Context().Push(field, "[]*CustomEnum", "type found, reading property")
			var ( value []*CustomEnum )
			value = nil
			if reader.IsNil() {
				value = nil
			} else {
				value = make([]*CustomEnum, reader.ReadArrayLength())
				ln0 := uint32(len(value))
				for i0 := uint32(0); i0 < ln0; i0++ {
					if !reader.IsNil() {
						v := CustomEnum(reader.ReadI32())
						SanitizeCustomEnumValue(int32(v))
						value[i0] = &v
					}
				}
			}
			_optEnumArray = value
			reader.Context().Pop()
		case "map":
			reader.Context().Push(field, "map[string]int32", "type found, reading property")
			var ( value map[string]int32 )
			if reader.IsNil() {
				value = nil
			} else {
				value = make(map[string]int32)
				ln0 := reader.ReadMapLength()
				for j0 := uint32(0); j0 < ln0; j0++ {
					i0 := reader.ReadString()
					value[i0] = reader.ReadI32()
				}
			}
			_map = value
			_mapSet = true
			reader.Context().Pop()
		case "mapOfArr":
			reader.Context().Push(field, "map[string][]int32", "type found, reading property")
			var ( value map[string][]int32 )
			if reader.IsNil() {
				value = nil
			} else {
				value = make(map[string][]int32)
				ln0 := reader.ReadMapLength()
				for j0 := uint32(0); j0 < ln0; j0++ {
					i0 := reader.ReadString()
					if reader.IsNil() {
						value[i0] = nil
					} else {
						value[i0] = make([]int32, reader.ReadArrayLength())
						ln1 := uint32(len(value[i0]))
						for i1 := uint32(0); i1 < ln1; i1++ {
							value[i0][i1] = reader.ReadI32()
						}
					}
				}
			}
			_mapOfArr = value
			_mapOfArrSet = true
			reader.Context().Pop()
		case "mapOfObj":
			reader.Context().Push(field, "map[string]AnotherType", "type found, reading property")
			var ( value map[string]AnotherType )
			if reader.IsNil() {
				value = nil
			} else {
				value = make(map[string]AnotherType)
				ln0 := reader.ReadMapLength()
				for j0 := uint32(0); j0 < ln0; j0++ {
					i0 := reader.ReadString()
					if v := AnotherTypeRead(reader); v != nil {
						value[i0] = *v
					}
				}
			}
			_mapOfObj = value
			_mapOfObjSet = true
			reader.Context().Pop()
		case "mapOfArrOfObj":
			reader.Context().Push(field, "map[string][]AnotherType", "type found, reading property")
			var ( value map[string][]AnotherType )
			if reader.IsNil() {
				value = nil
			} else {
				value = make(map[string][]AnotherType)
				ln0 := reader.ReadMapLength()
				for j0 := uint32(0); j0 < ln0; j0++ {
					i0 := reader.ReadString()
					if reader.IsNil() {
						value[i0] = nil
					} else {
						value[i0] = make([]AnotherType, reader.ReadArrayLength())
						ln1 := uint32(len(value[i0]))
						for i1 := uint32(0); i1 < ln1; i1++ {
							if v := AnotherTypeRead(reader); v != nil {
								value[i0][i1] = *v
							}
						}
					}
				}
			}
			_mapOfArrOfObj = value
			_mapOfArrOfObjSet = true
			reader.Context().Pop()
		case "mapCustomValue":
			reader.Context().Push(field, "map[string]*CustomMapValue", "type found, reading property")
			var ( value map[string]*CustomMapValue )
			if reader.IsNil() {
				value = nil
			} else {
				value = make(map[string]*CustomMapValue)
				ln0 := reader.ReadMapLength()
				for j0 := uint32(0); j0 < ln0; j0++ {
					i0 := reader.ReadString()
					if v := CustomMapValueRead(reader); v != nil {
						value[i0] = v
					}
				}
			}
			_mapCustomValue = value
			_mapCustomValueSet = true
			reader.Context().Pop()
		}
		reader.Context().Pop()
	}

	if !_strSet {
		panic(reader.Context().PrintWithContext("Missing required property: 'str: String'"))
	}
	if !_uSet {
		panic(reader.Context().PrintWithContext("Missing required property: 'u: UInt'"))
	}
	if !_u8Set {
		panic(reader.Context().PrintWithContext("Missing required property: 'u8: UInt8'"))
	}
	if !_u16Set {
		panic(reader.Context().PrintWithContext("Missing required property: 'u16: UInt16'"))
	}
	if !_u32Set {
		panic(reader.Context().PrintWithContext("Missing required property: 'u32: UInt32'"))
	}
	if !_iSet {
		panic(reader.Context().PrintWithContext("Missing required property: 'i: Int'"))
	}
	if !_i8Set {
		panic(reader.Context().PrintWithContext("Missing required property: 'i8: Int8'"))
	}
	if !_i16Set {
		panic(reader.Context().PrintWithContext("Missing required property: 'i16: Int16'"))
	}
	if !_i32Set {
		panic(reader.Context().PrintWithContext("Missing required property: 'i32: Int32'"))
	}
	if !_bigintSet {
		panic(reader.Context().PrintWithContext("Missing required property: 'bigint: BigInt'"))
	}
	if !_bignumberSet {
		panic(reader.Context().PrintWithContext("Missing required property: 'bignumber: BigNumber'"))
	}
	if !_jsonSet {
		panic(reader.Context().PrintWithContext("Missing required property: 'json: JSON'"))
	}
	if !_bytesSet {
		panic(reader.Context().PrintWithContext("Missing required property: 'bytes: Bytes'"))
	}
	if !_booleanSet {
		panic(reader.Context().PrintWithContext("Missing required property: 'boolean: Boolean'"))
	}
	if !_u_arraySet {
		panic(reader.Context().PrintWithContext("Missing required property: 'u_array: [UInt]'"))
	}
	if !_uArrayArraySet {
		panic(reader.Context().PrintWithContext("Missing required property: 'uArrayArray: [[UInt]]'"))
	}
	if !_uOptArrayOptArraySet {
		panic(reader.Context().PrintWithContext("Missing required property: 'uOptArrayOptArray: [[UInt32]]'"))
	}
	if !_uArrayOptArrayArraySet {
		panic(reader.Context().PrintWithContext("Missing required property: 'uArrayOptArrayArray: [[[UInt32]]]'"))
	}
	if !_objectSet {
		panic(reader.Context().PrintWithContext("Missing required property: 'object: AnotherType'"))
	}
	if !_objectArraySet {
		panic(reader.Context().PrintWithContext("Missing required property: 'objectArray: [AnotherType]'"))
	}
	if !_enSet {
		panic(reader.Context().PrintWithContext("Missing required property: 'en: CustomEnum'"))
	}
	if !_enumArraySet {
		panic(reader.Context().PrintWithContext("Missing required property: 'enumArray: [CustomEnum]'"))
	}
	if !_mapSet {
		panic(reader.Context().PrintWithContext("Missing required property: 'map: Map<String, Int>'"))
	}
	if !_mapOfArrSet {
		panic(reader.Context().PrintWithContext("Missing required property: 'mapOfArr: Map<String, [Int]>'"))
	}
	if !_mapOfObjSet {
		panic(reader.Context().PrintWithContext("Missing required property: 'mapOfObj: Map<String, AnotherType>'"))
	}
	if !_mapOfArrOfObjSet {
		panic(reader.Context().PrintWithContext("Missing required property: 'mapOfArrOfObj: Map<String, [AnotherType]>'"))
	}
	if !_mapCustomValueSet {
		panic(reader.Context().PrintWithContext("Missing required property: 'mapCustomValue: Map<String, CustomMapValue>'"))
	}
	return &CustomType{
		Str:                 _str,
		OptStr:              _optStr,
		U:                   _u,
		OptU:                _optU,
		M_u8:                _u8,
		M_u16:               _u16,
		M_u32:               _u32,
		I:                   _i,
		M_i8:                _i8,
		M_i16:               _i16,
		M_i32:               _i32,
		Bigint:              _bigint,
		OptBigint:           _optBigint,
		Bignumber:           _bignumber,
		OptBignumber:        _optBignumber,
		Json:                _json,
		OptJson:             _optJson,
		Bytes:               _bytes,
		OptBytes:            _optBytes,
		M_boolean:           _boolean,
		OptBoolean:          _optBoolean,
		U_array:             _u_array,
		UOpt_array:          _uOpt_array,
		_opt_uOptArray:      __opt_uOptArray,
		OptStrOptArray:      _optStrOptArray,
		UArrayArray:         _uArrayArray,
		UOptArrayOptArray:   _uOptArrayOptArray,
		UArrayOptArrayArray: _uArrayOptArrayArray,
		CrazyArray:          _crazyArray,
		Object:              _object,
		OptObject:           _optObject,
		ObjectArray:         _objectArray,
		OptObjectArray:      _optObjectArray,
		En:                  _en,
		OptEnum:             _optEnum,
		EnumArray:           _enumArray,
		OptEnumArray:        _optEnumArray,
		M_map:               _map,
		MapOfArr:            _mapOfArr,
		MapOfObj:            _mapOfObj,
		MapOfArrOfObj:       _mapOfArrOfObj,
		MapCustomValue:      _mapCustomValue,
	}
}
