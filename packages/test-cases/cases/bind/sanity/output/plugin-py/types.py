# NOTE: This is an auto-generated file. All modifications will be overwritten.
from __future__ import annotations

from typing import TypedDict, Optional
from enum import IntEnum, auto

from polywrap_core import InvokerClient, Uri, UriPackageOrWrapper

### Env START ###
class Env(TypedDict):
    prop: str
    opt_prop: Optional[str]
    opt_map: Optional[GenericMap[str, Optional[int]]]
### Env END ###

### Objects START ###
class CustomType(TypedDict):
    p_str: str
    opt_str: Optional[str]
    u: int
    opt_u: Optional[int]
    u8: int
    u16: int
    u32: int
    i: int
    i8: int
    i16: int
    i32: int
    bigint: str
    opt_bigint: Optional[str]
    bignumber: str
    opt_bignumber: Optional[str]
    json: str
    opt_json: Optional[str]
    p_bytes: bytes
    opt_bytes: Optional[bytes]
    boolean: bool
    opt_boolean: Optional[bool]
    u_array: list[int]
    u_opt_array: Optional[list[int]]
    opt_u_opt_array: Optional[list[Optional[int]]]
    opt_str_opt_array: Optional[list[Optional[str]]]
    u_array_array: list[list[int]]
    u_opt_array_opt_array: list[Optional[list[Optional[int]]]]
    u_array_opt_array_array: list[Optional[list[list[int]]]]
    crazy_array: Optional[list[Optional[list[list[Optional[list[int]]]]]]]
    p_object: "AnotherType"
    opt_object: Optional["AnotherType"]
    object_array: list["AnotherType"]
    opt_object_array: Optional[list[Optional["AnotherType"]]]
    en: "CustomEnum"
    opt_enum: Optional["CustomEnum"]
    enum_array: list["CustomEnum"]
    opt_enum_array: Optional[list[Optional["CustomEnum"]]]
    p_map: GenericMap[str, int]
    map_of_arr: GenericMap[str, list[int]]
    map_of_obj: GenericMap[str, "AnotherType"]
    map_of_arr_of_obj: GenericMap[str, list["AnotherType"]]
    map_custom_value: GenericMap[str, Optional["CustomMapValue"]]

class AnotherType(TypedDict):
    prop: Optional[str]
    circular: Optional["CustomType"]
    const: Optional[str]

class CustomMapValue(TypedDict):
    foo: str

class Else(TypedDict):
    p_else: str

### Objects END ###

### Enums START ###
class CustomEnum(IntEnum):
    STRING = auto() - 1
    BYTES = auto() - 1

class While(IntEnum):
    p_for = auto() - 1
    p_in = auto() - 1

### Enums END ###

### Imported Objects START ###

# URI: "testimport.uri.eth" #
class TestImportObject(TypedDict):
    p_object: "TestImportAnotherObject"
    opt_object: Optional["TestImportAnotherObject"]
    object_array: list["TestImportAnotherObject"]
    opt_object_array: Optional[list[Optional["TestImportAnotherObject"]]]
    en: "TestImportEnum"
    opt_enum: Optional["TestImportEnum"]
    enum_array: list["TestImportEnum"]
    opt_enum_array: Optional[list[Optional["TestImportEnum"]]]

# URI: "testimport.uri.eth" #
class TestImportAnotherObject(TypedDict):
    prop: str

### Imported Objects END ###

### Imported Enums START ###

# URI: "testimport.uri.eth" #
class TestImportEnum(IntEnum):
    STRING = auto() - 1
    BYTES = auto() - 1

# URI: "testimport.uri.eth" #
class TestImportEnumReturn(IntEnum):
    STRING = auto() - 1
    BYTES = auto() - 1


### Imported Enums END ###

### Imported Modules START ###

# URI: "testimport.uri.eth" #
class TestImportModuleArgsImportedMethod(TypedDict):
    p_str: str
    opt_str: Optional[str]
    u: int
    opt_u: Optional[int]
    u_array_array: list[Optional[list[Optional[int]]]]
    p_object: "TestImportObject"
    opt_object: Optional["TestImportObject"]
    object_array: list["TestImportObject"]
    opt_object_array: Optional[list[Optional["TestImportObject"]]]
    en: "TestImportEnum"
    opt_enum: Optional["TestImportEnum"]
    enum_array: list["TestImportEnum"]
    opt_enum_array: Optional[list[Optional["TestImportEnum"]]]

# URI: "testimport.uri.eth" #
class TestImportModuleArgsAnotherMethod(TypedDict):
    arg: list[str]

# URI: "testimport.uri.eth" #
class TestImportModuleArgsReturnsArrayOfEnums(TypedDict):
    arg: str

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
