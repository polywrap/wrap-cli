package module_wrapped

import (
	. "github.com/testorg/testrepo/module/wrap/types"
	"github.com/polywrap/go-wrap/msgpack"
)

func DeserializeModuleMethodArgs(argsBuf []byte) *ArgsModuleMethod {
	ctx := msgpack.NewContext("Deserializing module-type: ModuleMethod")
	reader := msgpack.NewReadDecoder(ctx, argsBuf)

	var (
		_str              string
		_strSet           bool
		_optStr           *string
		_en               CustomEnum
		_enSet            bool
		_optEnum          *CustomEnum
		_enumArray        []CustomEnum
		_enumArraySet     bool
		_optEnumArray     []*CustomEnum
		_map              map[string]int32
		_mapSet           bool
		_mapOfArr         map[string][]int32
		_mapOfArrSet      bool
		_mapOfMap         map[string]map[string]int32
		_mapOfMapSet      bool
		_mapOfObj         map[string]AnotherType
		_mapOfObjSet      bool
		_mapOfArrOfObj    map[string][]AnotherType
		_mapOfArrOfObjSet bool
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
		case "mapOfMap":
			reader.Context().Push(field, "map[string]map[string]int32", "type found, reading property")
			var ( value map[string]map[string]int32 )
			if reader.IsNil() {
				value = nil
			} else {
				value = make(map[string]map[string]int32)
				ln0 := reader.ReadMapLength()
				for j0 := uint32(0); j0 < ln0; j0++ {
					i0 := reader.ReadString()
					if reader.IsNil() {
						value[i0] = nil
					} else {
						value[i0] = make(map[string]int32)
						ln1 := reader.ReadMapLength()
						for j1 := uint32(0); j1 < ln1; j1++ {
							i1 := reader.ReadString()
							value[i0][i1] = reader.ReadI32()
						}
					}
				}
			}
			_mapOfMap = value
			_mapOfMapSet = true
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
		}
		reader.Context().Pop()
	}

	if !_strSet {
		panic(reader.Context().PrintWithContext("Missing required property: 'str: String'"))
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
	if !_mapOfMapSet {
		panic(reader.Context().PrintWithContext("Missing required property: 'mapOfMap: Map<String, Map<String, Int>>'"))
	}
	if !_mapOfObjSet {
		panic(reader.Context().PrintWithContext("Missing required property: 'mapOfObj: Map<String, AnotherType>'"))
	}
	if !_mapOfArrOfObjSet {
		panic(reader.Context().PrintWithContext("Missing required property: 'mapOfArrOfObj: Map<String, [AnotherType]>'"))
	}

	return &ArgsModuleMethod{
		Str:           _str,
		OptStr:        _optStr,
		En:            _en,
		OptEnum:       _optEnum,
		EnumArray:     _enumArray,
		OptEnumArray:  _optEnumArray,
		M_map:         _map,
		MapOfArr:      _mapOfArr,
		MapOfMap:      _mapOfMap,
		MapOfObj:      _mapOfObj,
		MapOfArrOfObj: _mapOfArrOfObj,
	}
}

func SerializeModuleMethodResult(value int32) []byte {
	ctx := msgpack.NewContext("Serializing module-type: ModuleMethod")
	encoder := msgpack.NewWriteEncoder(ctx)
	WriteModuleMethodResult(encoder, value);
	return encoder.Buffer()
}

func WriteModuleMethodResult(writer msgpack.Write, value int32) {
	writer.Context().Push("moduleMethod", "int32", "writing property")
	{
		v := value
		writer.WriteI32(v)
	}
	writer.Context().Pop()
}

func DeserializeObjectMethodArgs(argsBuf []byte) *ArgsObjectMethod {
	ctx := msgpack.NewContext("Deserializing module-type: ObjectMethod")
	reader := msgpack.NewReadDecoder(ctx, argsBuf)

	var (
		_object         AnotherType
		_objectSet      bool
		_optObject      *AnotherType
		_objectArray    []AnotherType
		_objectArraySet bool
		_optObjectArray []*AnotherType
	)

	for i := int32(reader.ReadMapLength()); i > 0; i-- {
		field := reader.ReadString()
		reader.Context().Push(field, "unknown", "searching for property type")
		switch field {
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
		}
		reader.Context().Pop()
	}

	if !_objectSet {
		panic(reader.Context().PrintWithContext("Missing required property: 'object: AnotherType'"))
	}
	if !_objectArraySet {
		panic(reader.Context().PrintWithContext("Missing required property: 'objectArray: [AnotherType]'"))
	}

	return &ArgsObjectMethod{
		Object:         _object,
		OptObject:      _optObject,
		ObjectArray:    _objectArray,
		OptObjectArray: _optObjectArray,
	}
}

