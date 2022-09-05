package test_import

import (
	"github.com/consideritdone/polywrap-go/polywrap/msgpack"
)

func serializeTestImport_Object(value *TestImport_Object) []byte {
	ctx := msgpack.NewContext("Serializing (encoding) env-type: TestImport_Object")
	encoder := msgpack.NewWriteEncoder(ctx)
	writeTestImport_Object(encoder, value)
	return encoder.Buffer()
}

func writeTestImport_Object(writer msgpack.Write, value *TestImport_Object) {
	writer.WriteMapLength(8)
	writer.Context().Push("Object", "TestImport_AnotherObject", "writing property")
	writer.WriteString("Object")
	{
		v := value.Object
		TestImport_AnotherObjectWrite(writer, &v)
	}
	writer.Context().Pop()
	writer.Context().Push("OptObject", "*TestImport_AnotherObject", "writing property")
	writer.WriteString("OptObject")
	{
		v := value.OptObject
		TestImport_AnotherObjectWrite(writer, v)
	}
	writer.Context().Pop()
	writer.Context().Push("ObjectArray", "[]TestImport_AnotherObject", "writing property")
	writer.WriteString("ObjectArray")
	if value.ObjectArray == nil {
		writer.WriteNil()
	} else if len(value.ObjectArray) == 0 {
		writer.WriteNil()
	} else {
		for i0 := range value.ObjectArray {
			{
				v := value.ObjectArray[i0]
				TestImport_AnotherObjectWrite(writer, &v)
			}
		}
	}
	writer.Context().Pop()
	writer.Context().Push("OptObjectArray", "[]*TestImport_AnotherObject", "writing property")
	writer.WriteString("OptObjectArray")
	if value.OptObjectArray == nil {
		writer.WriteNil()
	} else if len(value.OptObjectArray) == 0 {
		writer.WriteNil()
	} else {
		for i0 := range value.OptObjectArray {
			{
				v := value.OptObjectArray[i0]
				TestImport_AnotherObjectWrite(writer, v)
			}
		}
	}
	writer.Context().Pop()
	writer.Context().Push("En", "TestImport_Enum", "writing property")
	writer.WriteString("En")
	{
		v := value.En
		writer.WriteI32(int32(v))
	}
	writer.Context().Pop()
	writer.Context().Push("OptEnum", "*TestImport_Enum", "writing property")
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
	writer.Context().Push("EnumArray", "[]TestImport_Enum", "writing property")
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
	writer.Context().Push("OptEnumArray", "[]*TestImport_Enum", "writing property")
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
}

func deserializeTestImport_Object(data []byte) *TestImport_Object {
	ctx := msgpack.NewContext("Deserializing (decoding) env-type: TestImport_Object")
	reader := msgpack.NewReadDecoder(ctx, data)
	return readTestImport_Object(reader)
}

