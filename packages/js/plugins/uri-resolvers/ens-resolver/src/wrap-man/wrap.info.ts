import { WrapManifest } from "@polywrap/wrap-manifest-types-js";

export const manifest: WrapManifest = {
  name: "EnsResolver",
  type: "plugin",
  version: "0.1",
  abi: {
    "version": "0.1",
    "importedObjectTypes": [
      {
        "type": "UriResolver_MaybeUriOrManifest",
        "kind": 1025,
        "properties": [
          {
            "type": "String",
            "name": "uri",
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "uri",
              "kind": 4
            },
          },
          {
            "type": "Bytes",
            "name": "manifest",
            "kind": 34,
            "scalar": {
              "type": "Bytes",
              "name": "manifest",
              "kind": 4
            },
          }
        ],
        "uri": "ens/uri-resolver.core.polywrap.eth",
        "namespace": "UriResolver",
        "nativeType": "MaybeUriOrManifest"
      },
      {
        "type": "Ethereum_Connection",
        "kind": 1025,
        "properties": [
          {
            "type": "String",
            "name": "node",
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "node",
              "kind": 4
            },
          },
          {
            "type": "String",
            "name": "networkNameOrChainId",
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "networkNameOrChainId",
              "kind": 4
            },
          }
        ],
        "uri": "ens/ethereum.polywrap.eth",
        "namespace": "Ethereum",
        "nativeType": "Connection"
      },
      {
        "type": "Ethereum_TxOverrides",
        "kind": 1025,
        "properties": [
          {
            "type": "BigInt",
            "name": "gasLimit",
            "kind": 34,
            "scalar": {
              "type": "BigInt",
              "name": "gasLimit",
              "kind": 4
            },
          },
          {
            "type": "BigInt",
            "name": "gasPrice",
            "kind": 34,
            "scalar": {
              "type": "BigInt",
              "name": "gasPrice",
              "kind": 4
            },
          },
          {
            "type": "BigInt",
            "name": "value",
            "kind": 34,
            "scalar": {
              "type": "BigInt",
              "name": "value",
              "kind": 4
            },
          }
        ],
        "uri": "ens/ethereum.polywrap.eth",
        "namespace": "Ethereum",
        "nativeType": "TxOverrides"
      },
      {
        "type": "Ethereum_StaticTxResult",
        "kind": 1025,
        "properties": [
          {
            "type": "String",
            "name": "result",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "result",
              "required": true,
              "kind": 4
            },
          },
          {
            "type": "Boolean",
            "name": "error",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "Boolean",
              "name": "error",
              "required": true,
              "kind": 4
            },
          }
        ],
        "uri": "ens/ethereum.polywrap.eth",
        "namespace": "Ethereum",
        "nativeType": "StaticTxResult"
      },
      {
        "type": "Ethereum_TxRequest",
        "kind": 1025,
        "properties": [
          {
            "type": "String",
            "name": "to",
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "to",
              "kind": 4
            },
          },
          {
            "type": "String",
            "name": "from",
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "from",
              "kind": 4
            },
          },
          {
            "type": "UInt32",
            "name": "nonce",
            "kind": 34,
            "scalar": {
              "type": "UInt32",
              "name": "nonce",
              "kind": 4
            },
          },
          {
            "type": "BigInt",
            "name": "gasLimit",
            "kind": 34,
            "scalar": {
              "type": "BigInt",
              "name": "gasLimit",
              "kind": 4
            },
          },
          {
            "type": "BigInt",
            "name": "gasPrice",
            "kind": 34,
            "scalar": {
              "type": "BigInt",
              "name": "gasPrice",
              "kind": 4
            },
          },
          {
            "type": "String",
            "name": "data",
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "data",
              "kind": 4
            },
          },
          {
            "type": "BigInt",
            "name": "value",
            "kind": 34,
            "scalar": {
              "type": "BigInt",
              "name": "value",
              "kind": 4
            },
          },
          {
            "type": "BigInt",
            "name": "chainId",
            "kind": 34,
            "scalar": {
              "type": "BigInt",
              "name": "chainId",
              "kind": 4
            },
          },
          {
            "type": "UInt32",
            "name": "type",
            "kind": 34,
            "scalar": {
              "type": "UInt32",
              "name": "type",
              "kind": 4
            },
          }
        ],
        "uri": "ens/ethereum.polywrap.eth",
        "namespace": "Ethereum",
        "nativeType": "TxRequest"
      },
      {
        "type": "Ethereum_TxReceipt",
        "kind": 1025,
        "properties": [
          {
            "type": "String",
            "name": "to",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "to",
              "required": true,
              "kind": 4
            },
          },
          {
            "type": "String",
            "name": "from",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "from",
              "required": true,
              "kind": 4
            },
          },
          {
            "type": "String",
            "name": "contractAddress",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "contractAddress",
              "required": true,
              "kind": 4
            },
          },
          {
            "type": "UInt32",
            "name": "transactionIndex",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "UInt32",
              "name": "transactionIndex",
              "required": true,
              "kind": 4
            },
          },
          {
            "type": "String",
            "name": "root",
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "root",
              "kind": 4
            },
          },
          {
            "type": "BigInt",
            "name": "gasUsed",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "BigInt",
              "name": "gasUsed",
              "required": true,
              "kind": 4
            },
          },
          {
            "type": "String",
            "name": "logsBloom",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "logsBloom",
              "required": true,
              "kind": 4
            },
          },
          {
            "type": "String",
            "name": "transactionHash",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "transactionHash",
              "required": true,
              "kind": 4
            },
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
              "object": {
                "type": "Ethereum_Log",
                "name": "logs",
                "required": true,
                "kind": 8192
              },
              "item": {
                "type": "Ethereum_Log",
                "name": "logs",
                "required": true,
                "kind": 8192
              }
            },
          },
          {
            "type": "BigInt",
            "name": "blockNumber",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "BigInt",
              "name": "blockNumber",
              "required": true,
              "kind": 4
            },
          },
          {
            "type": "String",
            "name": "blockHash",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "blockHash",
              "required": true,
              "kind": 4
            },
          },
          {
            "type": "UInt32",
            "name": "confirmations",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "UInt32",
              "name": "confirmations",
              "required": true,
              "kind": 4
            },
          },
          {
            "type": "BigInt",
            "name": "cumulativeGasUsed",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "BigInt",
              "name": "cumulativeGasUsed",
              "required": true,
              "kind": 4
            },
          },
          {
            "type": "BigInt",
            "name": "effectiveGasPrice",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "BigInt",
              "name": "effectiveGasPrice",
              "required": true,
              "kind": 4
            },
          },
          {
            "type": "Boolean",
            "name": "byzantium",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "Boolean",
              "name": "byzantium",
              "required": true,
              "kind": 4
            },
          },
          {
            "type": "UInt32",
            "name": "type",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "UInt32",
              "name": "type",
              "required": true,
              "kind": 4
            },
          },
          {
            "type": "UInt32",
            "name": "status",
            "kind": 34,
            "scalar": {
              "type": "UInt32",
              "name": "status",
              "kind": 4
            },
          }
        ],
        "uri": "ens/ethereum.polywrap.eth",
        "namespace": "Ethereum",
        "nativeType": "TxReceipt"
      },
      {
        "type": "Ethereum_Log",
        "kind": 1025,
        "properties": [
          {
            "type": "BigInt",
            "name": "blockNumber",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "BigInt",
              "name": "blockNumber",
              "required": true,
              "kind": 4
            },
          },
          {
            "type": "String",
            "name": "blockHash",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "blockHash",
              "required": true,
              "kind": 4
            },
          },
          {
            "type": "UInt32",
            "name": "transactionIndex",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "UInt32",
              "name": "transactionIndex",
              "required": true,
              "kind": 4
            },
          },
          {
            "type": "Boolean",
            "name": "removed",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "Boolean",
              "name": "removed",
              "required": true,
              "kind": 4
            },
          },
          {
            "type": "String",
            "name": "address",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "address",
              "required": true,
              "kind": 4
            },
          },
          {
            "type": "String",
            "name": "data",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "data",
              "required": true,
              "kind": 4
            },
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
              "scalar": {
                "type": "String",
                "name": "topics",
                "required": true,
                "kind": 4
              },
              "item": {
                "type": "String",
                "name": "topics",
                "required": true,
                "kind": 4
              }
            },
          },
          {
            "type": "String",
            "name": "transactionHash",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "transactionHash",
              "required": true,
              "kind": 4
            },
          },
          {
            "type": "UInt32",
            "name": "logIndex",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "UInt32",
              "name": "logIndex",
              "required": true,
              "kind": 4
            },
          }
        ],
        "uri": "ens/ethereum.polywrap.eth",
        "namespace": "Ethereum",
        "nativeType": "Log"
      },
      {
        "type": "Ethereum_EventNotification",
        "kind": 1025,
        "properties": [
          {
            "type": "String",
            "name": "data",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "data",
              "required": true,
              "kind": 4
            },
          },
          {
            "type": "String",
            "name": "address",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "address",
              "required": true,
              "kind": 4
            },
          },
          {
            "type": "Ethereum_Log",
            "name": "log",
            "required": true,
            "kind": 34,
            "object": {
              "type": "Ethereum_Log",
              "name": "log",
              "required": true,
              "kind": 8192
            },
          }
        ],
        "uri": "ens/ethereum.polywrap.eth",
        "namespace": "Ethereum",
        "nativeType": "EventNotification"
      },
      {
        "type": "Ethereum_Network",
        "kind": 1025,
        "properties": [
          {
            "type": "String",
            "name": "name",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "name",
              "required": true,
              "kind": 4
            },
          },
          {
            "type": "BigInt",
            "name": "chainId",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "BigInt",
              "name": "chainId",
              "required": true,
              "kind": 4
            },
          },
          {
            "type": "String",
            "name": "ensAddress",
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "ensAddress",
              "kind": 4
            },
          }
        ],
        "uri": "ens/ethereum.polywrap.eth",
        "namespace": "Ethereum",
        "nativeType": "Network"
      },
      {
        "type": "Ethereum_TxResponse",
        "kind": 1025,
        "properties": [
          {
            "type": "String",
            "name": "hash",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "hash",
              "required": true,
              "kind": 4
            },
          },
          {
            "type": "String",
            "name": "to",
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "to",
              "kind": 4
            },
          },
          {
            "type": "String",
            "name": "from",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "from",
              "required": true,
              "kind": 4
            },
          },
          {
            "type": "UInt32",
            "name": "nonce",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "UInt32",
              "name": "nonce",
              "required": true,
              "kind": 4
            },
          },
          {
            "type": "BigInt",
            "name": "gasLimit",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "BigInt",
              "name": "gasLimit",
              "required": true,
              "kind": 4
            },
          },
          {
            "type": "BigInt",
            "name": "gasPrice",
            "kind": 34,
            "scalar": {
              "type": "BigInt",
              "name": "gasPrice",
              "kind": 4
            },
          },
          {
            "type": "String",
            "name": "data",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "data",
              "required": true,
              "kind": 4
            },
          },
          {
            "type": "BigInt",
            "name": "value",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "BigInt",
              "name": "value",
              "required": true,
              "kind": 4
            },
          },
          {
            "type": "BigInt",
            "name": "chainId",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "BigInt",
              "name": "chainId",
              "required": true,
              "kind": 4
            },
          },
          {
            "type": "BigInt",
            "name": "blockNumber",
            "kind": 34,
            "scalar": {
              "type": "BigInt",
              "name": "blockNumber",
              "kind": 4
            },
          },
          {
            "type": "String",
            "name": "blockHash",
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "blockHash",
              "kind": 4
            },
          },
          {
            "type": "UInt32",
            "name": "timestamp",
            "kind": 34,
            "scalar": {
              "type": "UInt32",
              "name": "timestamp",
              "kind": 4
            },
          },
          {
            "type": "UInt32",
            "name": "confirmations",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "UInt32",
              "name": "confirmations",
              "required": true,
              "kind": 4
            },
          },
          {
            "type": "String",
            "name": "raw",
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "raw",
              "kind": 4
            },
          },
          {
            "type": "String",
            "name": "r",
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "r",
              "kind": 4
            },
          },
          {
            "type": "String",
            "name": "s",
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "s",
              "kind": 4
            },
          },
          {
            "type": "UInt32",
            "name": "v",
            "kind": 34,
            "scalar": {
              "type": "UInt32",
              "name": "v",
              "kind": 4
            },
          },
          {
            "type": "UInt32",
            "name": "type",
            "kind": 34,
            "scalar": {
              "type": "UInt32",
              "name": "type",
              "kind": 4
            },
          },
          {
            "type": "[Ethereum_Access]",
            "name": "accessList",
            "kind": 34,
            "array": {
              "type": "[Ethereum_Access]",
              "name": "accessList",
              "kind": 18,
              "object": {
                "type": "Ethereum_Access",
                "name": "accessList",
                "required": true,
                "kind": 8192
              },
              "item": {
                "type": "Ethereum_Access",
                "name": "accessList",
                "required": true,
                "kind": 8192
              }
            },
          }
        ],
        "uri": "ens/ethereum.polywrap.eth",
        "namespace": "Ethereum",
        "nativeType": "TxResponse"
      },
      {
        "type": "Ethereum_Access",
        "kind": 1025,
        "properties": [
          {
            "type": "String",
            "name": "address",
            "required": true,
            "kind": 34,
            "scalar": {
              "type": "String",
              "name": "address",
              "required": true,
              "kind": 4
            },
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
              "scalar": {
                "type": "String",
                "name": "storageKeys",
                "required": true,
                "kind": 4
              },
              "item": {
                "type": "String",
                "name": "storageKeys",
                "required": true,
                "kind": 4
              }
            },
          }
        ],
        "uri": "ens/ethereum.polywrap.eth",
        "namespace": "Ethereum",
        "nativeType": "Access"
      }
    ],
    "importedModuleTypes": [
      {
        "type": "UriResolver_Module",
        "kind": 256,
        "methods": [
          {
            "type": "Method",
            "name": "tryResolveUri",
            "required": true,
            "kind": 64,
            "arguments": [
              {
                "type": "String",
                "name": "authority",
                "required": true,
                "kind": 34,
                "scalar": {
                  "type": "String",
                  "name": "authority",
                  "required": true,
                  "kind": 4
                },
              },
              {
                "type": "String",
                "name": "path",
                "required": true,
                "kind": 34,
                "scalar": {
                  "type": "String",
                  "name": "path",
                  "required": true,
                  "kind": 4
                },
              }
            ],
            "return": {
              "type": "UriResolver_MaybeUriOrManifest",
              "name": "tryResolveUri",
              "kind": 34,
              "object": {
                "type": "UriResolver_MaybeUriOrManifest",
                "name": "tryResolveUri",
                "kind": 8192
              },
            }
          },
          {
            "type": "Method",
            "name": "getFile",
            "required": true,
            "kind": 64,
            "arguments": [
              {
                "type": "String",
                "name": "path",
                "required": true,
                "kind": 34,
                "scalar": {
                  "type": "String",
                  "name": "path",
                  "required": true,
                  "kind": 4
                },
              }
            ],
            "return": {
              "type": "Bytes",
              "name": "getFile",
              "kind": 34,
              "scalar": {
                "type": "Bytes",
                "name": "getFile",
                "kind": 4
              },
            }
          }
        ],
        "uri": "ens/uri-resolver.core.polywrap.eth",
        "namespace": "UriResolver",
        "nativeType": "Module",
        "isInterface": false
      },
      {
        "type": "Ethereum_Module",
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
                "scalar": {
                  "type": "String",
                  "name": "address",
                  "required": true,
                  "kind": 4
                },
              },
              {
                "type": "String",
                "name": "method",
                "required": true,
                "kind": 34,
                "scalar": {
                  "type": "String",
                  "name": "method",
                  "required": true,
                  "kind": 4
                },
              },
              {
                "type": "[String]",
                "name": "args",
                "kind": 34,
                "array": {
                  "type": "[String]",
                  "name": "args",
                  "kind": 18,
                  "scalar": {
                    "type": "String",
                    "name": "args",
                    "required": true,
                    "kind": 4
                  },
                  "item": {
                    "type": "String",
                    "name": "args",
                    "required": true,
                    "kind": 4
                  }
                },
              },
              {
                "type": "Ethereum_Connection",
                "name": "connection",
                "kind": 34,
                "object": {
                  "type": "Ethereum_Connection",
                  "name": "connection",
                  "kind": 8192
                },
              }
            ],
            "return": {
              "type": "String",
              "name": "callContractView",
              "required": true,
              "kind": 34,
              "scalar": {
                "type": "String",
                "name": "callContractView",
                "required": true,
                "kind": 4
              },
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
                "scalar": {
                  "type": "String",
                  "name": "address",
                  "required": true,
                  "kind": 4
                },
              },
              {
                "type": "String",
                "name": "method",
                "required": true,
                "kind": 34,
                "scalar": {
                  "type": "String",
                  "name": "method",
                  "required": true,
                  "kind": 4
                },
              },
              {
                "type": "[String]",
                "name": "args",
                "kind": 34,
                "array": {
                  "type": "[String]",
                  "name": "args",
                  "kind": 18,
                  "scalar": {
                    "type": "String",
                    "name": "args",
                    "required": true,
                    "kind": 4
                  },
                  "item": {
                    "type": "String",
                    "name": "args",
                    "required": true,
                    "kind": 4
                  }
                },
              },
              {
                "type": "Ethereum_Connection",
                "name": "connection",
                "kind": 34,
                "object": {
                  "type": "Ethereum_Connection",
                  "name": "connection",
                  "kind": 8192
                },
              },
              {
                "type": "Ethereum_TxOverrides",
                "name": "txOverrides",
                "kind": 34,
                "object": {
                  "type": "Ethereum_TxOverrides",
                  "name": "txOverrides",
                  "kind": 8192
                },
              }
            ],
            "return": {
              "type": "Ethereum_StaticTxResult",
              "name": "callContractStatic",
              "required": true,
              "kind": 34,
              "object": {
                "type": "Ethereum_StaticTxResult",
                "name": "callContractStatic",
                "required": true,
                "kind": 8192
              },
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
                "scalar": {
                  "type": "String",
                  "name": "address",
                  "required": true,
                  "kind": 4
                },
              },
              {
                "type": "BigInt",
                "name": "blockTag",
                "kind": 34,
                "scalar": {
                  "type": "BigInt",
                  "name": "blockTag",
                  "kind": 4
                },
              },
              {
                "type": "Ethereum_Connection",
                "name": "connection",
                "kind": 34,
                "object": {
                  "type": "Ethereum_Connection",
                  "name": "connection",
                  "kind": 8192
                },
              }
            ],
            "return": {
              "type": "BigInt",
              "name": "getBalance",
              "required": true,
              "kind": 34,
              "scalar": {
                "type": "BigInt",
                "name": "getBalance",
                "required": true,
                "kind": 4
              },
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
                  "scalar": {
                    "type": "String",
                    "name": "types",
                    "required": true,
                    "kind": 4
                  },
                  "item": {
                    "type": "String",
                    "name": "types",
                    "required": true,
                    "kind": 4
                  }
                },
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
                  "scalar": {
                    "type": "String",
                    "name": "values",
                    "required": true,
                    "kind": 4
                  },
                  "item": {
                    "type": "String",
                    "name": "values",
                    "required": true,
                    "kind": 4
                  }
                },
              }
            ],
            "return": {
              "type": "String",
              "name": "encodeParams",
              "required": true,
              "kind": 34,
              "scalar": {
                "type": "String",
                "name": "encodeParams",
                "required": true,
                "kind": 4
              },
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
                "scalar": {
                  "type": "String",
                  "name": "method",
                  "required": true,
                  "kind": 4
                },
              },
              {
                "type": "[String]",
                "name": "args",
                "kind": 34,
                "array": {
                  "type": "[String]",
                  "name": "args",
                  "kind": 18,
                  "scalar": {
                    "type": "String",
                    "name": "args",
                    "required": true,
                    "kind": 4
                  },
                  "item": {
                    "type": "String",
                    "name": "args",
                    "required": true,
                    "kind": 4
                  }
                },
              }
            ],
            "return": {
              "type": "String",
              "name": "encodeFunction",
              "required": true,
              "kind": 34,
              "scalar": {
                "type": "String",
                "name": "encodeFunction",
                "required": true,
                "kind": 4
              },
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
                  "scalar": {
                    "type": "String",
                    "name": "types",
                    "required": true,
                    "kind": 4
                  },
                  "item": {
                    "type": "String",
                    "name": "types",
                    "required": true,
                    "kind": 4
                  }
                },
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
                  "scalar": {
                    "type": "String",
                    "name": "values",
                    "required": true,
                    "kind": 4
                  },
                  "item": {
                    "type": "String",
                    "name": "values",
                    "required": true,
                    "kind": 4
                  }
                },
              }
            ],
            "return": {
              "type": "String",
              "name": "solidityPack",
              "required": true,
              "kind": 34,
              "scalar": {
                "type": "String",
                "name": "solidityPack",
                "required": true,
                "kind": 4
              },
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
                  "scalar": {
                    "type": "String",
                    "name": "types",
                    "required": true,
                    "kind": 4
                  },
                  "item": {
                    "type": "String",
                    "name": "types",
                    "required": true,
                    "kind": 4
                  }
                },
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
                  "scalar": {
                    "type": "String",
                    "name": "values",
                    "required": true,
                    "kind": 4
                  },
                  "item": {
                    "type": "String",
                    "name": "values",
                    "required": true,
                    "kind": 4
                  }
                },
              }
            ],
            "return": {
              "type": "String",
              "name": "solidityKeccak256",
              "required": true,
              "kind": 34,
              "scalar": {
                "type": "String",
                "name": "solidityKeccak256",
                "required": true,
                "kind": 4
              },
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
                  "scalar": {
                    "type": "String",
                    "name": "types",
                    "required": true,
                    "kind": 4
                  },
                  "item": {
                    "type": "String",
                    "name": "types",
                    "required": true,
                    "kind": 4
                  }
                },
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
                  "scalar": {
                    "type": "String",
                    "name": "values",
                    "required": true,
                    "kind": 4
                  },
                  "item": {
                    "type": "String",
                    "name": "values",
                    "required": true,
                    "kind": 4
                  }
                },
              }
            ],
            "return": {
              "type": "String",
              "name": "soliditySha256",
              "required": true,
              "kind": 34,
              "scalar": {
                "type": "String",
                "name": "soliditySha256",
                "required": true,
                "kind": 4
              },
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
                "kind": 34,
                "object": {
                  "type": "Ethereum_Connection",
                  "name": "connection",
                  "kind": 8192
                },
              }
            ],
            "return": {
              "type": "String",
              "name": "getSignerAddress",
              "required": true,
              "kind": 34,
              "scalar": {
                "type": "String",
                "name": "getSignerAddress",
                "required": true,
                "kind": 4
              },
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
                "kind": 34,
                "scalar": {
                  "type": "BigInt",
                  "name": "blockTag",
                  "kind": 4
                },
              },
              {
                "type": "Ethereum_Connection",
                "name": "connection",
                "kind": 34,
                "object": {
                  "type": "Ethereum_Connection",
                  "name": "connection",
                  "kind": 8192
                },
              }
            ],
            "return": {
              "type": "BigInt",
              "name": "getSignerBalance",
              "required": true,
              "kind": 34,
              "scalar": {
                "type": "BigInt",
                "name": "getSignerBalance",
                "required": true,
                "kind": 4
              },
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
                "kind": 34,
                "scalar": {
                  "type": "BigInt",
                  "name": "blockTag",
                  "kind": 4
                },
              },
              {
                "type": "Ethereum_Connection",
                "name": "connection",
                "kind": 34,
                "object": {
                  "type": "Ethereum_Connection",
                  "name": "connection",
                  "kind": 8192
                },
              }
            ],
            "return": {
              "type": "BigInt",
              "name": "getSignerTransactionCount",
              "required": true,
              "kind": 34,
              "scalar": {
                "type": "BigInt",
                "name": "getSignerTransactionCount",
                "required": true,
                "kind": 4
              },
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
                "kind": 34,
                "object": {
                  "type": "Ethereum_Connection",
                  "name": "connection",
                  "kind": 8192
                },
              }
            ],
            "return": {
              "type": "BigInt",
              "name": "getGasPrice",
              "required": true,
              "kind": 34,
              "scalar": {
                "type": "BigInt",
                "name": "getGasPrice",
                "required": true,
                "kind": 4
              },
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
                "object": {
                  "type": "Ethereum_TxRequest",
                  "name": "tx",
                  "required": true,
                  "kind": 8192
                },
              },
              {
                "type": "Ethereum_Connection",
                "name": "connection",
                "kind": 34,
                "object": {
                  "type": "Ethereum_Connection",
                  "name": "connection",
                  "kind": 8192
                },
              }
            ],
            "return": {
              "type": "BigInt",
              "name": "estimateTransactionGas",
              "required": true,
              "kind": 34,
              "scalar": {
                "type": "BigInt",
                "name": "estimateTransactionGas",
                "required": true,
                "kind": 4
              },
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
                "scalar": {
                  "type": "String",
                  "name": "address",
                  "required": true,
                  "kind": 4
                },
              },
              {
                "type": "String",
                "name": "method",
                "required": true,
                "kind": 34,
                "scalar": {
                  "type": "String",
                  "name": "method",
                  "required": true,
                  "kind": 4
                },
              },
              {
                "type": "[String]",
                "name": "args",
                "kind": 34,
                "array": {
                  "type": "[String]",
                  "name": "args",
                  "kind": 18,
                  "scalar": {
                    "type": "String",
                    "name": "args",
                    "required": true,
                    "kind": 4
                  },
                  "item": {
                    "type": "String",
                    "name": "args",
                    "required": true,
                    "kind": 4
                  }
                },
              },
              {
                "type": "Ethereum_Connection",
                "name": "connection",
                "kind": 34,
                "object": {
                  "type": "Ethereum_Connection",
                  "name": "connection",
                  "kind": 8192
                },
              },
              {
                "type": "Ethereum_TxOverrides",
                "name": "txOverrides",
                "kind": 34,
                "object": {
                  "type": "Ethereum_TxOverrides",
                  "name": "txOverrides",
                  "kind": 8192
                },
              }
            ],
            "return": {
              "type": "BigInt",
              "name": "estimateContractCallGas",
              "required": true,
              "kind": 34,
              "scalar": {
                "type": "BigInt",
                "name": "estimateContractCallGas",
                "required": true,
                "kind": 4
              },
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
                "scalar": {
                  "type": "String",
                  "name": "address",
                  "required": true,
                  "kind": 4
                },
              }
            ],
            "return": {
              "type": "Boolean",
              "name": "checkAddress",
              "required": true,
              "kind": 34,
              "scalar": {
                "type": "Boolean",
                "name": "checkAddress",
                "required": true,
                "kind": 4
              },
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
                "scalar": {
                  "type": "String",
                  "name": "eth",
                  "required": true,
                  "kind": 4
                },
              }
            ],
            "return": {
              "type": "BigInt",
              "name": "toWei",
              "required": true,
              "kind": 34,
              "scalar": {
                "type": "BigInt",
                "name": "toWei",
                "required": true,
                "kind": 4
              },
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
                "scalar": {
                  "type": "BigInt",
                  "name": "wei",
                  "required": true,
                  "kind": 4
                },
              }
            ],
            "return": {
              "type": "String",
              "name": "toEth",
              "required": true,
              "kind": 34,
              "scalar": {
                "type": "String",
                "name": "toEth",
                "required": true,
                "kind": 4
              },
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
                "scalar": {
                  "type": "String",
                  "name": "txHash",
                  "required": true,
                  "kind": 4
                },
              },
              {
                "type": "UInt32",
                "name": "confirmations",
                "required": true,
                "kind": 34,
                "scalar": {
                  "type": "UInt32",
                  "name": "confirmations",
                  "required": true,
                  "kind": 4
                },
              },
              {
                "type": "UInt32",
                "name": "timeout",
                "required": true,
                "kind": 34,
                "scalar": {
                  "type": "UInt32",
                  "name": "timeout",
                  "required": true,
                  "kind": 4
                },
              },
              {
                "type": "Ethereum_Connection",
                "name": "connection",
                "kind": 34,
                "object": {
                  "type": "Ethereum_Connection",
                  "name": "connection",
                  "kind": 8192
                },
              }
            ],
            "return": {
              "type": "Ethereum_TxReceipt",
              "name": "awaitTransaction",
              "required": true,
              "kind": 34,
              "object": {
                "type": "Ethereum_TxReceipt",
                "name": "awaitTransaction",
                "required": true,
                "kind": 8192
              },
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
                "scalar": {
                  "type": "String",
                  "name": "address",
                  "required": true,
                  "kind": 4
                },
              },
              {
                "type": "String",
                "name": "event",
                "required": true,
                "kind": 34,
                "scalar": {
                  "type": "String",
                  "name": "event",
                  "required": true,
                  "kind": 4
                },
              },
              {
                "type": "[String]",
                "name": "args",
                "kind": 34,
                "array": {
                  "type": "[String]",
                  "name": "args",
                  "kind": 18,
                  "scalar": {
                    "type": "String",
                    "name": "args",
                    "required": true,
                    "kind": 4
                  },
                  "item": {
                    "type": "String",
                    "name": "args",
                    "required": true,
                    "kind": 4
                  }
                },
              },
              {
                "type": "UInt32",
                "name": "timeout",
                "kind": 34,
                "scalar": {
                  "type": "UInt32",
                  "name": "timeout",
                  "kind": 4
                },
              },
              {
                "type": "Ethereum_Connection",
                "name": "connection",
                "kind": 34,
                "object": {
                  "type": "Ethereum_Connection",
                  "name": "connection",
                  "kind": 8192
                },
              }
            ],
            "return": {
              "type": "Ethereum_EventNotification",
              "name": "waitForEvent",
              "required": true,
              "kind": 34,
              "object": {
                "type": "Ethereum_EventNotification",
                "name": "waitForEvent",
                "required": true,
                "kind": 8192
              },
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
                "kind": 34,
                "object": {
                  "type": "Ethereum_Connection",
                  "name": "connection",
                  "kind": 8192
                },
              }
            ],
            "return": {
              "type": "Ethereum_Network",
              "name": "getNetwork",
              "required": true,
              "kind": 34,
              "object": {
                "type": "Ethereum_Network",
                "name": "getNetwork",
                "required": true,
                "kind": 8192
              },
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
                "scalar": {
                  "type": "String",
                  "name": "address",
                  "required": true,
                  "kind": 4
                },
              },
              {
                "type": "String",
                "name": "method",
                "required": true,
                "kind": 34,
                "scalar": {
                  "type": "String",
                  "name": "method",
                  "required": true,
                  "kind": 4
                },
              },
              {
                "type": "[String]",
                "name": "args",
                "kind": 34,
                "array": {
                  "type": "[String]",
                  "name": "args",
                  "kind": 18,
                  "scalar": {
                    "type": "String",
                    "name": "args",
                    "required": true,
                    "kind": 4
                  },
                  "item": {
                    "type": "String",
                    "name": "args",
                    "required": true,
                    "kind": 4
                  }
                },
              },
              {
                "type": "Ethereum_Connection",
                "name": "connection",
                "kind": 34,
                "object": {
                  "type": "Ethereum_Connection",
                  "name": "connection",
                  "kind": 8192
                },
              },
              {
                "type": "Ethereum_TxOverrides",
                "name": "txOverrides",
                "kind": 34,
                "object": {
                  "type": "Ethereum_TxOverrides",
                  "name": "txOverrides",
                  "kind": 8192
                },
              }
            ],
            "return": {
              "type": "Ethereum_TxResponse",
              "name": "callContractMethod",
              "required": true,
              "kind": 34,
              "object": {
                "type": "Ethereum_TxResponse",
                "name": "callContractMethod",
                "required": true,
                "kind": 8192
              },
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
                "scalar": {
                  "type": "String",
                  "name": "address",
                  "required": true,
                  "kind": 4
                },
              },
              {
                "type": "String",
                "name": "method",
                "required": true,
                "kind": 34,
                "scalar": {
                  "type": "String",
                  "name": "method",
                  "required": true,
                  "kind": 4
                },
              },
              {
                "type": "[String]",
                "name": "args",
                "kind": 34,
                "array": {
                  "type": "[String]",
                  "name": "args",
                  "kind": 18,
                  "scalar": {
                    "type": "String",
                    "name": "args",
                    "required": true,
                    "kind": 4
                  },
                  "item": {
                    "type": "String",
                    "name": "args",
                    "required": true,
                    "kind": 4
                  }
                },
              },
              {
                "type": "Ethereum_Connection",
                "name": "connection",
                "kind": 34,
                "object": {
                  "type": "Ethereum_Connection",
                  "name": "connection",
                  "kind": 8192
                },
              },
              {
                "type": "Ethereum_TxOverrides",
                "name": "txOverrides",
                "kind": 34,
                "object": {
                  "type": "Ethereum_TxOverrides",
                  "name": "txOverrides",
                  "kind": 8192
                },
              }
            ],
            "return": {
              "type": "Ethereum_TxReceipt",
              "name": "callContractMethodAndWait",
              "required": true,
              "kind": 34,
              "object": {
                "type": "Ethereum_TxReceipt",
                "name": "callContractMethodAndWait",
                "required": true,
                "kind": 8192
              },
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
                "object": {
                  "type": "Ethereum_TxRequest",
                  "name": "tx",
                  "required": true,
                  "kind": 8192
                },
              },
              {
                "type": "Ethereum_Connection",
                "name": "connection",
                "kind": 34,
                "object": {
                  "type": "Ethereum_Connection",
                  "name": "connection",
                  "kind": 8192
                },
              }
            ],
            "return": {
              "type": "Ethereum_TxResponse",
              "name": "sendTransaction",
              "required": true,
              "kind": 34,
              "object": {
                "type": "Ethereum_TxResponse",
                "name": "sendTransaction",
                "required": true,
                "kind": 8192
              },
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
                "object": {
                  "type": "Ethereum_TxRequest",
                  "name": "tx",
                  "required": true,
                  "kind": 8192
                },
              },
              {
                "type": "Ethereum_Connection",
                "name": "connection",
                "kind": 34,
                "object": {
                  "type": "Ethereum_Connection",
                  "name": "connection",
                  "kind": 8192
                },
              }
            ],
            "return": {
              "type": "Ethereum_TxReceipt",
              "name": "sendTransactionAndWait",
              "required": true,
              "kind": 34,
              "object": {
                "type": "Ethereum_TxReceipt",
                "name": "sendTransactionAndWait",
                "required": true,
                "kind": 8192
              },
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
                "scalar": {
                  "type": "String",
                  "name": "abi",
                  "required": true,
                  "kind": 4
                },
              },
              {
                "type": "String",
                "name": "bytecode",
                "required": true,
                "kind": 34,
                "scalar": {
                  "type": "String",
                  "name": "bytecode",
                  "required": true,
                  "kind": 4
                },
              },
              {
                "type": "[String]",
                "name": "args",
                "kind": 34,
                "array": {
                  "type": "[String]",
                  "name": "args",
                  "kind": 18,
                  "scalar": {
                    "type": "String",
                    "name": "args",
                    "required": true,
                    "kind": 4
                  },
                  "item": {
                    "type": "String",
                    "name": "args",
                    "required": true,
                    "kind": 4
                  }
                },
              },
              {
                "type": "Ethereum_Connection",
                "name": "connection",
                "kind": 34,
                "object": {
                  "type": "Ethereum_Connection",
                  "name": "connection",
                  "kind": 8192
                },
              }
            ],
            "return": {
              "type": "String",
              "name": "deployContract",
              "required": true,
              "kind": 34,
              "scalar": {
                "type": "String",
                "name": "deployContract",
                "required": true,
                "kind": 4
              },
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
                "scalar": {
                  "type": "String",
                  "name": "message",
                  "required": true,
                  "kind": 4
                },
              },
              {
                "type": "Ethereum_Connection",
                "name": "connection",
                "kind": 34,
                "object": {
                  "type": "Ethereum_Connection",
                  "name": "connection",
                  "kind": 8192
                },
              }
            ],
            "return": {
              "type": "String",
              "name": "signMessage",
              "required": true,
              "kind": 34,
              "scalar": {
                "type": "String",
                "name": "signMessage",
                "required": true,
                "kind": 4
              },
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
                "scalar": {
                  "type": "String",
                  "name": "method",
                  "required": true,
                  "kind": 4
                },
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
                  "scalar": {
                    "type": "String",
                    "name": "params",
                    "required": true,
                    "kind": 4
                  },
                  "item": {
                    "type": "String",
                    "name": "params",
                    "required": true,
                    "kind": 4
                  }
                },
              },
              {
                "type": "Ethereum_Connection",
                "name": "connection",
                "kind": 34,
                "object": {
                  "type": "Ethereum_Connection",
                  "name": "connection",
                  "kind": 8192
                },
              }
            ],
            "return": {
              "type": "String",
              "name": "sendRPC",
              "kind": 34,
              "scalar": {
                "type": "String",
                "name": "sendRPC",
                "kind": 4
              },
            }
          }
        ],
        "uri": "ens/ethereum.polywrap.eth",
        "namespace": "Ethereum",
        "nativeType": "Module",
        "isInterface": false
      }
    ],
    "moduleType": {
      "type": "Module",
      "kind": 128,
      "methods": [
        {
          "type": "Method",
          "name": "tryResolveUri",
          "required": true,
          "kind": 64,
          "arguments": [
            {
              "type": "String",
              "name": "authority",
              "required": true,
              "kind": 34,
              "scalar": {
                "type": "String",
                "name": "authority",
                "required": true,
                "kind": 4
              },
            },
            {
              "type": "String",
              "name": "path",
              "required": true,
              "kind": 34,
              "scalar": {
                "type": "String",
                "name": "path",
                "required": true,
                "kind": 4
              },
            }
          ],
          "return": {
            "type": "UriResolver_MaybeUriOrManifest",
            "name": "tryResolveUri",
            "kind": 34,
            "object": {
              "type": "UriResolver_MaybeUriOrManifest",
              "name": "tryResolveUri",
              "kind": 8192
            },
          }
        },
        {
          "type": "Method",
          "name": "getFile",
          "required": true,
          "kind": 64,
          "arguments": [
            {
              "type": "String",
              "name": "path",
              "required": true,
              "kind": 34,
              "scalar": {
                "type": "String",
                "name": "path",
                "required": true,
                "kind": 4
              },
            }
          ],
          "return": {
            "type": "Bytes",
            "name": "getFile",
            "kind": 34,
            "scalar": {
              "type": "Bytes",
              "name": "getFile",
              "kind": 4
            },
          }
        }
      ],
      "imports": [
        {
          "type": "UriResolver_Module"
        },
        {
          "type": "UriResolver_MaybeUriOrManifest"
        },
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
      "interfaces": [
        {
          "type": "UriResolver_Module",
          "kind": 2048,
        }
      ]
    }
  }
}