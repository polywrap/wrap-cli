/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.
import { WrapManifest } from "@polywrap/wrap-manifest-types-js"

export const wrapManifest: WrapManifest = {
  name: "Test",
  type: "plugin",
  version: "0.1",
  abi: {
  "objectTypes": [
    {
      "type": "Object",
      "name": null,
      "required": null,
      "kind": 1,
      "properties": [
        {
          "type": "UInt",
          "name": "u",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "UInt",
            "name": "u",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "[Boolean]",
          "name": "array",
          "required": true,
          "kind": 34,
          "array": {
            "type": "[Boolean]",
            "name": "array",
            "required": true,
            "kind": 18,
            "array": null,
            "map": null,
            "scalar": {
              "type": "Boolean",
              "name": "array",
              "required": true,
              "kind": 4
            },
            "object": null,
            "enum": null,
            "unresolvedObjectOrEnum": null,
            "item": {
              "type": "Boolean",
              "name": "array",
              "required": true,
              "kind": 4
            }
          },
          "map": null,
          "scalar": null,
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "Bytes",
          "name": "bytes",
          "required": null,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "Bytes",
            "name": "bytes",
            "required": null,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        }
      ],
      "interfaces": []
    }
  ],
  "enumTypes": [],
  "interfaceTypes": [],
  "importedObjectTypes": [
    {
      "type": "Ethereum_Connection",
      "name": null,
      "required": null,
      "kind": 1025,
      "properties": [
        {
          "type": "String",
          "name": "node",
          "required": null,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "node",
            "required": null,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "String",
          "name": "networkNameOrChainId",
          "required": null,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "networkNameOrChainId",
            "required": null,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        }
      ],
      "interfaces": [],
      "uri": "ens/ethereum.polywrap.eth",
      "namespace": "Ethereum",
      "nativeType": "Connection"
    },
    {
      "type": "Ethereum_TxOverrides",
      "name": null,
      "required": null,
      "kind": 1025,
      "properties": [
        {
          "type": "BigInt",
          "name": "gasLimit",
          "required": null,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "BigInt",
            "name": "gasLimit",
            "required": null,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "BigInt",
          "name": "gasPrice",
          "required": null,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "BigInt",
            "name": "gasPrice",
            "required": null,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "BigInt",
          "name": "value",
          "required": null,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "BigInt",
            "name": "value",
            "required": null,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        }
      ],
      "interfaces": [],
      "uri": "ens/ethereum.polywrap.eth",
      "namespace": "Ethereum",
      "nativeType": "TxOverrides"
    },
    {
      "type": "Ethereum_StaticTxResult",
      "name": null,
      "required": null,
      "kind": 1025,
      "properties": [
        {
          "type": "String",
          "name": "result",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "result",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "Boolean",
          "name": "error",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "Boolean",
            "name": "error",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        }
      ],
      "interfaces": [],
      "uri": "ens/ethereum.polywrap.eth",
      "namespace": "Ethereum",
      "nativeType": "StaticTxResult"
    },
    {
      "type": "Ethereum_TxRequest",
      "name": null,
      "required": null,
      "kind": 1025,
      "properties": [
        {
          "type": "String",
          "name": "to",
          "required": null,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "to",
            "required": null,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "String",
          "name": "from",
          "required": null,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "from",
            "required": null,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "UInt32",
          "name": "nonce",
          "required": null,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "UInt32",
            "name": "nonce",
            "required": null,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "BigInt",
          "name": "gasLimit",
          "required": null,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "BigInt",
            "name": "gasLimit",
            "required": null,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "BigInt",
          "name": "gasPrice",
          "required": null,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "BigInt",
            "name": "gasPrice",
            "required": null,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "String",
          "name": "data",
          "required": null,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "data",
            "required": null,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "BigInt",
          "name": "value",
          "required": null,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "BigInt",
            "name": "value",
            "required": null,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "BigInt",
          "name": "chainId",
          "required": null,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "BigInt",
            "name": "chainId",
            "required": null,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "UInt32",
          "name": "type",
          "required": null,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "UInt32",
            "name": "type",
            "required": null,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        }
      ],
      "interfaces": [],
      "uri": "ens/ethereum.polywrap.eth",
      "namespace": "Ethereum",
      "nativeType": "TxRequest"
    },
    {
      "type": "Ethereum_TxReceipt",
      "name": null,
      "required": null,
      "kind": 1025,
      "properties": [
        {
          "type": "String",
          "name": "to",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "to",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "String",
          "name": "from",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "from",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "String",
          "name": "contractAddress",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "contractAddress",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "UInt32",
          "name": "transactionIndex",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "UInt32",
            "name": "transactionIndex",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "String",
          "name": "root",
          "required": null,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "root",
            "required": null,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "BigInt",
          "name": "gasUsed",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "BigInt",
            "name": "gasUsed",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "String",
          "name": "logsBloom",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "logsBloom",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "String",
          "name": "transactionHash",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "transactionHash",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "[Ethereum_Log]",
          "name": "logs",
          "required": true,
          "kind": 34,
          "array": {
            "type": "[Ethereum_Log]",
            "name": "logs",
            "required": true,
            "kind": 18,
            "array": null,
            "map": null,
            "scalar": null,
            "object": {
              "type": "Ethereum_Log",
              "name": "logs",
              "required": true,
              "kind": 8192
            },
            "enum": null,
            "unresolvedObjectOrEnum": null,
            "item": {
              "type": "Ethereum_Log",
              "name": "logs",
              "required": true,
              "kind": 8192
            }
          },
          "map": null,
          "scalar": null,
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "BigInt",
          "name": "blockNumber",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "BigInt",
            "name": "blockNumber",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "String",
          "name": "blockHash",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "blockHash",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "UInt32",
          "name": "confirmations",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "UInt32",
            "name": "confirmations",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "BigInt",
          "name": "cumulativeGasUsed",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "BigInt",
            "name": "cumulativeGasUsed",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "BigInt",
          "name": "effectiveGasPrice",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "BigInt",
            "name": "effectiveGasPrice",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "Boolean",
          "name": "byzantium",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "Boolean",
            "name": "byzantium",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "UInt32",
          "name": "type",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "UInt32",
            "name": "type",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "UInt32",
          "name": "status",
          "required": null,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "UInt32",
            "name": "status",
            "required": null,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        }
      ],
      "interfaces": [],
      "uri": "ens/ethereum.polywrap.eth",
      "namespace": "Ethereum",
      "nativeType": "TxReceipt"
    },
    {
      "type": "Ethereum_Log",
      "name": null,
      "required": null,
      "kind": 1025,
      "properties": [
        {
          "type": "BigInt",
          "name": "blockNumber",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "BigInt",
            "name": "blockNumber",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "String",
          "name": "blockHash",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "blockHash",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "UInt32",
          "name": "transactionIndex",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "UInt32",
            "name": "transactionIndex",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "Boolean",
          "name": "removed",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "Boolean",
            "name": "removed",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "String",
          "name": "address",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "address",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "String",
          "name": "data",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "data",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "[String]",
          "name": "topics",
          "required": true,
          "kind": 34,
          "array": {
            "type": "[String]",
            "name": "topics",
            "required": true,
            "kind": 18,
            "array": null,
            "map": null,
            "scalar": {
              "type": "String",
              "name": "topics",
              "required": true,
              "kind": 4
            },
            "object": null,
            "enum": null,
            "unresolvedObjectOrEnum": null,
            "item": {
              "type": "String",
              "name": "topics",
              "required": true,
              "kind": 4
            }
          },
          "map": null,
          "scalar": null,
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "String",
          "name": "transactionHash",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "transactionHash",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "UInt32",
          "name": "logIndex",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "UInt32",
            "name": "logIndex",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        }
      ],
      "interfaces": [],
      "uri": "ens/ethereum.polywrap.eth",
      "namespace": "Ethereum",
      "nativeType": "Log"
    },
    {
      "type": "Ethereum_EventNotification",
      "name": null,
      "required": null,
      "kind": 1025,
      "properties": [
        {
          "type": "String",
          "name": "data",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "data",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "String",
          "name": "address",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "address",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "Ethereum_Log",
          "name": "log",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": null,
          "object": {
            "type": "Ethereum_Log",
            "name": "log",
            "required": true,
            "kind": 8192
          },
          "enum": null,
          "unresolvedObjectOrEnum": null
        }
      ],
      "interfaces": [],
      "uri": "ens/ethereum.polywrap.eth",
      "namespace": "Ethereum",
      "nativeType": "EventNotification"
    },
    {
      "type": "Ethereum_Network",
      "name": null,
      "required": null,
      "kind": 1025,
      "properties": [
        {
          "type": "String",
          "name": "name",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "name",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "BigInt",
          "name": "chainId",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "BigInt",
            "name": "chainId",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "String",
          "name": "ensAddress",
          "required": null,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "ensAddress",
            "required": null,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        }
      ],
      "interfaces": [],
      "uri": "ens/ethereum.polywrap.eth",
      "namespace": "Ethereum",
      "nativeType": "Network"
    },
    {
      "type": "Ethereum_TxResponse",
      "name": null,
      "required": null,
      "kind": 1025,
      "properties": [
        {
          "type": "String",
          "name": "hash",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "hash",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "String",
          "name": "to",
          "required": null,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "to",
            "required": null,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "String",
          "name": "from",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "from",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "UInt32",
          "name": "nonce",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "UInt32",
            "name": "nonce",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "BigInt",
          "name": "gasLimit",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "BigInt",
            "name": "gasLimit",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "BigInt",
          "name": "gasPrice",
          "required": null,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "BigInt",
            "name": "gasPrice",
            "required": null,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "String",
          "name": "data",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "data",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "BigInt",
          "name": "value",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "BigInt",
            "name": "value",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "BigInt",
          "name": "chainId",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "BigInt",
            "name": "chainId",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "BigInt",
          "name": "blockNumber",
          "required": null,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "BigInt",
            "name": "blockNumber",
            "required": null,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "String",
          "name": "blockHash",
          "required": null,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "blockHash",
            "required": null,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "UInt32",
          "name": "timestamp",
          "required": null,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "UInt32",
            "name": "timestamp",
            "required": null,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "UInt32",
          "name": "confirmations",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "UInt32",
            "name": "confirmations",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "String",
          "name": "raw",
          "required": null,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "raw",
            "required": null,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "String",
          "name": "r",
          "required": null,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "r",
            "required": null,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "String",
          "name": "s",
          "required": null,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "s",
            "required": null,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "UInt32",
          "name": "v",
          "required": null,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "UInt32",
            "name": "v",
            "required": null,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "UInt32",
          "name": "type",
          "required": null,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "UInt32",
            "name": "type",
            "required": null,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "[Ethereum_Access]",
          "name": "accessList",
          "required": null,
          "kind": 34,
          "array": {
            "type": "[Ethereum_Access]",
            "name": "accessList",
            "required": null,
            "kind": 18,
            "array": null,
            "map": null,
            "scalar": null,
            "object": {
              "type": "Ethereum_Access",
              "name": "accessList",
              "required": true,
              "kind": 8192
            },
            "enum": null,
            "unresolvedObjectOrEnum": null,
            "item": {
              "type": "Ethereum_Access",
              "name": "accessList",
              "required": true,
              "kind": 8192
            }
          },
          "map": null,
          "scalar": null,
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        }
      ],
      "interfaces": [],
      "uri": "ens/ethereum.polywrap.eth",
      "namespace": "Ethereum",
      "nativeType": "TxResponse"
    },
    {
      "type": "Ethereum_Access",
      "name": null,
      "required": null,
      "kind": 1025,
      "properties": [
        {
          "type": "String",
          "name": "address",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "address",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        },
        {
          "type": "[String]",
          "name": "storageKeys",
          "required": true,
          "kind": 34,
          "array": {
            "type": "[String]",
            "name": "storageKeys",
            "required": true,
            "kind": 18,
            "array": null,
            "map": null,
            "scalar": {
              "type": "String",
              "name": "storageKeys",
              "required": true,
              "kind": 4
            },
            "object": null,
            "enum": null,
            "unresolvedObjectOrEnum": null,
            "item": {
              "type": "String",
              "name": "storageKeys",
              "required": true,
              "kind": 4
            }
          },
          "map": null,
          "scalar": null,
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        }
      ],
      "interfaces": [],
      "uri": "ens/ethereum.polywrap.eth",
      "namespace": "Ethereum",
      "nativeType": "Access"
    }
  ],
  "importedModuleTypes": [
    {
      "type": "Ethereum_Module",
      "name": null,
      "required": null,
      "kind": 256,
      "methods": [
        {
          "type": "Method",
          "name": "callContractView",
          "required": true,
          "kind": 64,
          "arguments": [
            {
              "type": "String",
              "name": "address",
              "required": true,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": {
                "type": "String",
                "name": "address",
                "required": true,
                "kind": 4
              },
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "String",
              "name": "method",
              "required": true,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": {
                "type": "String",
                "name": "method",
                "required": true,
                "kind": 4
              },
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "[String]",
              "name": "args",
              "required": null,
              "kind": 34,
              "array": {
                "type": "[String]",
                "name": "args",
                "required": null,
                "kind": 18,
                "array": null,
                "map": null,
                "scalar": {
                  "type": "String",
                  "name": "args",
                  "required": true,
                  "kind": 4
                },
                "object": null,
                "enum": null,
                "unresolvedObjectOrEnum": null,
                "item": {
                  "type": "String",
                  "name": "args",
                  "required": true,
                  "kind": 4
                }
              },
              "map": null,
              "scalar": null,
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "Ethereum_Connection",
              "name": "connection",
              "required": null,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": null,
              "object": {
                "type": "Ethereum_Connection",
                "name": "connection",
                "required": null,
                "kind": 8192
              },
              "enum": null,
              "unresolvedObjectOrEnum": null
            }
          ],
          "return": {
            "type": "String",
            "name": "callContractView",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": {
              "type": "String",
              "name": "callContractView",
              "required": true,
              "kind": 4
            },
            "object": null,
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        },
        {
          "type": "Method",
          "name": "callContractStatic",
          "required": true,
          "kind": 64,
          "arguments": [
            {
              "type": "String",
              "name": "address",
              "required": true,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": {
                "type": "String",
                "name": "address",
                "required": true,
                "kind": 4
              },
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "String",
              "name": "method",
              "required": true,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": {
                "type": "String",
                "name": "method",
                "required": true,
                "kind": 4
              },
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "[String]",
              "name": "args",
              "required": null,
              "kind": 34,
              "array": {
                "type": "[String]",
                "name": "args",
                "required": null,
                "kind": 18,
                "array": null,
                "map": null,
                "scalar": {
                  "type": "String",
                  "name": "args",
                  "required": true,
                  "kind": 4
                },
                "object": null,
                "enum": null,
                "unresolvedObjectOrEnum": null,
                "item": {
                  "type": "String",
                  "name": "args",
                  "required": true,
                  "kind": 4
                }
              },
              "map": null,
              "scalar": null,
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "Ethereum_Connection",
              "name": "connection",
              "required": null,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": null,
              "object": {
                "type": "Ethereum_Connection",
                "name": "connection",
                "required": null,
                "kind": 8192
              },
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "Ethereum_TxOverrides",
              "name": "txOverrides",
              "required": null,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": null,
              "object": {
                "type": "Ethereum_TxOverrides",
                "name": "txOverrides",
                "required": null,
                "kind": 8192
              },
              "enum": null,
              "unresolvedObjectOrEnum": null
            }
          ],
          "return": {
            "type": "Ethereum_StaticTxResult",
            "name": "callContractStatic",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": null,
            "object": {
              "type": "Ethereum_StaticTxResult",
              "name": "callContractStatic",
              "required": true,
              "kind": 8192
            },
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        },
        {
          "type": "Method",
          "name": "getBalance",
          "required": true,
          "kind": 64,
          "arguments": [
            {
              "type": "String",
              "name": "address",
              "required": true,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": {
                "type": "String",
                "name": "address",
                "required": true,
                "kind": 4
              },
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "BigInt",
              "name": "blockTag",
              "required": null,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": {
                "type": "BigInt",
                "name": "blockTag",
                "required": null,
                "kind": 4
              },
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "Ethereum_Connection",
              "name": "connection",
              "required": null,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": null,
              "object": {
                "type": "Ethereum_Connection",
                "name": "connection",
                "required": null,
                "kind": 8192
              },
              "enum": null,
              "unresolvedObjectOrEnum": null
            }
          ],
          "return": {
            "type": "BigInt",
            "name": "getBalance",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": {
              "type": "BigInt",
              "name": "getBalance",
              "required": true,
              "kind": 4
            },
            "object": null,
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        },
        {
          "type": "Method",
          "name": "encodeParams",
          "required": true,
          "kind": 64,
          "arguments": [
            {
              "type": "[String]",
              "name": "types",
              "required": true,
              "kind": 34,
              "array": {
                "type": "[String]",
                "name": "types",
                "required": true,
                "kind": 18,
                "array": null,
                "map": null,
                "scalar": {
                  "type": "String",
                  "name": "types",
                  "required": true,
                  "kind": 4
                },
                "object": null,
                "enum": null,
                "unresolvedObjectOrEnum": null,
                "item": {
                  "type": "String",
                  "name": "types",
                  "required": true,
                  "kind": 4
                }
              },
              "map": null,
              "scalar": null,
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "[String]",
              "name": "values",
              "required": true,
              "kind": 34,
              "array": {
                "type": "[String]",
                "name": "values",
                "required": true,
                "kind": 18,
                "array": null,
                "map": null,
                "scalar": {
                  "type": "String",
                  "name": "values",
                  "required": true,
                  "kind": 4
                },
                "object": null,
                "enum": null,
                "unresolvedObjectOrEnum": null,
                "item": {
                  "type": "String",
                  "name": "values",
                  "required": true,
                  "kind": 4
                }
              },
              "map": null,
              "scalar": null,
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            }
          ],
          "return": {
            "type": "String",
            "name": "encodeParams",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": {
              "type": "String",
              "name": "encodeParams",
              "required": true,
              "kind": 4
            },
            "object": null,
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        },
        {
          "type": "Method",
          "name": "encodeFunction",
          "required": true,
          "kind": 64,
          "arguments": [
            {
              "type": "String",
              "name": "method",
              "required": true,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": {
                "type": "String",
                "name": "method",
                "required": true,
                "kind": 4
              },
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "[String]",
              "name": "args",
              "required": null,
              "kind": 34,
              "array": {
                "type": "[String]",
                "name": "args",
                "required": null,
                "kind": 18,
                "array": null,
                "map": null,
                "scalar": {
                  "type": "String",
                  "name": "args",
                  "required": true,
                  "kind": 4
                },
                "object": null,
                "enum": null,
                "unresolvedObjectOrEnum": null,
                "item": {
                  "type": "String",
                  "name": "args",
                  "required": true,
                  "kind": 4
                }
              },
              "map": null,
              "scalar": null,
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            }
          ],
          "return": {
            "type": "String",
            "name": "encodeFunction",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": {
              "type": "String",
              "name": "encodeFunction",
              "required": true,
              "kind": 4
            },
            "object": null,
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        },
        {
          "type": "Method",
          "name": "solidityPack",
          "required": true,
          "kind": 64,
          "arguments": [
            {
              "type": "[String]",
              "name": "types",
              "required": true,
              "kind": 34,
              "array": {
                "type": "[String]",
                "name": "types",
                "required": true,
                "kind": 18,
                "array": null,
                "map": null,
                "scalar": {
                  "type": "String",
                  "name": "types",
                  "required": true,
                  "kind": 4
                },
                "object": null,
                "enum": null,
                "unresolvedObjectOrEnum": null,
                "item": {
                  "type": "String",
                  "name": "types",
                  "required": true,
                  "kind": 4
                }
              },
              "map": null,
              "scalar": null,
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "[String]",
              "name": "values",
              "required": true,
              "kind": 34,
              "array": {
                "type": "[String]",
                "name": "values",
                "required": true,
                "kind": 18,
                "array": null,
                "map": null,
                "scalar": {
                  "type": "String",
                  "name": "values",
                  "required": true,
                  "kind": 4
                },
                "object": null,
                "enum": null,
                "unresolvedObjectOrEnum": null,
                "item": {
                  "type": "String",
                  "name": "values",
                  "required": true,
                  "kind": 4
                }
              },
              "map": null,
              "scalar": null,
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            }
          ],
          "return": {
            "type": "String",
            "name": "solidityPack",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": {
              "type": "String",
              "name": "solidityPack",
              "required": true,
              "kind": 4
            },
            "object": null,
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        },
        {
          "type": "Method",
          "name": "solidityKeccak256",
          "required": true,
          "kind": 64,
          "arguments": [
            {
              "type": "[String]",
              "name": "types",
              "required": true,
              "kind": 34,
              "array": {
                "type": "[String]",
                "name": "types",
                "required": true,
                "kind": 18,
                "array": null,
                "map": null,
                "scalar": {
                  "type": "String",
                  "name": "types",
                  "required": true,
                  "kind": 4
                },
                "object": null,
                "enum": null,
                "unresolvedObjectOrEnum": null,
                "item": {
                  "type": "String",
                  "name": "types",
                  "required": true,
                  "kind": 4
                }
              },
              "map": null,
              "scalar": null,
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "[String]",
              "name": "values",
              "required": true,
              "kind": 34,
              "array": {
                "type": "[String]",
                "name": "values",
                "required": true,
                "kind": 18,
                "array": null,
                "map": null,
                "scalar": {
                  "type": "String",
                  "name": "values",
                  "required": true,
                  "kind": 4
                },
                "object": null,
                "enum": null,
                "unresolvedObjectOrEnum": null,
                "item": {
                  "type": "String",
                  "name": "values",
                  "required": true,
                  "kind": 4
                }
              },
              "map": null,
              "scalar": null,
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            }
          ],
          "return": {
            "type": "String",
            "name": "solidityKeccak256",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": {
              "type": "String",
              "name": "solidityKeccak256",
              "required": true,
              "kind": 4
            },
            "object": null,
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        },
        {
          "type": "Method",
          "name": "soliditySha256",
          "required": true,
          "kind": 64,
          "arguments": [
            {
              "type": "[String]",
              "name": "types",
              "required": true,
              "kind": 34,
              "array": {
                "type": "[String]",
                "name": "types",
                "required": true,
                "kind": 18,
                "array": null,
                "map": null,
                "scalar": {
                  "type": "String",
                  "name": "types",
                  "required": true,
                  "kind": 4
                },
                "object": null,
                "enum": null,
                "unresolvedObjectOrEnum": null,
                "item": {
                  "type": "String",
                  "name": "types",
                  "required": true,
                  "kind": 4
                }
              },
              "map": null,
              "scalar": null,
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "[String]",
              "name": "values",
              "required": true,
              "kind": 34,
              "array": {
                "type": "[String]",
                "name": "values",
                "required": true,
                "kind": 18,
                "array": null,
                "map": null,
                "scalar": {
                  "type": "String",
                  "name": "values",
                  "required": true,
                  "kind": 4
                },
                "object": null,
                "enum": null,
                "unresolvedObjectOrEnum": null,
                "item": {
                  "type": "String",
                  "name": "values",
                  "required": true,
                  "kind": 4
                }
              },
              "map": null,
              "scalar": null,
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            }
          ],
          "return": {
            "type": "String",
            "name": "soliditySha256",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": {
              "type": "String",
              "name": "soliditySha256",
              "required": true,
              "kind": 4
            },
            "object": null,
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        },
        {
          "type": "Method",
          "name": "getSignerAddress",
          "required": true,
          "kind": 64,
          "arguments": [
            {
              "type": "Ethereum_Connection",
              "name": "connection",
              "required": null,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": null,
              "object": {
                "type": "Ethereum_Connection",
                "name": "connection",
                "required": null,
                "kind": 8192
              },
              "enum": null,
              "unresolvedObjectOrEnum": null
            }
          ],
          "return": {
            "type": "String",
            "name": "getSignerAddress",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": {
              "type": "String",
              "name": "getSignerAddress",
              "required": true,
              "kind": 4
            },
            "object": null,
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        },
        {
          "type": "Method",
          "name": "getSignerBalance",
          "required": true,
          "kind": 64,
          "arguments": [
            {
              "type": "BigInt",
              "name": "blockTag",
              "required": null,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": {
                "type": "BigInt",
                "name": "blockTag",
                "required": null,
                "kind": 4
              },
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "Ethereum_Connection",
              "name": "connection",
              "required": null,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": null,
              "object": {
                "type": "Ethereum_Connection",
                "name": "connection",
                "required": null,
                "kind": 8192
              },
              "enum": null,
              "unresolvedObjectOrEnum": null
            }
          ],
          "return": {
            "type": "BigInt",
            "name": "getSignerBalance",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": {
              "type": "BigInt",
              "name": "getSignerBalance",
              "required": true,
              "kind": 4
            },
            "object": null,
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        },
        {
          "type": "Method",
          "name": "getSignerTransactionCount",
          "required": true,
          "kind": 64,
          "arguments": [
            {
              "type": "BigInt",
              "name": "blockTag",
              "required": null,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": {
                "type": "BigInt",
                "name": "blockTag",
                "required": null,
                "kind": 4
              },
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "Ethereum_Connection",
              "name": "connection",
              "required": null,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": null,
              "object": {
                "type": "Ethereum_Connection",
                "name": "connection",
                "required": null,
                "kind": 8192
              },
              "enum": null,
              "unresolvedObjectOrEnum": null
            }
          ],
          "return": {
            "type": "BigInt",
            "name": "getSignerTransactionCount",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": {
              "type": "BigInt",
              "name": "getSignerTransactionCount",
              "required": true,
              "kind": 4
            },
            "object": null,
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        },
        {
          "type": "Method",
          "name": "getGasPrice",
          "required": true,
          "kind": 64,
          "arguments": [
            {
              "type": "Ethereum_Connection",
              "name": "connection",
              "required": null,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": null,
              "object": {
                "type": "Ethereum_Connection",
                "name": "connection",
                "required": null,
                "kind": 8192
              },
              "enum": null,
              "unresolvedObjectOrEnum": null
            }
          ],
          "return": {
            "type": "BigInt",
            "name": "getGasPrice",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": {
              "type": "BigInt",
              "name": "getGasPrice",
              "required": true,
              "kind": 4
            },
            "object": null,
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        },
        {
          "type": "Method",
          "name": "estimateTransactionGas",
          "required": true,
          "kind": 64,
          "arguments": [
            {
              "type": "Ethereum_TxRequest",
              "name": "tx",
              "required": true,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": null,
              "object": {
                "type": "Ethereum_TxRequest",
                "name": "tx",
                "required": true,
                "kind": 8192
              },
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "Ethereum_Connection",
              "name": "connection",
              "required": null,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": null,
              "object": {
                "type": "Ethereum_Connection",
                "name": "connection",
                "required": null,
                "kind": 8192
              },
              "enum": null,
              "unresolvedObjectOrEnum": null
            }
          ],
          "return": {
            "type": "BigInt",
            "name": "estimateTransactionGas",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": {
              "type": "BigInt",
              "name": "estimateTransactionGas",
              "required": true,
              "kind": 4
            },
            "object": null,
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        },
        {
          "type": "Method",
          "name": "estimateContractCallGas",
          "required": true,
          "kind": 64,
          "arguments": [
            {
              "type": "String",
              "name": "address",
              "required": true,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": {
                "type": "String",
                "name": "address",
                "required": true,
                "kind": 4
              },
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "String",
              "name": "method",
              "required": true,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": {
                "type": "String",
                "name": "method",
                "required": true,
                "kind": 4
              },
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "[String]",
              "name": "args",
              "required": null,
              "kind": 34,
              "array": {
                "type": "[String]",
                "name": "args",
                "required": null,
                "kind": 18,
                "array": null,
                "map": null,
                "scalar": {
                  "type": "String",
                  "name": "args",
                  "required": true,
                  "kind": 4
                },
                "object": null,
                "enum": null,
                "unresolvedObjectOrEnum": null,
                "item": {
                  "type": "String",
                  "name": "args",
                  "required": true,
                  "kind": 4
                }
              },
              "map": null,
              "scalar": null,
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "Ethereum_Connection",
              "name": "connection",
              "required": null,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": null,
              "object": {
                "type": "Ethereum_Connection",
                "name": "connection",
                "required": null,
                "kind": 8192
              },
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "Ethereum_TxOverrides",
              "name": "txOverrides",
              "required": null,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": null,
              "object": {
                "type": "Ethereum_TxOverrides",
                "name": "txOverrides",
                "required": null,
                "kind": 8192
              },
              "enum": null,
              "unresolvedObjectOrEnum": null
            }
          ],
          "return": {
            "type": "BigInt",
            "name": "estimateContractCallGas",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": {
              "type": "BigInt",
              "name": "estimateContractCallGas",
              "required": true,
              "kind": 4
            },
            "object": null,
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        },
        {
          "type": "Method",
          "name": "checkAddress",
          "required": true,
          "kind": 64,
          "arguments": [
            {
              "type": "String",
              "name": "address",
              "required": true,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": {
                "type": "String",
                "name": "address",
                "required": true,
                "kind": 4
              },
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            }
          ],
          "return": {
            "type": "Boolean",
            "name": "checkAddress",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": {
              "type": "Boolean",
              "name": "checkAddress",
              "required": true,
              "kind": 4
            },
            "object": null,
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        },
        {
          "type": "Method",
          "name": "toWei",
          "required": true,
          "kind": 64,
          "arguments": [
            {
              "type": "String",
              "name": "eth",
              "required": true,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": {
                "type": "String",
                "name": "eth",
                "required": true,
                "kind": 4
              },
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            }
          ],
          "return": {
            "type": "BigInt",
            "name": "toWei",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": {
              "type": "BigInt",
              "name": "toWei",
              "required": true,
              "kind": 4
            },
            "object": null,
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        },
        {
          "type": "Method",
          "name": "toEth",
          "required": true,
          "kind": 64,
          "arguments": [
            {
              "type": "BigInt",
              "name": "wei",
              "required": true,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": {
                "type": "BigInt",
                "name": "wei",
                "required": true,
                "kind": 4
              },
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            }
          ],
          "return": {
            "type": "String",
            "name": "toEth",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": {
              "type": "String",
              "name": "toEth",
              "required": true,
              "kind": 4
            },
            "object": null,
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        },
        {
          "type": "Method",
          "name": "awaitTransaction",
          "required": true,
          "kind": 64,
          "arguments": [
            {
              "type": "String",
              "name": "txHash",
              "required": true,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": {
                "type": "String",
                "name": "txHash",
                "required": true,
                "kind": 4
              },
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "UInt32",
              "name": "confirmations",
              "required": true,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": {
                "type": "UInt32",
                "name": "confirmations",
                "required": true,
                "kind": 4
              },
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "UInt32",
              "name": "timeout",
              "required": true,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": {
                "type": "UInt32",
                "name": "timeout",
                "required": true,
                "kind": 4
              },
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "Ethereum_Connection",
              "name": "connection",
              "required": null,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": null,
              "object": {
                "type": "Ethereum_Connection",
                "name": "connection",
                "required": null,
                "kind": 8192
              },
              "enum": null,
              "unresolvedObjectOrEnum": null
            }
          ],
          "return": {
            "type": "Ethereum_TxReceipt",
            "name": "awaitTransaction",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": null,
            "object": {
              "type": "Ethereum_TxReceipt",
              "name": "awaitTransaction",
              "required": true,
              "kind": 8192
            },
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        },
        {
          "type": "Method",
          "name": "waitForEvent",
          "required": true,
          "kind": 64,
          "arguments": [
            {
              "type": "String",
              "name": "address",
              "required": true,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": {
                "type": "String",
                "name": "address",
                "required": true,
                "kind": 4
              },
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "String",
              "name": "event",
              "required": true,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": {
                "type": "String",
                "name": "event",
                "required": true,
                "kind": 4
              },
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "[String]",
              "name": "args",
              "required": null,
              "kind": 34,
              "array": {
                "type": "[String]",
                "name": "args",
                "required": null,
                "kind": 18,
                "array": null,
                "map": null,
                "scalar": {
                  "type": "String",
                  "name": "args",
                  "required": true,
                  "kind": 4
                },
                "object": null,
                "enum": null,
                "unresolvedObjectOrEnum": null,
                "item": {
                  "type": "String",
                  "name": "args",
                  "required": true,
                  "kind": 4
                }
              },
              "map": null,
              "scalar": null,
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "UInt32",
              "name": "timeout",
              "required": null,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": {
                "type": "UInt32",
                "name": "timeout",
                "required": null,
                "kind": 4
              },
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "Ethereum_Connection",
              "name": "connection",
              "required": null,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": null,
              "object": {
                "type": "Ethereum_Connection",
                "name": "connection",
                "required": null,
                "kind": 8192
              },
              "enum": null,
              "unresolvedObjectOrEnum": null
            }
          ],
          "return": {
            "type": "Ethereum_EventNotification",
            "name": "waitForEvent",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": null,
            "object": {
              "type": "Ethereum_EventNotification",
              "name": "waitForEvent",
              "required": true,
              "kind": 8192
            },
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        },
        {
          "type": "Method",
          "name": "getNetwork",
          "required": true,
          "kind": 64,
          "arguments": [
            {
              "type": "Ethereum_Connection",
              "name": "connection",
              "required": null,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": null,
              "object": {
                "type": "Ethereum_Connection",
                "name": "connection",
                "required": null,
                "kind": 8192
              },
              "enum": null,
              "unresolvedObjectOrEnum": null
            }
          ],
          "return": {
            "type": "Ethereum_Network",
            "name": "getNetwork",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": null,
            "object": {
              "type": "Ethereum_Network",
              "name": "getNetwork",
              "required": true,
              "kind": 8192
            },
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        },
        {
          "type": "Method",
          "name": "requestAccounts",
          "required": true,
          "kind": 64,
          "arguments": [
            {
              "type": "Ethereum_Connection",
              "name": "connection",
              "required": null,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": null,
              "object": {
                "type": "Ethereum_Connection",
                "name": "connection",
                "required": null,
                "kind": 8192
              },
              "enum": null,
              "unresolvedObjectOrEnum": null
            }
          ],
          "return": {
            "type": "[String]",
            "name": "requestAccounts",
            "required": true,
            "kind": 34,
            "array": {
              "type": "[String]",
              "name": "requestAccounts",
              "required": true,
              "kind": 18,
              "array": null,
              "map": null,
              "scalar": {
                "type": "String",
                "name": "requestAccounts",
                "required": true,
                "kind": 4
              },
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null,
              "item": {
                "type": "String",
                "name": "requestAccounts",
                "required": true,
                "kind": 4
              }
            },
            "map": null,
            "scalar": null,
            "object": null,
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        },
        {
          "type": "Method",
          "name": "callContractMethod",
          "required": true,
          "kind": 64,
          "arguments": [
            {
              "type": "String",
              "name": "address",
              "required": true,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": {
                "type": "String",
                "name": "address",
                "required": true,
                "kind": 4
              },
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "String",
              "name": "method",
              "required": true,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": {
                "type": "String",
                "name": "method",
                "required": true,
                "kind": 4
              },
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "[String]",
              "name": "args",
              "required": null,
              "kind": 34,
              "array": {
                "type": "[String]",
                "name": "args",
                "required": null,
                "kind": 18,
                "array": null,
                "map": null,
                "scalar": {
                  "type": "String",
                  "name": "args",
                  "required": true,
                  "kind": 4
                },
                "object": null,
                "enum": null,
                "unresolvedObjectOrEnum": null,
                "item": {
                  "type": "String",
                  "name": "args",
                  "required": true,
                  "kind": 4
                }
              },
              "map": null,
              "scalar": null,
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "Ethereum_Connection",
              "name": "connection",
              "required": null,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": null,
              "object": {
                "type": "Ethereum_Connection",
                "name": "connection",
                "required": null,
                "kind": 8192
              },
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "Ethereum_TxOverrides",
              "name": "txOverrides",
              "required": null,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": null,
              "object": {
                "type": "Ethereum_TxOverrides",
                "name": "txOverrides",
                "required": null,
                "kind": 8192
              },
              "enum": null,
              "unresolvedObjectOrEnum": null
            }
          ],
          "return": {
            "type": "Ethereum_TxResponse",
            "name": "callContractMethod",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": null,
            "object": {
              "type": "Ethereum_TxResponse",
              "name": "callContractMethod",
              "required": true,
              "kind": 8192
            },
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        },
        {
          "type": "Method",
          "name": "callContractMethodAndWait",
          "required": true,
          "kind": 64,
          "arguments": [
            {
              "type": "String",
              "name": "address",
              "required": true,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": {
                "type": "String",
                "name": "address",
                "required": true,
                "kind": 4
              },
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "String",
              "name": "method",
              "required": true,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": {
                "type": "String",
                "name": "method",
                "required": true,
                "kind": 4
              },
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "[String]",
              "name": "args",
              "required": null,
              "kind": 34,
              "array": {
                "type": "[String]",
                "name": "args",
                "required": null,
                "kind": 18,
                "array": null,
                "map": null,
                "scalar": {
                  "type": "String",
                  "name": "args",
                  "required": true,
                  "kind": 4
                },
                "object": null,
                "enum": null,
                "unresolvedObjectOrEnum": null,
                "item": {
                  "type": "String",
                  "name": "args",
                  "required": true,
                  "kind": 4
                }
              },
              "map": null,
              "scalar": null,
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "Ethereum_Connection",
              "name": "connection",
              "required": null,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": null,
              "object": {
                "type": "Ethereum_Connection",
                "name": "connection",
                "required": null,
                "kind": 8192
              },
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "Ethereum_TxOverrides",
              "name": "txOverrides",
              "required": null,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": null,
              "object": {
                "type": "Ethereum_TxOverrides",
                "name": "txOverrides",
                "required": null,
                "kind": 8192
              },
              "enum": null,
              "unresolvedObjectOrEnum": null
            }
          ],
          "return": {
            "type": "Ethereum_TxReceipt",
            "name": "callContractMethodAndWait",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": null,
            "object": {
              "type": "Ethereum_TxReceipt",
              "name": "callContractMethodAndWait",
              "required": true,
              "kind": 8192
            },
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        },
        {
          "type": "Method",
          "name": "sendTransaction",
          "required": true,
          "kind": 64,
          "arguments": [
            {
              "type": "Ethereum_TxRequest",
              "name": "tx",
              "required": true,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": null,
              "object": {
                "type": "Ethereum_TxRequest",
                "name": "tx",
                "required": true,
                "kind": 8192
              },
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "Ethereum_Connection",
              "name": "connection",
              "required": null,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": null,
              "object": {
                "type": "Ethereum_Connection",
                "name": "connection",
                "required": null,
                "kind": 8192
              },
              "enum": null,
              "unresolvedObjectOrEnum": null
            }
          ],
          "return": {
            "type": "Ethereum_TxResponse",
            "name": "sendTransaction",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": null,
            "object": {
              "type": "Ethereum_TxResponse",
              "name": "sendTransaction",
              "required": true,
              "kind": 8192
            },
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        },
        {
          "type": "Method",
          "name": "sendTransactionAndWait",
          "required": true,
          "kind": 64,
          "arguments": [
            {
              "type": "Ethereum_TxRequest",
              "name": "tx",
              "required": true,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": null,
              "object": {
                "type": "Ethereum_TxRequest",
                "name": "tx",
                "required": true,
                "kind": 8192
              },
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "Ethereum_Connection",
              "name": "connection",
              "required": null,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": null,
              "object": {
                "type": "Ethereum_Connection",
                "name": "connection",
                "required": null,
                "kind": 8192
              },
              "enum": null,
              "unresolvedObjectOrEnum": null
            }
          ],
          "return": {
            "type": "Ethereum_TxReceipt",
            "name": "sendTransactionAndWait",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": null,
            "object": {
              "type": "Ethereum_TxReceipt",
              "name": "sendTransactionAndWait",
              "required": true,
              "kind": 8192
            },
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        },
        {
          "type": "Method",
          "name": "deployContract",
          "required": true,
          "kind": 64,
          "arguments": [
            {
              "type": "String",
              "name": "abi",
              "required": true,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": {
                "type": "String",
                "name": "abi",
                "required": true,
                "kind": 4
              },
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "String",
              "name": "bytecode",
              "required": true,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": {
                "type": "String",
                "name": "bytecode",
                "required": true,
                "kind": 4
              },
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "[String]",
              "name": "args",
              "required": null,
              "kind": 34,
              "array": {
                "type": "[String]",
                "name": "args",
                "required": null,
                "kind": 18,
                "array": null,
                "map": null,
                "scalar": {
                  "type": "String",
                  "name": "args",
                  "required": true,
                  "kind": 4
                },
                "object": null,
                "enum": null,
                "unresolvedObjectOrEnum": null,
                "item": {
                  "type": "String",
                  "name": "args",
                  "required": true,
                  "kind": 4
                }
              },
              "map": null,
              "scalar": null,
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "Ethereum_Connection",
              "name": "connection",
              "required": null,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": null,
              "object": {
                "type": "Ethereum_Connection",
                "name": "connection",
                "required": null,
                "kind": 8192
              },
              "enum": null,
              "unresolvedObjectOrEnum": null
            }
          ],
          "return": {
            "type": "String",
            "name": "deployContract",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": {
              "type": "String",
              "name": "deployContract",
              "required": true,
              "kind": 4
            },
            "object": null,
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        },
        {
          "type": "Method",
          "name": "signMessage",
          "required": true,
          "kind": 64,
          "arguments": [
            {
              "type": "String",
              "name": "message",
              "required": true,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": {
                "type": "String",
                "name": "message",
                "required": true,
                "kind": 4
              },
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "Ethereum_Connection",
              "name": "connection",
              "required": null,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": null,
              "object": {
                "type": "Ethereum_Connection",
                "name": "connection",
                "required": null,
                "kind": 8192
              },
              "enum": null,
              "unresolvedObjectOrEnum": null
            }
          ],
          "return": {
            "type": "String",
            "name": "signMessage",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": {
              "type": "String",
              "name": "signMessage",
              "required": true,
              "kind": 4
            },
            "object": null,
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        },
        {
          "type": "Method",
          "name": "sendRPC",
          "required": true,
          "kind": 64,
          "arguments": [
            {
              "type": "String",
              "name": "method",
              "required": true,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": {
                "type": "String",
                "name": "method",
                "required": true,
                "kind": 4
              },
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "[String]",
              "name": "params",
              "required": true,
              "kind": 34,
              "array": {
                "type": "[String]",
                "name": "params",
                "required": true,
                "kind": 18,
                "array": null,
                "map": null,
                "scalar": {
                  "type": "String",
                  "name": "params",
                  "required": true,
                  "kind": 4
                },
                "object": null,
                "enum": null,
                "unresolvedObjectOrEnum": null,
                "item": {
                  "type": "String",
                  "name": "params",
                  "required": true,
                  "kind": 4
                }
              },
              "map": null,
              "scalar": null,
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            },
            {
              "type": "Ethereum_Connection",
              "name": "connection",
              "required": null,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": null,
              "object": {
                "type": "Ethereum_Connection",
                "name": "connection",
                "required": null,
                "kind": 8192
              },
              "enum": null,
              "unresolvedObjectOrEnum": null
            }
          ],
          "return": {
            "type": "String",
            "name": "sendRPC",
            "required": null,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": {
              "type": "String",
              "name": "sendRPC",
              "required": null,
              "kind": 4
            },
            "object": null,
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        }
      ],
      "uri": "ens/ethereum.polywrap.eth",
      "namespace": "Ethereum",
      "nativeType": "Module",
      "isInterface": false
    }
  ],
  "importedEnumTypes": [],
  "importedEnvTypes": [],
  "moduleType": {
    "type": "Module",
    "name": null,
    "required": null,
    "kind": 128,
    "methods": [
      {
        "type": "Method",
        "name": "methodOne",
        "required": true,
        "kind": 64,
        "arguments": [
          {
            "type": "String",
            "name": "str",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": {
              "type": "String",
              "name": "str",
              "required": true,
              "kind": 4
            },
            "object": null,
            "enum": null,
            "unresolvedObjectOrEnum": null
          },
          {
            "type": "String",
            "name": "optStr",
            "required": null,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": {
              "type": "String",
              "name": "optStr",
              "required": null,
              "kind": 4
            },
            "object": null,
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        ],
        "return": {
          "type": "Object",
          "name": "methodOne",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": null,
          "object": {
            "type": "Object",
            "name": "methodOne",
            "required": true,
            "kind": 8192
          },
          "enum": null,
          "unresolvedObjectOrEnum": null
        }
      },
      {
        "type": "Method",
        "name": "methodTwo",
        "required": true,
        "kind": 64,
        "arguments": [
          {
            "type": "UInt32",
            "name": "arg",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": {
              "type": "UInt32",
              "name": "arg",
              "required": true,
              "kind": 4
            },
            "object": null,
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        ],
        "return": {
          "type": "String",
          "name": "methodTwo",
          "required": true,
          "kind": 34,
          "array": null,
          "map": null,
          "scalar": {
            "type": "String",
            "name": "methodTwo",
            "required": true,
            "kind": 4
          },
          "object": null,
          "enum": null,
          "unresolvedObjectOrEnum": null
        }
      }
    ],
    "imports": [
      {
        "type": "Ethereum_Module"
      },
      {
        "type": "Ethereum_Connection"
      },
      {
        "type": "Ethereum_TxOverrides"
      },
      {
        "type": "Ethereum_StaticTxResult"
      },
      {
        "type": "Ethereum_TxRequest"
      },
      {
        "type": "Ethereum_TxReceipt"
      },
      {
        "type": "Ethereum_Log"
      },
      {
        "type": "Ethereum_EventNotification"
      },
      {
        "type": "Ethereum_Network"
      },
      {
        "type": "Ethereum_TxResponse"
      },
      {
        "type": "Ethereum_Access"
      }
    ],
    "interfaces": []
  },
  "envType": {
    "type": "Env",
    "name": null,
    "required": null,
    "kind": 65536,
    "properties": [
      {
        "type": "String",
        "name": "arg1",
        "required": true,
        "kind": 34,
        "array": null,
        "map": null,
        "scalar": {
          "type": "String",
          "name": "arg1",
          "required": true,
          "kind": 4
        },
        "object": null,
        "enum": null,
        "unresolvedObjectOrEnum": null
      }
    ],
    "interfaces": []
  }
}
}
