# Web3API Binding

Generates Web3API schema bindings for supported guest languages.

## Details

Web3API uses MessagePack as a common data interchange format between languages. This allows Web3API WASM modules, authored in different langues, to be run within a single host language (JS, Rust, Python, Go, C#, C++).

MessagePack encoded data is sent between module boundaries. Decoding of the message will happen in the destination environment, using generated binding code, created by this package.

## Supported Schema Types

| GraphQL Schema Type | [MessagePack Type](https://github.com/msgpack/msgpack/blob/master/spec.md#formats) | Description |
| - | - | - |
| UInt | uint 32 | 32-bit unsigned integer. |
| UInt8 | uint 8 | 8-bit unsigned integer. |
| UInt16 | uint 16 | 16-bit unsigned integer. |
| UInt32 | uint 32 | 32-bit unsigned integer. |
| UInt64 | uint 64 | 64-bit unsigned integer. |
| Int | int 32 | 32-bit signed integer. |
| Int8 | int 8 | 8-bit signed integer. |
| Int16 | int 16 | 16-bit signed integer. |
| Int32 | int 32 | 32-bit signed integer. |
| Int64 | int 64 | 64-bit signed integer. |
| String | fixstr or str 8/16/32 | UTF-8 string. |
| Boolean | bool | true or false stored as 1 byte. |
| Bytes | bin 8/16/32 | array of 8-bit unsigned integer. |
| BigInt | fixstr or str 8/16/32 | UTF-8 string. |
| [Type] | fixarray or array 16/32 | Array of elements. |
| type CustomObject {<br/>&nbsp;&nbsp;prop: Type<br/>} | fixmap or map 16/32 | sdf |

## Usage

TODO