func SerializeObjectMethodResult(value *AnotherType) []byte {
	ctx := msgpack.NewContext("Serializing module-type: ObjectMethod")
	encoder := msgpack.NewWriteEncoder(ctx)
	WriteObjectMethodResult(encoder, value);
	return encoder.Buffer()
}

func WriteObjectMethodResult(writer msgpack.Write, value *AnotherType) {
	writer.Context().Push("objectMethod", "*AnotherType", "writing property")
	{
		v := value
		AnotherTypeWrite(writer, v)
	}
	writer.Context().Pop()
}

func DeserializeOptionalEnvMethodArgs(argsBuf []byte) *ArgsOptionalEnvMethod {
	ctx := msgpack.NewContext("Deserializing module-type: OptionalEnvMethod")
	reader := msgpack.NewReadDecoder(ctx, argsBuf)

	var (
		_object         AnotherType
		_objectSet      bool
		_optObject      *AnotherType
		_objectArray    []AnotherType
		_objectArraySet bool
		_optObjectArray []*AnotherType
	)

	for i := int32(reader.ReadMapLength()); i > 0; i-- {
		field := reader.ReadString()
		reader.Context().Push(field, "unknown", "searching for property type")
		switch field {
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
		}
		reader.Context().Pop()
	}

	if !_objectSet {
		panic(reader.Context().PrintWithContext("Missing required property: 'object: AnotherType'"))
	}
	if !_objectArraySet {
		panic(reader.Context().PrintWithContext("Missing required property: 'objectArray: [AnotherType]'"))
	}

	return &ArgsOptionalEnvMethod{
		Object:         _object,
		OptObject:      _optObject,
		ObjectArray:    _objectArray,
		OptObjectArray: _optObjectArray,
	}
}

func SerializeOptionalEnvMethodResult(value *AnotherType) []byte {
	ctx := msgpack.NewContext("Serializing module-type: OptionalEnvMethod")
	encoder := msgpack.NewWriteEncoder(ctx)
	WriteOptionalEnvMethodResult(encoder, value);
	return encoder.Buffer()
}

func WriteOptionalEnvMethodResult(writer msgpack.Write, value *AnotherType) {
	writer.Context().Push("optionalEnvMethod", "*AnotherType", "writing property")
	{
		v := value
		AnotherTypeWrite(writer, v)
	}
	writer.Context().Pop()
}

func DeserializeIfArgs(argsBuf []byte) *ArgsIf {
	ctx := msgpack.NewContext("Deserializing module-type: If")
	reader := msgpack.NewReadDecoder(ctx, argsBuf)

	var (
		_if    Else
		_ifSet bool
	)

	for i := int32(reader.ReadMapLength()); i > 0; i-- {
		field := reader.ReadString()
		reader.Context().Push(field, "unknown", "searching for property type")
		switch field {
		case "if":
			reader.Context().Push(field, "Else", "type found, reading property")
			var ( value Else )
			if v := ElseRead(reader); v != nil {
				value = *v
			}
			_if = value
			_ifSet = true
			reader.Context().Pop()
		}
		reader.Context().Pop()
	}

	if !_ifSet {
		panic(reader.Context().PrintWithContext("Missing required property: 'if: else'"))
	}

	return &ArgsIf{
		M_if: _if,
	}
}

func SerializeIfResult(value Else) []byte {
	ctx := msgpack.NewContext("Serializing module-type: If")
	encoder := msgpack.NewWriteEncoder(ctx)
	WriteIfResult(encoder, value);
	return encoder.Buffer()
}

func WriteIfResult(writer msgpack.Write, value Else) {
	writer.Context().Push("if", "Else", "writing property")
	{
		v := value
		ElseWrite(writer, &v)
	}
	writer.Context().Pop()
}