func readTestImport_Object(reader msgpack.Read) *TestImport_Object {
	var (
		_object         TestImport_AnotherObject
		_objectSet      bool
		_optObject      *TestImport_AnotherObject
		_objectArray    []TestImport_AnotherObject
		_objectArraySet bool
		_optObjectArray []*TestImport_AnotherObject
		_en             TestImport_Enum
		_enSet          bool
		_optEnum        *TestImport_Enum
		_enumArray      []TestImport_Enum
		_enumArraySet   bool
		_optEnumArray   []*TestImport_Enum
	)

	for i := int32(reader.ReadMapLength()); i > 0; i-- {
		field := reader.ReadString()
		reader.Context().Push(field, "unknown", "searching for property type")
		switch field {
		case "Object":
			reader.Context().Push(field, "TestImport_AnotherObject", "type found, reading property")
			if v := TestImport_AnotherObjectRead(reader); v != nil {
				_object = *v
			}
			_objectSet = true
			reader.Context().Pop()
		case "OptObject":
			reader.Context().Push(field, "*TestImport_AnotherObject", "type found, reading property")
			if v := TestImport_AnotherObjectRead(reader); v != nil {
				_optObject = v
			}
			reader.Context().Pop()
		case "ObjectArray":
			reader.Context().Push(field, "[]TestImport_AnotherObject", "type found, reading property")
			if reader.IsNil() {
				_objectArray = nil
			} else {
				ln0 := reader.ReadArrayLength()
				_objectArray = make([]TestImport_AnotherObject, ln0)
				for i0 := uint32(0); i0 < ln0; i0++ {
					if v := TestImport_AnotherObjectRead(reader); v != nil {
						_objectArray[i0] = *v
					}
				}
			}
			_objectArraySet = true
			reader.Context().Pop()
		case "OptObjectArray":
			reader.Context().Push(field, "[]*TestImport_AnotherObject", "type found, reading property")
			if reader.IsNil() {
				_optObjectArray = nil
			} else {
				ln0 := reader.ReadArrayLength()
				_optObjectArray = make([]*TestImport_AnotherObject, ln0)
				for i0 := uint32(0); i0 < ln0; i0++ {
					if v := TestImport_AnotherObjectRead(reader); v != nil {
						_optObjectArray[i0] = v
					}
				}
			}
			reader.Context().Pop()
		case "En":
			reader.Context().Push(field, "TestImport_Enum", "type found, reading property")
			_en = TestImport_Enum(reader.ReadI32())
			SanitizeTestImport_EnumValue(int32(_en))
			_enSet = true
			reader.Context().Pop()
		case "OptEnum":
			reader.Context().Push(field, "*TestImport_Enum", "type found, reading property")
			if !reader.IsNil() {
				v := TestImport_Enum(reader.ReadI32())
				SanitizeTestImport_EnumValue(int32(v))
				_optEnum = &v
			}
			reader.Context().Pop()
		case "EnumArray":
			reader.Context().Push(field, "[]TestImport_Enum", "type found, reading property")
			if reader.IsNil() {
				_enumArray = nil
			} else {
				ln0 := reader.ReadArrayLength()
				_enumArray = make([]TestImport_Enum, ln0)
				for i0 := uint32(0); i0 < ln0; i0++ {
					_enumArray[i0] = TestImport_Enum(reader.ReadI32())
					SanitizeTestImport_EnumValue(int32(_enumArray[i0]))
				}
			}
			_enumArraySet = true
			reader.Context().Pop()
		case "OptEnumArray":
			reader.Context().Push(field, "[]*TestImport_Enum", "type found, reading property")
			if reader.IsNil() {
				_optEnumArray = nil
			} else {
				ln0 := reader.ReadArrayLength()
				_optEnumArray = make([]*TestImport_Enum, ln0)
				for i0 := uint32(0); i0 < ln0; i0++ {
					if !reader.IsNil() {
						v := TestImport_Enum(reader.ReadI32())
						SanitizeTestImport_EnumValue(int32(v))
						_optEnumArray[i0] = &v
					}
				}
			}
			reader.Context().Pop()
		}
		reader.Context().Pop()
	}

	if !_objectSet {
		panic(reader.Context().PrintWithContext("Missing required property: 'object: TestImport_AnotherObject'"))
	}
	if !_objectArraySet {
		panic(reader.Context().PrintWithContext("Missing required property: 'objectArray: [TestImport_AnotherObject]'"))
	}
	if !_enSet {
		panic(reader.Context().PrintWithContext("Missing required property: 'en: TestImport_Enum'"))
	}
	if !_enumArraySet {
		panic(reader.Context().PrintWithContext("Missing required property: 'enumArray: [TestImport_Enum]'"))
	}

	return &TestImport_Object{
		Object:         _object,
		OptObject:      _optObject,
		ObjectArray:    _objectArray,
		OptObjectArray: _optObjectArray,
		En:             _en,
		OptEnum:        _optEnum,
		EnumArray:      _enumArray,
		OptEnumArray:   _optEnumArray,
	}
}
