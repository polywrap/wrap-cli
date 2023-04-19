# NOTE: This is an auto-generated file. All modifications will be overwritten.
# type: ignore
from __future__ import annotations

from typing import TypedDict, Optional
from enum import IntEnum, auto

from polywrap_core import InvokerClient, Uri, UriPackageOrWrapper
from polywrap_msgpack import GenericMap


### Env START ###

Env = TypedDict("Env", {
    "prop": str,
    "optProp": Optional[str],
    "optMap": Optional[GenericMap[str, Optional[int]]],
})

### Env END ###

### Objects START ###

CustomType = TypedDict("CustomType", {
    "str": str,
    "optStr": Optional[str],
    "u": int,
    "optU": Optional[int],
    "u8": int,
    "u16": int,
    "u32": int,
    "i": int,
    "i8": int,
    "i16": int,
    "i32": int,
    "bigint": str,
    "optBigint": Optional[str],
    "bignumber": str,
    "optBignumber": Optional[str],
    "json": str,
    "optJson": Optional[str],
    "bytes": bytes,
    "optBytes": Optional[bytes],
    "boolean": bool,
    "optBoolean": Optional[bool],
    "u_array": list[int],
    "uOpt_array": Optional[list[int]],
    "_opt_uOptArray": Optional[list[Optional[int]]],
    "optStrOptArray": Optional[list[Optional[str]]],
    "uArrayArray": list[list[int]],
    "uOptArrayOptArray": list[Optional[list[Optional[int]]]],
    "uArrayOptArrayArray": list[Optional[list[list[int]]]],
    "crazyArray": Optional[list[Optional[list[list[Optional[list[int]]]]]]],
    "object": "AnotherType",
    "optObject": Optional["AnotherType"],
    "objectArray": list["AnotherType"],
    "optObjectArray": Optional[list[Optional["AnotherType"]]],
    "en": "CustomEnum",
    "optEnum": Optional["CustomEnum"],
    "enumArray": list["CustomEnum"],
    "optEnumArray": Optional[list[Optional["CustomEnum"]]],
    "map": GenericMap[str, int],
    "mapOfArr": GenericMap[str, list[int]],
    "mapOfObj": GenericMap[str, "AnotherType"],
    "mapOfArrOfObj": GenericMap[str, list["AnotherType"]],
    "mapCustomValue": GenericMap[str, Optional["CustomMapValue"]],
})

AnotherType = TypedDict("AnotherType", {
    "prop": Optional[str],
    "circular": Optional["CustomType"],
    "const": Optional[str],
})

CustomMapValue = TypedDict("CustomMapValue", {
    "foo": str,
})

Else = TypedDict("Else", {
    "else": str,
})

### Objects END ###

### Enums START ###
class CustomEnum(IntEnum):
    STRING = auto(), "STRING"
    BYTES = auto(), "BYTES"

    def __new__(cls, value: int, *aliases: str):
        obj = int.__new__(cls)
        obj._value_ = value - 1
        for alias in aliases:
            cls._value2member_map_[alias] = obj
        return obj

class While(IntEnum):
    r_for = auto(), "for"
    r_in = auto(), "in"

    def __new__(cls, value: int, *aliases: str):
        obj = int.__new__(cls)
        obj._value_ = value - 1
        for alias in aliases:
            cls._value2member_map_[alias] = obj
        return obj

### Enums END ###

### Imported Objects START ###

# URI: "testimport.uri.eth" #
TestImportObject = TypedDict("TestImportObject", {
    "object": "TestImportAnotherObject",
    "optObject": Optional["TestImportAnotherObject"],
    "objectArray": list["TestImportAnotherObject"],
    "optObjectArray": Optional[list[Optional["TestImportAnotherObject"]]],
    "en": "TestImportEnum",
    "optEnum": Optional["TestImportEnum"],
    "enumArray": list["TestImportEnum"],
    "optEnumArray": Optional[list[Optional["TestImportEnum"]]],
})

# URI: "testimport.uri.eth" #
TestImportAnotherObject = TypedDict("TestImportAnotherObject", {
    "prop": str,
})

### Imported Objects END ###

### Imported Enums START ###

# URI: "testimport.uri.eth" #
class TestImportEnum(IntEnum):
    STRING = auto()
    BYTES = auto()

    def __new__(cls, value: int, *aliases: str):
        obj = int.__new__(cls)
        obj._value_ = value - 1
        for alias in aliases:
            cls._value2member_map_[alias] = obj
        return obj

# URI: "testimport.uri.eth" #
class TestImportEnumReturn(IntEnum):
    STRING = auto()
    BYTES = auto()

    def __new__(cls, value: int, *aliases: str):
        obj = int.__new__(cls)
        obj._value_ = value - 1
        for alias in aliases:
            cls._value2member_map_[alias] = obj
        return obj


### Imported Enums END ###

### Imported Modules START ###

# URI: "testimport.uri.eth" #
TestImportModuleArgsImportedMethod = TypedDict("TestImportModuleArgsImportedMethod", {
    "str": str,
    "optStr": Optional[str],
    "u": int,
    "optU": Optional[int],
    "uArrayArray": list[Optional[list[Optional[int]]]],
    "object": "TestImportObject",
    "optObject": Optional["TestImportObject"],
    "objectArray": list["TestImportObject"],
    "optObjectArray": Optional[list[Optional["TestImportObject"]]],
    "en": "TestImportEnum",
    "optEnum": Optional["TestImportEnum"],
    "enumArray": list["TestImportEnum"],
    "optEnumArray": Optional[list[Optional["TestImportEnum"]]],
})

# URI: "testimport.uri.eth" #
TestImportModuleArgsAnotherMethod = TypedDict("TestImportModuleArgsAnotherMethod", {
    "arg": list[str],
})

# URI: "testimport.uri.eth" #
TestImportModuleArgsReturnsArrayOfEnums = TypedDict("TestImportModuleArgsReturnsArrayOfEnums", {
    "arg": str,
})

# URI: "testimport.uri.eth" #
class TestImportModule:
    INTERFACE_URI: Uri = Uri.from_str("testimport.uri.eth")
    uri: Uri

    def __init__(self, uri: Uri):
        self.uri = uri

    async def imported_method(
        self,
        args: TestImportModuleArgsImportedMethod,
        client: InvokerClient[UriPackageOrWrapper]
    ) -> Optional["TestImportObject"]:
        return client.invoke(
            InvokeOptions(
                uri=self.uri,
                method="importedMethod",
                args=args,
            )
        )

    async def another_method(
        self,
        args: TestImportModuleArgsAnotherMethod,
        client: InvokerClient[UriPackageOrWrapper]
    ) -> int:
        return client.invoke(
            InvokeOptions(
                uri=self.uri,
                method="anotherMethod",
                args=args,
            )
        )

    async def returns_array_of_enums(
        self,
        args: TestImportModuleArgsReturnsArrayOfEnums,
        client: InvokerClient[UriPackageOrWrapper]
    ) -> list[Optional["TestImportEnumReturn"]]:
        return client.invoke(
            InvokeOptions(
                uri=self.uri,
                method="returnsArrayOfEnums",
                args=args,
            )
        )

### Imported Modules END ###

### Interface START ###


class TestImport:
    URI: Uri = Uri.from_str("testimport.uri.eth")

    def get_implementations(
        client: InvokerClient[UriPackageOrWrapper]
    ) -> list[str]:
        impls = client.getImplementations(self.uri)
        return [impl.uri for impl in impls]

### Interface END ###
