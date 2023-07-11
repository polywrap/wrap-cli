package types

import (
	"github.com/polywrap/go-wrap/polywrap/msgpack"
	"github.com/polywrap/go-wrap/polywrap/msgpack/big"
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
	writer.Context().Push("Str", "string", "writing property")
	writer.WriteString("Str")
	{
		v := value.Str
		writer.WriteString(v)
	}
	writer.Context().Pop()
	writer.Context().Push("OptStr", "*string", "writing property")
	writer.WriteString("OptStr")
	{
		v := value.OptStr
		if v == nil {
			writer.WriteNil()
		} else {
			writer.WriteString(*v)
		}
	}
	writer.Context().Pop()
	writer.Context().Push("U", "uint32", "writing property")
	writer.WriteString("U")
	{
		v := value.U
		writer.WriteU32(v)
	}
	writer.Context().Pop()
	writer.Context().Push("OptU", "*uint32", "writing property")
	writer.WriteString("OptU")
	{
		v := value.OptU
		if v == nil {
			writer.WriteNil()
		} else {
			writer.WriteU32(*v)
		}
	}
	writer.Context().Pop()
	writer.Context().Push("M_u8", "uint8", "writing property")
	writer.WriteString("M_u8")
	{
		v := value.M_u8
		writer.WriteU8(v)
	}
	writer.Context().Pop()
	writer.Context().Push("M_u16", "uint16", "writing property")
	writer.WriteString("M_u16")
	{
		v := value.M_u16
		writer.WriteU16(v)
	}
	writer.Context().Pop()
	writer.Context().Push("M_u32", "uint32", "writing property")
	writer.WriteString("M_u32")
	{
		v := value.M_u32
		writer.WriteU32(v)
	}
	writer.Context().Pop()
	writer.Context().Push("I", "int32", "writing property")
	writer.WriteString("I")
	{
		v := value.I
		writer.WriteI32(v)
	}
	writer.Context().Pop()
	writer.Context().Push("M_i8", "int8", "writing property")
	writer.WriteString("M_i8")
	{
		v := value.M_i8
		writer.WriteI8(v)
	}
	writer.Context().Pop()
	writer.Context().Push("M_i16", "int16", "writing property")
	writer.WriteString("M_i16")
	{
		v := value.M_i16
		writer.WriteI16(v)
	}
	writer.Context().Pop()
	writer.Context().Push("M_i32", "int32", "writing property")
	writer.WriteString("M_i32")
	{
		v := value.M_i32
		writer.WriteI32(v)
	}
	writer.Context().Pop()
	writer.Context().Push("Bigint", "*big.Int", "writing property")
	writer.WriteString("Bigint")
	{
		v := value.Bigint
		writer.WriteBigInt(v)
	}
	writer.Context().Pop()
	writer.Context().Push("OptBigint", "*big.Int", "writing property")
	writer.WriteString("OptBigint")
	{
		v := value.OptBigint
		if v == nil {
			writer.WriteNil()
		} else {
			writer.WriteBigInt(v)
		}
	}
	writer.Context().Pop()
	writer.Context().Push("Bignumber", "*big.Int", "writing property")
	writer.WriteString("Bignumber")
	{
		v := value.Bignumber
		writer.WriteBigInt(v)
	}
	writer.Context().Pop()
	writer.Context().Push("OptBignumber", "*big.Int", "writing property")
	writer.WriteString("OptBignumber")
	{
		v := value.OptBignumber
		if v == nil {
			writer.WriteNil()
		} else {
			writer.WriteBigInt(v)
		}
	}
	writer.Context().Pop()
	writer.Context().Push("Json", "*fastjson.Value", "writing property")
	writer.WriteString("Json")
	{
		v := value.Json
		writer.WriteJson(v)
	}
	writer.Context().Pop()
	writer.Context().Push("OptJson", "*fastjson.Value", "writing property")
	writer.WriteString("OptJson")
	{
		v := value.OptJson
		if v == nil {
			writer.WriteNil()
		} else {
			writer.WriteJson(v)
		}
	}
	writer.Context().Pop()
	writer.Context().Push("Bytes", "[]byte", "writing property")
	writer.WriteString("Bytes")
	{
		v := value.Bytes
		writer.WriteBytes(v)
	}
	writer.Context().Pop()
	writer.Context().Push("OptBytes", "[]byte", "writing property")
	writer.WriteString("OptBytes")
	{
		v := value.OptBytes
		if v == nil {
			writer.WriteNil()
		} else {
			writer.WriteBytes(v)
		}
	}
	writer.Context().Pop()
	writer.Context().Push("M_boolean", "bool", "writing property")
	writer.WriteString("M_boolean")
	{
		v := value.M_boolean
		writer.WriteBool(v)
	}
	writer.Context().Pop()
	writer.Context().Push("OptBoolean", "*bool", "writing property")
	writer.WriteString("OptBoolean")
	{
		v := value.OptBoolean
		if v == nil {
			writer.WriteNil()
		} else {
			writer.WriteBool(*v)
		}
	}
	writer.Context().Pop()
	writer.Context().Push("U_array", "[]uint32", "writing property")
	writer.WriteString("U_array")
	if value.U_array == nil {
		writer.WriteNil()
	} else if len(value.U_array) == 0 {
		writer.WriteNil()
	} else {
		for i0 := range value.U_array {
			{
				v := value.U_array[i0]
				writer.WriteU32(v)
			}
		}
	}
	writer.Context().Pop()
	writer.Context().Push("UOpt_array", "[]uint32", "writing property")
	writer.WriteString("UOpt_array")
	if value.UOpt_array == nil {
		writer.WriteNil()
	} else if len(value.UOpt_array) == 0 {
		writer.WriteNil()
	} else {
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
	writer.Context().Push("OptStrOptArray", "[]*string", "writing property")
	writer.WriteString("OptStrOptArray")
	if value.OptStrOptArray == nil {
		writer.WriteNil()
	} else if len(value.OptStrOptArray) == 0 {
		writer.WriteNil()
	} else {
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
	writer.Context().Push("UArrayArray", "[][]uint32", "writing property")
	writer.WriteString("UArrayArray")
	if value.UArrayArray == nil {
		writer.WriteNil()
	} else if len(value.UArrayArray) == 0 {
		writer.WriteNil()
	} else {
		for i0 := range value.UArrayArray {
			if value.UArrayArray[i0] == nil {
				writer.WriteNil()
			} else if len(value.UArrayArray[i0]) == 0 {
				writer.WriteNil()
			} else {
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
	writer.Context().Push("UOptArrayOptArray", "[][]*uint32", "writing property")
	writer.WriteString("UOptArrayOptArray")
	if value.UOptArrayOptArray == nil {
		writer.WriteNil()
	} else if len(value.UOptArrayOptArray) == 0 {
		writer.WriteNil()
	} else {
		for i0 := range value.UOptArrayOptArray {
			if value.UOptArrayOptArray[i0] == nil {
				writer.WriteNil()
			} else if len(value.UOptArrayOptArray[i0]) == 0 {
				writer.WriteNil()
			} else {
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
	writer.Context().Push("UArrayOptArrayArray", "[][][]uint32", "writing property")
	writer.WriteString("UArrayOptArrayArray")
	if value.UArrayOptArrayArray == nil {
		writer.WriteNil()
	} else if len(value.UArrayOptArrayArray) == 0 {
		writer.WriteNil()
	} else {
		for i0 := range value.UArrayOptArrayArray {
			if value.UArrayOptArrayArray[i0] == nil {
				writer.WriteNil()
			} else if len(value.UArrayOptArrayArray[i0]) == 0 {
				writer.WriteNil()
			} else {
				for i1 := range value.UArrayOptArrayArray[i0] {
					if value.UArrayOptArrayArray[i0][i1] == nil {
						writer.WriteNil()
					} else if len(value.UArrayOptArrayArray[i0][i1]) == 0 {
						writer.WriteNil()
					} else {
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
	writer.Context().Push("CrazyArray", "[][][][]uint32", "writing property")
	writer.WriteString("CrazyArray")
	if value.CrazyArray == nil {
		writer.WriteNil()
	} else if len(value.CrazyArray) == 0 {
		writer.WriteNil()
	} else {
		for i0 := range value.CrazyArray {
			if value.CrazyArray[i0] == nil {
				writer.WriteNil()
			} else if len(value.CrazyArray[i0]) == 0 {
				writer.WriteNil()
			} else {
				for i1 := range value.CrazyArray[i0] {
					if value.CrazyArray[i0][i1] == nil {
						writer.WriteNil()
					} else if len(value.CrazyArray[i0][i1]) == 0 {
						writer.WriteNil()
					} else {
						for i2 := range value.CrazyArray[i0][i1] {
							if value.CrazyArray[i0][i1][i2] == nil {
								writer.WriteNil()
							} else if len(value.CrazyArray[i0][i1][i2]) == 0 {
								writer.WriteNil()
							} else {
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
	writer.Context().Push("Object", "AnotherType", "writing property")
	writer.WriteString("Object")
	{
		v := value.Object
		AnotherTypeWrite(writer, &v)
	}
	writer.Context().Pop()
	writer.Context().Push("OptObject", "*AnotherType", "writing property")
	writer.WriteString("OptObject")
	{
		v := value.OptObject
		AnotherTypeWrite(writer, v)
	}
	writer.Context().Pop()
	writer.Context().Push("ObjectArray", "[]AnotherType", "writing property")
	writer.WriteString("ObjectArray")
	if value.ObjectArray == nil {
		writer.WriteNil()
	} else if len(value.ObjectArray) == 0 {
		writer.WriteNil()
	} else {
		for i0 := range value.ObjectArray {
			{
				v := value.ObjectArray[i0]
				AnotherTypeWrite(writer, &v)
			}
		}
	}
	writer.Context().Pop()
	writer.Context().Push("OptObjectArray", "[]*AnotherType", "writing property")
	writer.WriteString("OptObjectArray")
	if value.OptObjectArray == nil {
		writer.WriteNil()
	} else if len(value.OptObjectArray) == 0 {
		writer.WriteNil()
	} else {
		for i0 := range value.OptObjectArray {
			{
				v := value.OptObjectArray[i0]
				AnotherTypeWrite(writer, v)
			}
		}
	}
	writer.Context().Pop()
	writer.Context().Push("En", "CustomEnum", "writing property")
	writer.WriteString("En")
	{
		v := value.En
		writer.WriteI32(int32(v))
	}
	writer.Context().Pop()
	writer.Context().Push("OptEnum", "*CustomEnum", "writing property")
	writer.WriteString("OptEnum")
	{
		v := value.OptEnum
		if v == nil {
			writer.WriteNil()
		} else {
			writer.WriteI32(int32(*v))
		}
	}
	writer.Context().Pop()
	writer.Context().Push("EnumArray", "[]CustomEnum", "writing property")
	writer.WriteString("EnumArray")
	if value.EnumArray == nil {
		writer.WriteNil()
	} else if len(value.EnumArray) == 0 {
		writer.WriteNil()
	} else {
		for i0 := range value.EnumArray {
			{
				v := value.EnumArray[i0]
				writer.WriteI32(int32(v))
			}
		}
	}
	writer.Context().Pop()
	writer.Context().Push("OptEnumArray", "[]*CustomEnum", "writing property")
	writer.WriteString("OptEnumArray")
	if value.OptEnumArray == nil {
		writer.WriteNil()
	} else if len(value.OptEnumArray) == 0 {
		writer.WriteNil()
	} else {
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
	writer.Context().Push("M_map", "map[string]int32", "writing property")
	writer.WriteString("M_map")
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
	writer.Context().Push("MapOfArr", "map[string][]int32", "writing property")
	writer.WriteString("MapOfArr")
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
	writer.Context().Push("MapOfObj", "map[string]AnotherType", "writing property")
	writer.WriteString("MapOfObj")
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
	writer.Context().Push("MapOfArrOfObj", "map[string][]AnotherType", "writing property")
	writer.WriteString("MapOfArrOfObj")
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
	writer.Context().Push("MapCustomValue", "map[string]*CustomMapValue", "writing property")
	writer.WriteString("MapCustomValue")
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
			_str = reader.ReadString()
			_strSet = true
			reader.Context().Pop()
		case "optStr":
			reader.Context().Push(field, "*string", "type found, reading property")
			if !reader.IsNil() {
				v := reader.ReadString()
				_optStr = &v
			}
			reader.Context().Pop()
		case "u":
			reader.Context().Push(field, "uint32", "type found, reading property")
			_u = reader.ReadU32()
			_uSet = true
			reader.Context().Pop()
		case "optU":
			reader.Context().Push(field, "*uint32", "type found, reading property")
			if !reader.IsNil() {
				v := reader.ReadU32()
				_optU = &v
			}
			reader.Context().Pop()
		case "u8":
			reader.Context().Push(field, "uint8", "type found, reading property")
			_u8 = reader.ReadU8()
			_u8Set = true
			reader.Context().Pop()
		case "u16":
			reader.Context().Push(field, "uint16", "type found, reading property")
			_u16 = reader.ReadU16()
			_u16Set = true
			reader.Context().Pop()
		case "u32":
			reader.Context().Push(field, "uint32", "type found, reading property")
			_u32 = reader.ReadU32()
			_u32Set = true
			reader.Context().Pop()
		case "i":
			reader.Context().Push(field, "int32", "type found, reading property")
			_i = reader.ReadI32()
			_iSet = true
			reader.Context().Pop()
		case "i8":
			reader.Context().Push(field, "int8", "type found, reading property")
			_i8 = reader.ReadI8()
			_i8Set = true
			reader.Context().Pop()
		case "i16":
			reader.Context().Push(field, "int16", "type found, reading property")
			_i16 = reader.ReadI16()
			_i16Set = true
			reader.Context().Pop()
		case "i32":
			reader.Context().Push(field, "int32", "type found, reading property")
			_i32 = reader.ReadI32()
			_i32Set = true
			reader.Context().Pop()
		case "bigint":
			reader.Context().Push(field, "*big.Int", "type found, reading property")
			_bigint = reader.ReadBigInt()
			_bigintSet = true
			reader.Context().Pop()
		case "optBigint":
			reader.Context().Push(field, "*big.Int", "type found, reading property")
			if !reader.IsNil() {
				v := reader.ReadBigInt()
				_optBigint = v
			}
			reader.Context().Pop()
		case "bignumber":
			reader.Context().Push(field, "*big.Int", "type found, reading property")
			_bignumber = reader.ReadBigInt()
			_bignumberSet = true
			reader.Context().Pop()
		case "optBignumber":
			reader.Context().Push(field, "*big.Int", "type found, reading property")
			if !reader.IsNil() {
				v := reader.ReadBigInt()
				_optBignumber = v
			}
			reader.Context().Pop()
		case "json":
			reader.Context().Push(field, "*fastjson.Value", "type found, reading property")
			_json = reader.ReadJson()
			_jsonSet = true
			reader.Context().Pop()
		case "optJson":
			reader.Context().Push(field, "*fastjson.Value", "type found, reading property")
			if !reader.IsNil() {
				v := reader.ReadJson()
				_optJson = v
			}
			reader.Context().Pop()
		case "bytes":
			reader.Context().Push(field, "[]byte", "type found, reading property")
			_bytes = reader.ReadBytes()
			_bytesSet = true
			reader.Context().Pop()
		case "optBytes":
			reader.Context().Push(field, "[]byte", "type found, reading property")
			if !reader.IsNil() {
				v := reader.ReadBytes()
				_optBytes = v
			}
			reader.Context().Pop()
		case "boolean":
			reader.Context().Push(field, "bool", "type found, reading property")
			_boolean = reader.ReadBool()
			_booleanSet = true
			reader.Context().Pop()
		case "optBoolean":
			reader.Context().Push(field, "*bool", "type found, reading property")
			if !reader.IsNil() {
				v := reader.ReadBool()
				_optBoolean = &v
			}
			reader.Context().Pop()
		case "u_array":
			reader.Context().Push(field, "[]uint32", "type found, reading property")
			if reader.IsNil() {
				_u_array = nil
			} else {
				ln0 := reader.ReadArrayLength()
				_u_array = make([]uint32, ln0)
				for i0 := uint32(0); i0 < ln0; i0++ {
					_u_array[i0] = reader.ReadU32()
				}
			}
			_u_arraySet = true
			reader.Context().Pop()
		case "uOpt_array":
			reader.Context().Push(field, "[]uint32", "type found, reading property")
			if reader.IsNil() {
				_uOpt_array = nil
			} else {
				ln0 := reader.ReadArrayLength()
				_uOpt_array = make([]uint32, ln0)
				for i0 := uint32(0); i0 < ln0; i0++ {
					_uOpt_array[i0] = reader.ReadU32()
				}
			}
			reader.Context().Pop()
		case "_opt_uOptArray":
			reader.Context().Push(field, "[]*uint32", "type found, reading property")
			if reader.IsNil() {
				__opt_uOptArray = nil
			} else {
				ln0 := reader.ReadArrayLength()
				__opt_uOptArray = make([]*uint32, ln0)
				for i0 := uint32(0); i0 < ln0; i0++ {
					if !reader.IsNil() {
						v := reader.ReadU32()
						__opt_uOptArray[i0] = &v
					}
				}
			}
			reader.Context().Pop()
		case "optStrOptArray":
			reader.Context().Push(field, "[]*string", "type found, reading property")
			if reader.IsNil() {
				_optStrOptArray = nil
			} else {
				ln0 := reader.ReadArrayLength()
				_optStrOptArray = make([]*string, ln0)
				for i0 := uint32(0); i0 < ln0; i0++ {
					if !reader.IsNil() {
						v := reader.ReadString()
						_optStrOptArray[i0] = &v
					}
				}
			}
			reader.Context().Pop()
		case "uArrayArray":
			reader.Context().Push(field, "[][]uint32", "type found, reading property")
			if reader.IsNil() {
				_uArrayArray = nil
			} else {
				ln0 := reader.ReadArrayLength()
				_uArrayArray = make([][]uint32, ln0)
				for i0 := uint32(0); i0 < ln0; i0++ {
					if reader.IsNil() {
						_uArrayArray[i0] = nil
					} else {
						ln1 := reader.ReadArrayLength()
						_uArrayArray[i0] = make([]uint32, ln1)
						for i1 := uint32(0); i1 < ln1; i1++ {
							_uArrayArray[i0][i1] = reader.ReadU32()
						}
					}
				}
			}
			_uArrayArraySet = true
			reader.Context().Pop()
		case "uOptArrayOptArray":
			reader.Context().Push(field, "[][]*uint32", "type found, reading property")
			if reader.IsNil() {
				_uOptArrayOptArray = nil
			} else {
				ln0 := reader.ReadArrayLength()
				_uOptArrayOptArray = make([][]*uint32, ln0)
				for i0 := uint32(0); i0 < ln0; i0++ {
					if reader.IsNil() {
						_uOptArrayOptArray[i0] = nil
					} else {
						ln1 := reader.ReadArrayLength()
						_uOptArrayOptArray[i0] = make([]*uint32, ln1)
						for i1 := uint32(0); i1 < ln1; i1++ {
							if !reader.IsNil() {
								v := reader.ReadU32()
								_uOptArrayOptArray[i0][i1] = &v
							}
						}
					}
				}
			}
			_uOptArrayOptArraySet = true
			reader.Context().Pop()
		case "uArrayOptArrayArray":
			reader.Context().Push(field, "[][][]uint32", "type found, reading property")
			if reader.IsNil() {
				_uArrayOptArrayArray = nil
			} else {
				ln0 := reader.ReadArrayLength()
				_uArrayOptArrayArray = make([][][]uint32, ln0)
				for i0 := uint32(0); i0 < ln0; i0++ {
					if reader.IsNil() {
						_uArrayOptArrayArray[i0] = nil
					} else {
						ln1 := reader.ReadArrayLength()
						_uArrayOptArrayArray[i0] = make([][]uint32, ln1)
						for i1 := uint32(0); i1 < ln1; i1++ {
							if reader.IsNil() {
								_uArrayOptArrayArray[i0][i1] = nil
							} else {
								ln2 := reader.ReadArrayLength()
								_uArrayOptArrayArray[i0][i1] = make([]uint32, ln2)
								for i2 := uint32(0); i2 < ln2; i2++ {
									_uArrayOptArrayArray[i0][i1][i2] = reader.ReadU32()
								}
							}
						}
					}
				}
			}
			_uArrayOptArrayArraySet = true
			reader.Context().Pop()
		case "crazyArray":
			reader.Context().Push(field, "[][][][]uint32", "type found, reading property")
			if reader.IsNil() {
				_crazyArray = nil
			} else {
				ln0 := reader.ReadArrayLength()
				_crazyArray = make([][][][]uint32, ln0)
				for i0 := uint32(0); i0 < ln0; i0++ {
					if reader.IsNil() {
						_crazyArray[i0] = nil
					} else {
						ln1 := reader.ReadArrayLength()
						_crazyArray[i0] = make([][][]uint32, ln1)
						for i1 := uint32(0); i1 < ln1; i1++ {
							if reader.IsNil() {
								_crazyArray[i0][i1] = nil
							} else {
								ln2 := reader.ReadArrayLength()
								_crazyArray[i0][i1] = make([][]uint32, ln2)
								for i2 := uint32(0); i2 < ln2; i2++ {
									if reader.IsNil() {
										_crazyArray[i0][i1][i2] = nil
									} else {
										ln3 := reader.ReadArrayLength()
										_crazyArray[i0][i1][i2] = make([]uint32, ln3)
										for i3 := uint32(0); i3 < ln3; i3++ {
											_crazyArray[i0][i1][i2][i3] = reader.ReadU32()
										}
									}
								}
							}
						}
					}
				}
			}
			reader.Context().Pop()
		case "object":
			reader.Context().Push(field, "AnotherType", "type found, reading property")
			if v := AnotherTypeRead(reader); v != nil {
				_object = *v
			}
			_objectSet = true
			reader.Context().Pop()
		case "optObject":
			reader.Context().Push(field, "*AnotherType", "type found, reading property")
			if v := AnotherTypeRead(reader); v != nil {
				_optObject = v
			}
			reader.Context().Pop()
		case "objectArray":
			reader.Context().Push(field, "[]AnotherType", "type found, reading property")
			if reader.IsNil() {
				_objectArray = nil
			} else {
				ln0 := reader.ReadArrayLength()
				_objectArray = make([]AnotherType, ln0)
				for i0 := uint32(0); i0 < ln0; i0++ {
					if v := AnotherTypeRead(reader); v != nil {
						_objectArray[i0] = *v
					}
				}
			}
			_objectArraySet = true
			reader.Context().Pop()
		case "optObjectArray":
			reader.Context().Push(field, "[]*AnotherType", "type found, reading property")
			if reader.IsNil() {
				_optObjectArray = nil
			} else {
				ln0 := reader.ReadArrayLength()
				_optObjectArray = make([]*AnotherType, ln0)
				for i0 := uint32(0); i0 < ln0; i0++ {
					if v := AnotherTypeRead(reader); v != nil {
						_optObjectArray[i0] = v
					}
				}
			}
			reader.Context().Pop()
		case "en":
			reader.Context().Push(field, "CustomEnum", "type found, reading property")
			_en = CustomEnum(reader.ReadI32())
			SanitizeCustomEnumValue(int32(_en))
			_enSet = true
			reader.Context().Pop()
		case "optEnum":
			reader.Context().Push(field, "*CustomEnum", "type found, reading property")
			if !reader.IsNil() {
				v := CustomEnum(reader.ReadI32())
				SanitizeCustomEnumValue(int32(v))
				_optEnum = &v
			}
			reader.Context().Pop()
		case "enumArray":
			reader.Context().Push(field, "[]CustomEnum", "type found, reading property")
			if reader.IsNil() {
				_enumArray = nil
			} else {
				ln0 := reader.ReadArrayLength()
				_enumArray = make([]CustomEnum, ln0)
				for i0 := uint32(0); i0 < ln0; i0++ {
					_enumArray[i0] = CustomEnum(reader.ReadI32())
					SanitizeCustomEnumValue(int32(_enumArray[i0]))
				}
			}
			_enumArraySet = true
			reader.Context().Pop()
		case "optEnumArray":
			reader.Context().Push(field, "[]*CustomEnum", "type found, reading property")
			if reader.IsNil() {
				_optEnumArray = nil
			} else {
				ln0 := reader.ReadArrayLength()
				_optEnumArray = make([]*CustomEnum, ln0)
				for i0 := uint32(0); i0 < ln0; i0++ {
					if !reader.IsNil() {
						v := CustomEnum(reader.ReadI32())
						SanitizeCustomEnumValue(int32(v))
						_optEnumArray[i0] = &v
					}
				}
			}
			reader.Context().Pop()
		case "map":
			reader.Context().Push(field, "map[string]int32", "type found, reading property")
			if reader.IsNil() {
				_map = nil
			} else {
				ln0 := reader.ReadMapLength()
				_map = make(map[string]int32)
				for j0 := uint32(0); j0 < ln0; j0++ {
					i0 := reader.ReadString()
					_map[i0] = reader.ReadI32()
				}
			}
			_mapSet = true
			reader.Context().Pop()
		case "mapOfArr":
			reader.Context().Push(field, "map[string][]int32", "type found, reading property")
			if reader.IsNil() {
				_mapOfArr = nil
			} else {
				ln0 := reader.ReadMapLength()
				_mapOfArr = make(map[string][]int32)
				for j0 := uint32(0); j0 < ln0; j0++ {
					i0 := reader.ReadString()
					if reader.IsNil() {
						_mapOfArr[i0] = nil
					} else {
						ln1 := reader.ReadArrayLength()
						_mapOfArr[i0] = make([]int32, ln1)
						for i1 := uint32(0); i1 < ln1; i1++ {
							_mapOfArr[i0][i1] = reader.ReadI32()
						}
					}
				}
			}
			_mapOfArrSet = true
			reader.Context().Pop()
		case "mapOfObj":
			reader.Context().Push(field, "map[string]AnotherType", "type found, reading property")
			if reader.IsNil() {
				_mapOfObj = nil
			} else {
				ln0 := reader.ReadMapLength()
				_mapOfObj = make(map[string]AnotherType)
				for j0 := uint32(0); j0 < ln0; j0++ {
					i0 := reader.ReadString()
					if v := AnotherTypeRead(reader); v != nil {
						_mapOfObj[i0] = *v
					}
				}
			}
			_mapOfObjSet = true
			reader.Context().Pop()
		case "mapOfArrOfObj":
			reader.Context().Push(field, "map[string][]AnotherType", "type found, reading property")
			if reader.IsNil() {
				_mapOfArrOfObj = nil
			} else {
				ln0 := reader.ReadMapLength()
				_mapOfArrOfObj = make(map[string][]AnotherType)
				for j0 := uint32(0); j0 < ln0; j0++ {
					i0 := reader.ReadString()
					if reader.IsNil() {
						_mapOfArrOfObj[i0] = nil
					} else {
						ln1 := reader.ReadArrayLength()
						_mapOfArrOfObj[i0] = make([]AnotherType, ln1)
						for i1 := uint32(0); i1 < ln1; i1++ {
							if v := AnotherTypeRead(reader); v != nil {
								_mapOfArrOfObj[i0][i1] = *v
							}
						}
					}
				}
			}
			_mapOfArrOfObjSet = true
			reader.Context().Pop()
		case "mapCustomValue":
			reader.Context().Push(field, "map[string]*CustomMapValue", "type found, reading property")
			if reader.IsNil() {
				_mapCustomValue = nil
			} else {
				ln0 := reader.ReadMapLength()
				_mapCustomValue = make(map[string]*CustomMapValue)
				for j0 := uint32(0); j0 < ln0; j0++ {
					i0 := reader.ReadString()
					if v := CustomMapValueRead(reader); v != nil {
						_mapCustomValue[i0] = v
					}
				}
			}
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
