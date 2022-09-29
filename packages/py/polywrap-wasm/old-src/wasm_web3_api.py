from __future__ import annotations
import json
from typing import Dict, Any, Union, List
from dataclasses import dataclass

from wasm.imports import create_imports
from polywrap_msgpack {

}
from polywrap_core import (
    Api,
    UriResolverInterface,
    Uri,
    GetFileOptions,
    InvokeApiResult
)
from asyncify import AsyncWasmInstance


def has_export(name: str, exports: Dict[str, Any]):
    if not exports.get(name, None):
        return False
    
    return True


@dataclass
class State():
    method: str
    args: bytearray
    invoke: Dict[str, Union[bytearray, str]]
    subinvoke: Dict[str, Union[bytearray, str, List[Any]]]
    subinvoke_implementation: Dict[str, Union[bytearray, str, List[Any]]]
    invoke_res: Dict[str, Union[bytearray, str]]
    sanitize_env: Dict[str, bytearray]
    get_implementations_result: bytearray = None
    env: bytearray = None


class WasmWeb3Api(Api):
    required_exports = ["_w3_invoke"]

    def __init__(self, _uri: Uri, _manifest: Web3ApiManifest, _uri_resolver: str, _client_env: Env = None):
        super().__init__()
        self._uri = _uri
        self._manifest = _manifest
        self._uri_resolver = _uri_resolver
        self._client_env = _client_env
        self._wasm = None
        self._schema = None
        self._sanitized_env = None

    @classmethod
    async def get_manifest(cls, options: GetManifestOptions, client: Client) -> Awaitable[AnyManifestArtifact]:
        if not options.type:
            return cls._manifest
        
        file_title = "web3api" if options.type == "web3api" else "web3api." + options.type
        manifest_exts = ["json", "yaml", "yml"]
        for ext in manifest_exts:
            path = f"{file_title}.{ext}"
            try:
                manifest = await cls.get_file(
                    GetFileOptions(path = path, encoding = "utf8"),
                    client
                )
                break
            except Exception:
                continue
        
        if not manifest:
            raise ValueError("WasmWeb3Api: Manifest was not found.")
        
        if options.type == "build":
            return deserialize_build_manifest(manifest)
        elif options.type == "meta":
            return deserialize_meta_manifest(manifest)
        else:
            return deserialize_web3_api_manifest(manifest)

    @classmethod   
    async def get_file(cls, options: GetFileOptions, client: Client) -> Awaitable[Union[bytearray, str]]:
        invoke_api_result = await UriResolverInterface.get_file(
            client.invoke(options),
            Uri(cls._uri_resolver),  # TODO: support all types of URI resolvers (cache, etc)
            combine_paths(cls._uri.path, options.path)
        )

        if invoke_api_result.error:
            raise invoke_api_result.error
        
        # If nothing is returned, the file was not found
        if not invoke_api_result.data:
            raise ValueError(f"WasmWeb3Api: File was not found.\nURI: {cls._uri}\nSubpath: {options.path}")
        
        if options.encoding:
            text = str(invoke_api_result.data)

            if not text:
                raise ValueError(f"WasmWeb3Api: Decoding the file's bytes array failed.\nBytes: {invoke_api_result.data}")

            return text
        
        return invoke_api_result.data

    @classmethod
    async def invoke(cls, options: InvokeApiOptions, client: Client) -> Awaitable[InvokeApiResult]:
        try:
            input = options.input if options.input else {}
            wasm = await cls._get_wasm_module(client)
            state = State(
                invoke = None,
                sub_invoke = {
                    "args": []
                },
                sub_invoke_implementation = {
                    "args": []
                },
                invoke_result = None,
                method = options.method,
                sanitize_env = None,
                args = input if isinstance(input, bytearray) else msgpack_encode(input)
            )
            def abort(message: str):
                raise ValueError(f"""WasmWeb3Api: Wasm module aborted execution.\nURI: ${cls._uri.uri}\n
                    Method: ${options.method}\n
                    Input: ${json.dumps(input)}\nMessage: {message}.\n"""
                )
            
            memory = AsyncWasmInstance.create_memory({ "module": wasm })
            instance = await AsyncWasmInstance.create_instance(
                module = wasm,
                imports = create_imports({
                    state,
                    client,
                    memory,
                    abort,
                }),
                required_exports = WasmWeb3Api.requiredExports,
            )
            exports = instance.exports
            await cls._sanitize_and_load_env(state, exports)
            result = await exports._w3_invoke(
                state.method.length,
                state.args.byteLength
            )
            invoke_result = cls._process_invoke_result(state, result, abort)
            if invoke_result.type == "InvokeError":
                raise ValueError(f"""WasmWeb3Api: invocation exception encountered.\n
                    uri: {cls._uri.uri}\n
                    method: {options.method}\n
                    input: {json.dumps(input)}\n
                    exception: {invoke_result.invoke_error}"""
                )
            elif invoke_result.type == "InvokeResult":
                if options.no_decode:
                    return InvokeApiResult(
                        data = invoke_result.invoke_result
                    )
                
                try:
                    return InvokeApiResult(
                        data = msgpack_decode(invoke_result.invoke_result)
                    )
                except Exception as e:
                    raise ValueError(
                        f"WasmWeb3Api: Failed to decode query result.\nResult: {invoke_result.invoke_result}\nError: ${e}"
                    )
            else:
                raise ValueError(f"WasmWeb3Api: Unknown state {state}")
        except Exception:
            raise

    @classmethod
    async def get_schema(cls, client: Client) -> Awaitable[str]:
        if cls._schema:
            return cls.get_schema
        
        # Either the query or mutation module will work, as they share the same schema file
        schema = cls._manifest.schema
        cls._schema = await cls.get_file(
            GetFileOptions(path = schema),
            client
        )
        return cls._schema

    @classmethod
    def _process_invoke_result(
        cls,
        state: State,
        result: bool,
        abort: Callable
    ) -> Dict[str, Union[bytearray, str]]:
        if result:
            if not state.invoke.result:
                abort("Invoke result is missing.")
            
            return {
                "type": "InvokeResult",
                "invoke_result": state.invoke.result,
            }
        else:
            if not state.invoke.error:
                abort("Invoke error is missing.")
            return {
                "type": "InvokeError",
                "invoke_error": state.invoke.error,
            }

    @classmethod
    async def _sanitize_and_load_env(
        cls,
        state: State,
        exports: W3Exports
    ):
        if has_export("_w3_load_env", exports):
            if cls._sanitized_env is not None:
                state.env = cls._sanitized_env
            else:
                client_env = cls._get_module_client_env()

                if has_export("_w3_sanitize_env", exports):
                    state.sanitize_env.args = msgpack_encode({ env: client_env })
                    await exports._w3_sanitize_env(state.sanitize_env.args.byteLength)
                    state.env = state.sanitize_env.result
                    cls._sanitized_env = state.env
                else:
                    state.env = msgpack_encode(client_env)
                    cls._sanitized_env = state.env
            
            await exports._w3_load_env(state.env.byteLength)

    @classmethod
    def _get_module_client_env(cls) -> Dict[str, Any]:
        if not cls._client_env or not cls._client_env.module:
            return {}
        return cls._client_env.module
    
    @classmethod
    async def _get_wasm_module(cls, client: Client) -> bytearray:
        if cls._wasm is not None:
            return cls._wasm
        
        module_manifest = cls._manifest.main

        if not module_manifest:
            raise ValueError("Package manifest does not contain a definition for module")
        
        data = await cls.get_file(
            GetFileOptions(path = module_manifest),
            client
        )
        cls._wasm = data
        return data
