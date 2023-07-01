/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

package test.wrap

import io.polywrap.core.Invoker
import io.polywrap.core.InvokeResult
import io.polywrap.core.resolution.Uri
import io.polywrap.core.msgpack.MsgPackMap
import kotlinx.serialization.Serializable

typealias BigInt = String
typealias BigNumber = String
typealias Json = String

/// Env START ///
@Serializable
data class Env(
    val prop: String,
    val optProp: String? = null,
    val optMap: MsgPackMap<String, Int?>? = null,
)
/// Env END ///

/// Objects START ///
@Serializable
data class CustomType(
    val str: String,
    val optStr: String? = null,
    val u: UInt,
    val optU: UInt? = null,
    val u8: UByte,
    val u16: UShort,
    val u32: UInt,
    val i: Int,
    val i8: Byte,
    val i16: Short,
    val i32: Int,
    val bigint: BigInt,
    val optBigint: BigInt? = null,
    val bignumber: BigNumber,
    val optBignumber: BigNumber? = null,
    val json: Json,
    val optJson: Json? = null,
    val bytes: ByteArray,
    val optBytes: ByteArray? = null,
    val boolean: Boolean,
    val optBoolean: Boolean? = null,
    val u_array: List<UInt>,
    val uOpt_array: List<UInt>? = null,
    val _opt_uOptArray: List<UInt?>? = null,
    val optStrOptArray: List<String?>? = null,
    val uArrayArray: List<List<UInt>>,
    val uOptArrayOptArray: List<List<UInt?>?>,
    val uArrayOptArrayArray: List<List<List<UInt>>?>,
    val crazyArray: List<List<List<List<UInt>?>>?>? = null,
    val _object: AnotherType,
    val optObject: AnotherType? = null,
    val objectArray: List<AnotherType>,
    val optObjectArray: List<AnotherType?>? = null,
    val en: CustomEnum,
    val optEnum: CustomEnum? = null,
    val enumArray: List<CustomEnum>,
    val optEnumArray: List<CustomEnum?>? = null,
    val map: MsgPackMap<String, Int>,
    val mapOfArr: MsgPackMap<String, List<Int>>,
    val mapOfObj: MsgPackMap<String, AnotherType>,
    val mapOfArrOfObj: MsgPackMap<String, List<AnotherType>>,
    val mapCustomValue: MsgPackMap<String, CustomMapValue?>,
)

@Serializable
data class AnotherType(
    val prop: String? = null,
    val circular: CustomType? = null,
    val const: String? = null,
)

@Serializable
data class CustomMapValue(
    val foo: String,
)

@Serializable
data class Else(
    val _else: String,
)

/// Objects END ///

/// Enums START ///
@Serializable
enum class CustomEnum {
    STRING,
    BYTES
}

@Serializable
enum class While {
    _for,
    _in
}

/// Enums END ///

/// Imported Objects START ///
/* URI: "testimport.uri.eth" */
@Serializable
data class TestImportObject(
    val _object: TestImportAnotherObject,
    val optObject: TestImportAnotherObject? = null,
    val objectArray: List<TestImportAnotherObject>,
    val optObjectArray: List<TestImportAnotherObject?>? = null,
    val en: TestImportEnum,
    val optEnum: TestImportEnum? = null,
    val enumArray: List<TestImportEnum>,
    val optEnumArray: List<TestImportEnum?>? = null,
)

/* URI: "testimport.uri.eth" */
@Serializable
data class TestImportAnotherObject(
    val prop: String,
)

/* URI: "testimport.uri.eth" */
@Serializable
enum class TestImportEnum {
    STRING,
    BYTES
}

/* URI: "testimport.uri.eth" */
@Serializable
enum class TestImportEnumReturn {
    STRING,
    BYTES
}

/// Imported Objects END ///

/// Imported Modules START ///
/* URI: "testimport.uri.eth" */
@Serializable
data class TestImportModuleArgsImportedMethod(
    val str: String,
    val optStr: String? = null,
    val u: UInt,
    val optU: UInt? = null,
    val uArrayArray: List<List<UInt?>?>,
    val _object: TestImportObject,
    val optObject: TestImportObject? = null,
    val objectArray: List<TestImportObject>,
    val optObjectArray: List<TestImportObject?>? = null,
    val en: TestImportEnum,
    val optEnum: TestImportEnum? = null,
    val enumArray: List<TestImportEnum>,
    val optEnumArray: List<TestImportEnum?>? = null,
)

/* URI: "testimport.uri.eth" */
@Serializable
data class TestImportModuleArgsAnotherMethod(
    val arg: List<String>,
)

/* URI: "testimport.uri.eth" */
@Serializable
data class TestImportModuleArgsReturnsArrayOfEnums(
    val arg: String,
)

/* URI: "testimport.uri.eth" */
class TestImportModule(uri: String) {
    companion object {
        val interfaceUri: String = "testimport.uri.eth"
    }

    val uri: Uri = Uri(uri)

    suspend fun importedMethod(
        args: TestImportModuleArgsImportedMethod,
        invoker: Invoker
    ): InvokeResult<TestImportObject?> {
        return invoker.invoke(
            uri = this.uri,
            method = "importedMethod",
            args = args
        );
    }

    suspend fun anotherMethod(
        args: TestImportModuleArgsAnotherMethod,
        invoker: Invoker
    ): InvokeResult<Int> {
        return invoker.invoke(
            uri = this.uri,
            method = "anotherMethod",
            args = args
        );
    }

    suspend fun returnsArrayOfEnums(
        args: TestImportModuleArgsReturnsArrayOfEnums,
        invoker: Invoker
    ): InvokeResult<List<TestImportEnumReturn?>> {
        return invoker.invoke(
            uri = this.uri,
            method = "returnsArrayOfEnums",
            args = args
        );
    }
}

/// Imported Modules END ///

object TestImport {
    val uri: Uri = Uri("testimport.uri.eth");

    suspend fun getImplementations(invoker: Invoker): Result<List<Uri>> {
        return invoker.getImplementations(this.uri)
    }
}
