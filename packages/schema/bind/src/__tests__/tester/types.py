### NOTE: This is an auto-generated file.
###       All modifications will be overwritten.

from typing import TypedDict, Optional
from enum import Enum, auto

from polywrap_core import InvokerClient, Uri, UriPackageOrWrapper

### Env START ###
class Env(TypedDict):
    prop: str
    opt_prop: str | None
    opt_map: GenericMap[str, int | None] | None
### Env END ###

### Objects START ###
class CustomType(TypedDict):
    p_str: str
    opt_str: str | None
    u: int
    opt_u: int | None
    u8: int
    u16: int
    u32: int
    i: int
    i8: int
    i16: int
    i32: int
    bigint: str
    opt_bigint: str | None
    bignumber: str
    opt_bignumber: str | None
    json: str
    opt_json: str | None
    p_bytes: bytes
    opt_bytes: bytes | None
    boolean: bool
    opt_boolean: bool | None
    u_array: list[int]
    u_opt_array: list[int] | None
    opt_u_opt_array: list[int | None] | None
    opt_str_opt_array: list[str | None] | None
    u_array_array: list[list[int]]
    u_opt_array_opt_array: list[list[int | None] | None]
    u_array_opt_array_array: list[list[list[int]] | None]
    crazy_array: list[list[list[list[int] | None]] | None] | None
    p_object: AnotherType
    opt_object: AnotherType | None
    object_array: list[AnotherType]
    opt_object_array: list[AnotherType | None] | None
    en: CustomEnum
    opt_enum: CustomEnum | None
    enum_array: list[CustomEnum]
    opt_enum_array: list[CustomEnum | None] | None
    p_map: GenericMap[str, int]
    map_of_arr: GenericMap[str, list[int]]
    map_of_obj: GenericMap[str, AnotherType]
    map_of_arr_of_obj: GenericMap[str, list[AnotherType]]
    map_custom_value: GenericMap[str, CustomMapValue | None]

class AnotherType(TypedDict):
    prop: str | None
    circular: CustomType | None
    const: str | None

class CustomMapValue(TypedDict):
    foo: str

class Else(TypedDict):
    p_else: str

### Objects END ###

### Enums START ###
class CustomEnum(Enum):
    STRING = auto()
    BYTES = auto()

class While(Enum):
    p_for = auto()
    p_in = auto()

### Enums END ###

### Imported Objects START ###

# URI: "testimport.uri.eth" #
class TestImportObject(TypedDict):
    p_object: TestImportAnotherObject
    opt_object: TestImportAnotherObject | None
    object_array: list[TestImportAnotherObject]
    opt_object_array: list[TestImportAnotherObject | None] | None
    en: TestImportEnum
    opt_enum: TestImportEnum | None
    enum_array: list[TestImportEnum]
    opt_enum_array: list[TestImportEnum | None] | None

# URI: "testimport.uri.eth" #
class TestImportAnotherObject(TypedDict):
    prop: str

### Imported Objects END ###

### Imported Enums START ###

# URI: "testimport.uri.eth" #
class TestImportEnum(Enum):
    STRING = auto()
    BYTES = auto()

# URI: "testimport.uri.eth" #
class TestImportEnumReturn(Enum):
    STRING = auto()
    BYTES = auto()


### Imported Enums END ###

### Imported Modules START ###

# URI: "testimport.uri.eth" #
class TestImportModuleArgsImportedMethod(TypedDict):
    p_str: str
    opt_str: str | None
    u: int
    opt_u: int | None
    u_array_array: list[list[int | None] | None]
    p_object: TestImportObject
    opt_object: TestImportObject | None
    object_array: list[TestImportObject]
    opt_object_array: list[TestImportObject | None] | None
    en: TestImportEnum
    opt_enum: TestImportEnum | None
    enum_array: list[TestImportEnum]
    opt_enum_array: list[TestImportEnum | None] | None

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
    ) -> TestImportObject | None:
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
    ) -> list[TestImportEnumReturn | None]:
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
