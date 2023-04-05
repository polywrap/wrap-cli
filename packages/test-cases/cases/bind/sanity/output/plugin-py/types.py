### NOTE: This is an auto-generated file.
###       All modifications will be overwritten.

from typing import TypedDict, Optional
from enum import Enum

from polywrap_core import InvokerClient, Uri, UriPackageOrWrapper
from polywrap_msgpack import GenericMap

### Env START ###
class Env(TypedDict):
    prop: str
    optProp: str | None
    optMap: Optional[GenericMap[str, Optional[int]]]
### Env END ###

### Objects START ###
class CustomType(TypedDict):
    str: str
    opt_str: Optional[str]
    u: Types.UInt
    optU: Optional[Union[Types.UInt, None]]
    u8: Types.UInt8
    u16: Types.UInt16
    u32: Types.UInt32
    i: Types.Int
    i8: Types.Int8
    i16: Types.Int16
    i32: Types.Int32
    bigint: Types.BigInt
    optBigint: Optional[Union[Types.BigInt, None]]
    bignumber: Types.BigNumber
    optBignumber: Optional[Union[Types.BigNumber, None]]
    json: types.Json
    optJson: Optional[Union[types.Json, None]]
    bytes: Types.Bytes
    optBytes: Optional[Union[Types.Bytes, None]]
    boolean: Types.Boolean
    optBoolean: Optional[Union[Types.Boolean, None]]
    uArray: List[Types.UInt]
    uOptArray: Optional[Union[List[Types.UInt], None]]
    optUOptArray: Optional[Union[List[Union[Types.UInt, None]], None]]
    optStrOptArray: Optional[Union[List[Union[Types.String, None]], None]]
    uArrayArray: List[List[Types.UInt]]
    uOptArrayOptArray: List[Union[List[Union[Types.UInt32, None]], None]]
    uArrayOptArrayArray: List[Union[List[List[Types.UInt32]], None]]
    crazyArray: Optional[Union[List[Union[List[List[Union[List[Types.UInt32], None]]], None]], None]]
    object: Types.AnotherType
    optObject: Optional[Union[Types.AnotherType, None]]
    objectArray: List[Types.AnotherType]
    optObjectArray: Optional[Union[List[Union[Types.AnotherType, None]], None]]
    en: Types.CustomEnum
    optEnum: Optional[Union[Types.CustomEnum, None]]
    enumArray: List[Types.CustomEnum]
    optEnumArray: Optional[Union[List[Union[Types.CustomEnum, None]], None]]
    map: GenericMap[Types.String, Types.Int]
    mapOfArr: GenericMap[Types.String, List[Types.Int]]
    mapOfObj: GenericMap[Types.String, Types.AnotherType]
    mapOfArrOfObj: GenericMap[Types.String, List[Types.AnotherType]]
    mapCustomValue: GenericMap[Types.String, Optional[Types.CustomMapValue]]

class AnotherType(TypedDict):
    prop: Optional[Union[Types.String, None]]
    circular: Optional[Union[Types.CustomType, None]]
    const: Optional[Union[Types.String, None]]

class CustomMapValue(TypedDict):
    foo: Types.String

class _else(TypedDict):
    else: Types.String

### Objects END ###

### Enums START ###
class CustomEnum(Enum):
    STRING,
    BYTES,

class while(Enum):
    for,
    in,

### Enums END ###

### Imported Objects START ###

/* URI: "testimport.uri.eth" */
class TestImport_Object(TypedDict):
    object: Types.TestImport_AnotherObject;
    optObject: Optional[Union[Types.TestImport_AnotherObject, None]];
    objectArray: List[Types.TestImport_AnotherObject];
    optObjectArray: Optional[Union[List[Union[Types.TestImport_AnotherObject, None]], None]];
    en: Types.TestImport_Enum;
    optEnum: Optional[Union[Types.TestImport_Enum, None]];
    enumArray: List[Types.TestImport_Enum];
    optEnumArray: Optional[Union[List[Union[Types.TestImport_Enum, None]], None]];

/* URI: "testimport.uri.eth" */
class TestImport_AnotherObject(TypedDict):
    prop: Types.String;

### Imported Objects END ###

### Imported Enums START ###

/* URI: "testimport.uri.eth" */
class TestImport_Enum(Enum):
    STRING,
    BYTES,

/* URI: "testimport.uri.eth" */
class TestImport_Enum_Return(Enum):
    STRING,
    BYTES,


### Imported Enums END ###

### Imported Modules START ###

/* URI: "testimport.uri.eth" */
class TestImport_ModuleArgsimportedMethod(TypedDict):
    str: Types.String;
    optStr?: Union[Types.String, None];
    u: Types.UInt;
    optU?: Union[Types.UInt, None];
    uArrayArray: List[Union[List[Union[Types.UInt, None]], None]];
    object: Types.TestImport_Object;
    optObject?: Union[Types.TestImport_Object, None];
    objectArray: List[Types.TestImport_Object];
    optObjectArray?: Union[List[Union[Types.TestImport_Object, None]], None];
    en: Types.TestImport_Enum;
    optEnum?: Union[Types.TestImport_Enum, None];
    enumArray: List[Types.TestImport_Enum];
    optEnumArray?: Union[List[Union[Types.TestImport_Enum, None]], None];

/* URI: "testimport.uri.eth" */
class TestImport_ModuleArgsanotherMethod(TypedDict):
    arg: List[Types.String];

/* URI: "testimport.uri.eth" */
class TestImport_ModuleArgsreturnsArrayOfEnums(TypedDict):
    arg: Types.String;

/* URI: "testimport.uri.eth" */
class TestImport_Module:
    INTERFACE_URI: Uri = Uri.from_str("testimport.uri.eth")
    uri: Uri

    def __init__(uri: Uri) {
      this.uri = uri
    }

    async def importedMethod(
      self,
      args: TestImport_ModuleArgsimportedMethod,
      client: InvokerClient[UriPackageOrWrapper]
    ): Union[Types.TestImport_Object, None]:
        return client.invoke<Union[Types.TestImport_Object, None]>(
            InvokeOptions(
                uri=self.uri,
                method="importedMethod",
                args=args,
            )
        );

    async def anotherMethod(
      self,
      args: TestImport_ModuleArgsanotherMethod,
      client: InvokerClient[UriPackageOrWrapper]
    ): Types.Int32:
        return client.invoke<Types.Int32>(
            InvokeOptions(
                uri=self.uri,
                method="anotherMethod",
                args=args,
            )
        );

    async def returnsArrayOfEnums(
      self,
      args: TestImport_ModuleArgsreturnsArrayOfEnums,
      client: InvokerClient[UriPackageOrWrapper]
    ): List[Union[Types.TestImport_Enum_Return, None]]:
        return client.invoke<List[Union[Types.TestImport_Enum_Return, None]]>(
            InvokeOptions(
                uri=self.uri,
                method="returnsArrayOfEnums",
                args=args,
            )
        );

### Imported Modules END ###

### Interface START ###


class TestImport:
    URI: Uri = Uri.from_str("testimport.uri.eth")

    async def get_implementations(
      client: InvokerClient[UriPackageOrWrapper]
    ): string[] {
        impls = await client.getImplementations(self.uri)
        return [impl.uri for impl in impls]
    }

### Interface END ###
