package module

import (
	"github.com/consideritdone/polywrap-go/polywrap/msgpack"
	"github.com/testorg/testrepo/wrap/types"
)

func DeserializeModuleMethodArgs(argsBuf []byte) *types.ArgsModuleMethod {
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
		_mapOfObj         map[string]AnotherType
		_mapOfObjSet      bool
		_mapOfArrOfObj    map[string][]AnotherType
		_mapOfArrOfObjSet bool
	)

	for i := int32(reader.ReadMapLength()); i > 0; i-- {
		field := reader.ReadString()
		reader.Context().Push(field, "unknown", "searching for property type")
		reader.Context().Pop()
		switch field {
		case "Str":
			reader.Context().Push(field, "string", "type found, reading property")
			_str = reader.ReadString()
			_strSet = true
			reader.Context().Pop()
		case "OptStr":
			reader.Context().Push(field, "*string", "type found, reading property")
			if !reader.IsNil() {
				v := reader.ReadString()
				_optStr = &v
			}
			reader.Context().Pop()
		case "En":
			reader.Context().Push(field, "CustomEnum", "type found, reading property")
			_en = CustomEnum(reader.ReadI32())
			SanitizeCustomEnumValue(int32(_en))
			_enSet = true
			reader.Context().Pop()
		case "OptEnum":
			reader.Context().Push(field, "*CustomEnum", "type found, reading property")
			if !reader.IsNil() {
				v := CustomEnum(reader.ReadI32())
				SanitizeCustomEnumValue(int32(v))
				_optEnum = &v
			}
			reader.Context().Pop()
		case "EnumArray":
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
		case "OptEnumArray":
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
		case "Map":
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
		case "MapOfArr":
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
		case "MapOfObj":
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
		case "MapOfArrOfObj":
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
		}
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
	if !_mapOfObjSet {
		panic(reader.Context().PrintWithContext("Missing required property: 'mapOfObj: Map<String, AnotherType>'"))
	}
	if !_mapOfArrOfObjSet {
		panic(reader.Context().PrintWithContext("Missing required property: 'mapOfArrOfObj: Map<String, [AnotherType]>'"))
	}

	return &types.ArgsModuleMethod{
		Str:           _str,
		OptStr:        _optStr,
		En:            _en,
		OptEnum:       _optEnum,
		EnumArray:     _enumArray,
		OptEnumArray:  _optEnumArray,
		Map:           _map,
		MapOfArr:      _mapOfArr,
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

func DeserializeObjectMethodArgs(argsBuf []byte) *types.ArgsObjectMethod {
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
		reader.Context().Pop()
		switch field {
		case "Object":
			reader.Context().Push(field, "AnotherType", "type found, reading property")
			if v := AnotherTypeRead(reader); v != nil {
				_object = *v
			}
			_objectSet = true
			reader.Context().Pop()
		case "OptObject":
			reader.Context().Push(field, "*AnotherType", "type found, reading property")
			if v := AnotherTypeRead(reader); v != nil {
				_optObject = v
			}
			reader.Context().Pop()
		case "ObjectArray":
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
		case "OptObjectArray":
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
		}
	}

	if !_objectSet {
		panic(reader.Context().PrintWithContext("Missing required property: 'object: AnotherType'"))
	}
	if !_objectArraySet {
		panic(reader.Context().PrintWithContext("Missing required property: 'objectArray: [AnotherType]'"))
	}

	return &types.ArgsObjectMethod{
		Object:         _object,
		OptObject:      _optObject,
		ObjectArray:    _objectArray,
		OptObjectArray: _optObjectArray,
	}
}

func SerializeObjectMethodResult(value *types.AnotherType) []byte {
	ctx := msgpack.NewContext("Serializing module-type: ObjectMethod")
	encoder := msgpack.NewWriteEncoder(ctx)
	WriteObjectMethodResult(encoder, value);
	return encoder.Buffer()
}

func WriteObjectMethodResult(writer msgpack.Write, value *types.AnotherType) {
	writer.Context().Push("objectMethod", "*AnotherType", "writing property")
	{
		v := value
		types.AnotherTypeWrite(writer, v)
	}
	writer.Context().Pop()
}

func DeserializeOptionalEnvMethodArgs(argsBuf []byte) *types.ArgsOptionalEnvMethod {
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
		reader.Context().Pop()
		switch field {
		case "Object":
			reader.Context().Push(field, "AnotherType", "type found, reading property")
			if v := AnotherTypeRead(reader); v != nil {
				_object = *v
			}
			_objectSet = true
			reader.Context().Pop()
		case "OptObject":
			reader.Context().Push(field, "*AnotherType", "type found, reading property")
			if v := AnotherTypeRead(reader); v != nil {
				_optObject = v
			}
			reader.Context().Pop()
		case "ObjectArray":
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
		case "OptObjectArray":
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
		}
	}

	if !_objectSet {
		panic(reader.Context().PrintWithContext("Missing required property: 'object: AnotherType'"))
	}
	if !_objectArraySet {
		panic(reader.Context().PrintWithContext("Missing required property: 'objectArray: [AnotherType]'"))
	}

	return &types.ArgsOptionalEnvMethod{
		Object:         _object,
		OptObject:      _optObject,
		ObjectArray:    _objectArray,
		OptObjectArray: _optObjectArray,
	}
}

func SerializeOptionalEnvMethodResult(value *types.AnotherType) []byte {
	ctx := msgpack.NewContext("Serializing module-type: OptionalEnvMethod")
	encoder := msgpack.NewWriteEncoder(ctx)
	WriteOptionalEnvMethodResult(encoder, value);
	return encoder.Buffer()
}

func WriteOptionalEnvMethodResult(writer msgpack.Write, value *types.AnotherType) {
	writer.Context().Push("optionalEnvMethod", "*AnotherType", "writing property")
	{
		v := value
		types.AnotherTypeWrite(writer, v)
	}
	writer.Context().Pop()
}

func DeserializeIfArgs(argsBuf []byte) *types.ArgsIf {
	ctx := msgpack.NewContext("Deserializing module-type: If")
	reader := msgpack.NewReadDecoder(ctx, argsBuf)

	var (
		_if    Else
		_ifSet bool
	)

	for i := int32(reader.ReadMapLength()); i > 0; i-- {
		field := reader.ReadString()
		reader.Context().Push(field, "unknown", "searching for property type")
		reader.Context().Pop()
		switch field {
		case "M_if":
			reader.Context().Push(field, "Else", "type found, reading property")
			if v := ElseRead(reader); v != nil {
				_if = *v
			}
			_ifSet = true
			reader.Context().Pop()
		}
	}

	if !_ifSet {
		panic(reader.Context().PrintWithContext("Missing required property: 'if: else'"))
	}

	return &types.ArgsIf{
		M_if: _if,
	}
}

func SerializeIfResult(value types.Else) []byte {
	ctx := msgpack.NewContext("Serializing module-type: If")
	encoder := msgpack.NewWriteEncoder(ctx)
	WriteIfResult(encoder, value);
	return encoder.Buffer()
}

func WriteIfResult(writer msgpack.Write, value types.Else) {
	writer.Context().Push("if", "Else", "writing property")
	{
		v := value
		types.ElseWrite(writer, &v)
	}
	writer.Context().Pop()
}
