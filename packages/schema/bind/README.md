# Polywrap Binding

Generates Polywrap schema bindings for supported guest languages.

## Details

Polywrap uses MessagePack as a common data interchange format between languages. This allows Polywrap WASM modules, authored in different languages, to be run within a single host language (JS, Rust, Python, Go, C#, C++).

MessagePack encoded data is sent between module boundaries. Decoding of the message will happen in the destination environment, using generated binding code, created by this package.

## Supported Schema Types

| GraphQL Schema Type | [MessagePack Type](https://github.com/msgpack/msgpack/blob/master/spec.md#formats) | Description |
|-|-|-|
| UInt | uint 32 | 32-bit unsigned integer. |
| UInt8 | uint 8 | 8-bit unsigned integer. |
| UInt16 | uint 16 | 16-bit unsigned integer. |
| UInt32 | uint 32 | 32-bit unsigned integer. |
| Int | int 32 | 32-bit signed integer. |
| Int8 | int 8 | 8-bit signed integer. |
| Int16 | int 16 | 16-bit signed integer. |
| Int32 | int 32 | 32-bit signed integer. |
| String | fixstr or str 8/16/32 | UTF-8 string. |
| Boolean | bool | true or false stored as 1 byte. |
| Bytes | bin 8/16/32 | array of 8-bit unsigned integer. |
| BigInt | fixstr or str 8/16/32 | UTF-8 string. |
| BigNumber | fixstr or str 8/16/32 | UTF-8 string. |
| BigFraction | 2x fixstr or str 8/16/32 | Two consecutive UTF-8 strings. |
| Fraction | 2x int or uint | Two consecutive signed or unsigned integers. |
| JSON | fixstr or str 8/16/32 | UTF-8 string. |
| [Type] | fixarray or array 16/32 | Array of elements. |
| Map | Msgpack extention type | Map of key-value pairs. |
| type CustomObject {<br/>&nbsp;&nbsp;prop: Type<br/>} | fixmap or map 16/32 | Structured object. |

## Usage

TODO
