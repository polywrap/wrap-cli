/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

package pluginTest.wrap

import io.polywrap.core.Invoker
import io.polywrap.core.msgpack.msgPackDecode
import io.polywrap.core.msgpack.msgPackEncode
import io.polywrap.core.msgpack.MsgPackMap
import io.polywrap.plugin.PluginMethod
import io.polywrap.plugin.PluginModule
import kotlinx.serialization.Serializable
import kotlinx.serialization.serializer

@Serializable
data class ArgsModuleMethod(
    val str: String,
    val optStr: String? = null,
    val en: CustomEnum,
    val optEnum: CustomEnum? = null,
    val enumArray: List<CustomEnum>,
    val optEnumArray: List<CustomEnum?>? = null,
    val map: MsgPackMap<String, Int>,
    val mapOfArr: MsgPackMap<String, List<Int>>,
    val mapOfMap: MsgPackMap<String, MsgPackMap<String, Int>>,
    val mapOfObj: MsgPackMap<String, AnotherType>,
    val mapOfArrOfObj: MsgPackMap<String, List<AnotherType>>,
)

@Serializable
data class ArgsObjectMethod(
    val _object: AnotherType,
    val optObject: AnotherType? = null,
    val objectArray: List<AnotherType>,
    val optObjectArray: List<AnotherType?>? = null,
)

@Serializable
data class ArgsOptionalEnvMethod(
    val _object: AnotherType,
    val optObject: AnotherType? = null,
    val objectArray: List<AnotherType>,
    val optObjectArray: List<AnotherType?>? = null,
)

@Serializable
data class ArgsIf(
    val _if: Else,
)

@Suppress("UNUSED_PARAMETER", "FunctionName")
abstract class Module<TConfig>(config: TConfig) : PluginModule<TConfig>(config) {

  final override val methods: Map<String, PluginMethod> = mapOf(
      "moduleMethod" to ::__moduleMethod,
      "objectMethod" to ::__objectMethod,
      "optionalEnvMethod" to ::__optionalEnvMethod,
      "if" to ::__if,
  )

  abstract suspend fun moduleMethod(
      args: ArgsModuleMethod,
      invoker: Invoker
  ): Int

  abstract suspend fun objectMethod(
      args: ArgsObjectMethod,
      env: Env,
      invoker: Invoker
  ): AnotherType?

  abstract suspend fun optionalEnvMethod(
      args: ArgsOptionalEnvMethod,
      env: Env? = null,
      invoker: Invoker
  ): AnotherType?

  abstract suspend fun _if(
      args: ArgsIf,
      invoker: Invoker
  ): Else

  private suspend fun __moduleMethod(
      encodedArgs: ByteArray?,
      encodedEnv: ByteArray?,
      invoker: Invoker
    ): ByteArray {
        val args: ArgsModuleMethod = encodedArgs?.let {
            msgPackDecode(ArgsModuleMethod.serializer(), it).getOrNull()
                ?: throw Exception("Failed to decode args in invocation to plugin method 'moduleMethod'")
        } ?: throw Exception("Missing args in invocation to plugin method 'moduleMethod'")
        val response = moduleMethod(args, invoker)
        return msgPackEncode(serializer(), response)
  }

  private suspend fun __objectMethod(
      encodedArgs: ByteArray?,
      encodedEnv: ByteArray?,
      invoker: Invoker
    ): ByteArray {
        val args: ArgsObjectMethod = encodedArgs?.let {
            msgPackDecode(ArgsObjectMethod.serializer(), it).getOrNull()
                ?: throw Exception("Failed to decode args in invocation to plugin method 'objectMethod'")
        } ?: throw Exception("Missing args in invocation to plugin method 'objectMethod'")
        val env: Env = encodedEnv?.let {
            msgPackDecode(Env.serializer(), it).getOrNull()
                ?: throw Exception("Failed to decode env in invocation to plugin method 'objectMethod'")
        } ?: throw Exception("Missing env in invocation to plugin method 'objectMethod'")
        val response = objectMethod(args, env, invoker)
        return msgPackEncode(serializer(), response)
  }

  private suspend fun __optionalEnvMethod(
      encodedArgs: ByteArray?,
      encodedEnv: ByteArray?,
      invoker: Invoker
    ): ByteArray {
        val args: ArgsOptionalEnvMethod = encodedArgs?.let {
            msgPackDecode(ArgsOptionalEnvMethod.serializer(), it).getOrNull()
                ?: throw Exception("Failed to decode args in invocation to plugin method 'optionalEnvMethod'")
        } ?: throw Exception("Missing args in invocation to plugin method 'optionalEnvMethod'")
        val env: Env = encodedEnv?.let {
            msgPackDecode(Env.serializer(), it).getOrNull()
                ?: throw Exception("Failed to decode env in invocation to plugin method 'optionalEnvMethod'")
        } ?: throw Exception("Missing env in invocation to plugin method 'optionalEnvMethod'")
        val response = optionalEnvMethod(args, env, invoker)
        return msgPackEncode(serializer(), response)
  }

  private suspend fun __if(
      encodedArgs: ByteArray?,
      encodedEnv: ByteArray?,
      invoker: Invoker
    ): ByteArray {
        val args: ArgsIf = encodedArgs?.let {
            msgPackDecode(ArgsIf.serializer(), it).getOrNull()
                ?: throw Exception("Failed to decode args in invocation to plugin method 'if'")
        } ?: throw Exception("Missing args in invocation to plugin method 'if'")
        val response = _if(args, invoker)
        return msgPackEncode(serializer(), response)
  }
}
