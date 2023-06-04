/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

import io.polywrap.core.Invoker
import io.polywrap.core.InvokeResult
import io.polywrap.core.resolution.Uri
import io.polywrap.msgpack.msgPackDecode
import io.polywrap.msgpack.msgPackEncode
import io.polywrap.plugin.PluginMethod
import io.polywrap.plugin.PluginModule
import kotlinx.serialization.Serializable
import kotlinx.serialization.serializer

typealias BigInt = String
typealias BigNumber = String
typealias Json = String

/// Env START ///
@Serializable
data class Env(
    val prop: String,
    val optProp: String? = null,
    val optMap: Map<String, Int?>? = null,
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
    val u_array: Array<UInt>,
    val uOpt_array: Array<UInt>? = null,
    val _opt_uOptArray: Array<UInt?>? = null,
    val optStrOptArray: Array<String?>? = null,
    val uArrayArray: Array<Array<UInt>>,
    val uOptArrayOptArray: Array<Array<UInt?>?>,
    val uArrayOptArrayArray: Array<Array<Array<UInt>>?>,
    val crazyArray: Array<Array<Array<Array<UInt>?>>?>? = null,
    val _object: AnotherType,
    val optObject: AnotherType? = null,
    val objectArray: Array<AnotherType>,
    val optObjectArray: Array<AnotherType?>? = null,
    val en: CustomEnum,
    val optEnum: CustomEnum? = null,
    val enumArray: Array<CustomEnum>,
    val optEnumArray: Array<CustomEnum?>? = null,
    val map: Map<String, Int>,
    val mapOfArr: Map<String, Array<Int>>,
    val mapOfObj: Map<String, AnotherType>,
    val mapOfArrOfObj: Map<String, Array<AnotherType>>,
    val mapCustomValue: Map<String, CustomMapValue?>,
)

@Serializable
data class AnotherType(
    val prop: String? = null,
    val circular: CustomType? = null,
    val _const: String? = null,
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
    BYTES,
}

@Serializable
enum class While {
    _for,
    _in,
}

/// Enums END ///

/// Imported Objects START ///
/* URI: "testimport.uri.eth" */
@Serializable
data class TestImportObject(
    val _object: TestImportAnotherObject,
    val optObject: TestImportAnotherObject? = null,
    val objectArray: Array<TestImportAnotherObject>,
    val optObjectArray: Array<TestImportAnotherObject?>? = null,
    val en: TestImportEnum,
    val optEnum: TestImportEnum? = null,
    val enumArray: Array<TestImportEnum>,
    val optEnumArray: Array<TestImportEnum?>? = null,
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
    BYTES,
}

/* URI: "testimport.uri.eth" */
@Serializable
enum class TestImportEnumReturn {
    STRING,
    BYTES,
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
    val uArrayArray: Array<Array<UInt?>?>,
    val _object: TestImportObject,
    val optObject: TestImportObject? = null,
    val objectArray: Array<TestImportObject>,
    val optObjectArray: Array<TestImportObject?>? = null,
    val en: TestImportEnum,
    val optEnum: TestImportEnum? = null,
    val enumArray: Array<TestImportEnum>,
    val optEnumArray: Array<TestImportEnum?>? = null,
)

/* URI: "testimport.uri.eth" */
@Serializable
data class TestImportModuleArgsAnotherMethod(
    val arg: Array<String>,
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

    val uri: Uri = Uri.fromString(uri)

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
    ): InvokeResult<Array<TestImportEnumReturn?>> {
        return invoker.invoke(
            uri = this.uri,
            method = "returnsArrayOfEnums",
            args = args
        );
    }
}

/// Imported Modules END ///

object TestImport {
    val uri: Uri = Uri.fromString("testimport.uri.eth");

    suspend fun getImplementations(invoker: Invoker): List<String> {
        val implementations = invoker.getImplementations(this.uri)
        val uriStrings = implementations.map { it.toStringUri() }
        implementations.forEach { it.close() }
        return uriStrings
    }
}
