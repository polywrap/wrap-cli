/**
* Ethereum Object Types
* @module Ethereum_objects
*/

/**
* 
* @typedef {Object} module:Ethereum_objects.Ethereum_Access
* 
* @property { String } address 
* @property { String[] } storageKeys 
*/

/**
* 
* @typedef {Object} module:Ethereum_objects.Ethereum_Connection
* 
* @property { String } node 
* @property { String } networkNameOrChainId 
*/

/**
* 
* @typedef {Object} module:Ethereum_objects.Ethereum_EventNotification
* 
* @property { String } data 
* @property { String } address 
* @property { Ethereum_Log } log 
*/

/**
* 
* @typedef {Object} module:Ethereum_objects.Ethereum_Log
* 
* @property { BigInt } blockNumber 
* @property { String } blockHash 
* @property { UInt32 } transactionIndex 
* @property { Boolean } removed 
* @property { String } address 
* @property { String } data 
* @property { String[] } topics 
* @property { String } transactionHash 
* @property { UInt32 } logIndex 
*/

/**
* 
* @typedef {Object} module:Ethereum_objects.Ethereum_Network
* 
* @property { String } name 
* @property { BigInt } chainId 
* @property { String } ensAddress 
*/

/**
* 
* @typedef {Object} module:Ethereum_objects.Ethereum_StaticTxResult
* 
* @property { String } result 
* @property { Boolean } error 
*/

/**
* 
* @typedef {Object} module:Ethereum_objects.Ethereum_TxOverrides
* 
* @property { BigInt } gasLimit 
* @property { BigInt } gasPrice 
* @property { BigInt } value 
*/

/**
* 
* @typedef {Object} module:Ethereum_objects.Ethereum_TxReceipt
* 
* @property { String } to 
* @property { String } from 
* @property { String } contractAddress 
* @property { UInt32 } transactionIndex 
* @property { String } root 
* @property { BigInt } gasUsed 
* @property { String } logsBloom 
* @property { String } transactionHash 
* @property { Ethereum_Log[] } logs 
* @property { BigInt } blockNumber 
* @property { String } blockHash 
* @property { UInt32 } confirmations 
* @property { BigInt } cumulativeGasUsed 
* @property { BigInt } effectiveGasPrice 
* @property { Boolean } byzantium 
* @property { UInt32 } type 
* @property { UInt32 } status 
*/

/**
* 
* @typedef {Object} module:Ethereum_objects.Ethereum_TxRequest
* 
* @property { String } to 
* @property { String } from 
* @property { UInt32 } nonce 
* @property { BigInt } gasLimit 
* @property { BigInt } gasPrice 
* @property { String } data 
* @property { BigInt } value 
* @property { BigInt } chainId 
* @property { UInt32 } type 
*/

/**
* 
* @typedef {Object} module:Ethereum_objects.Ethereum_TxResponse
* 
* @property { String } hash 
* @property { String } to 
* @property { String } from 
* @property { UInt32 } nonce 
* @property { BigInt } gasLimit 
* @property { BigInt } gasPrice 
* @property { String } data 
* @property { BigInt } value 
* @property { BigInt } chainId 
* @property { BigInt } blockNumber 
* @property { String } blockHash 
* @property { UInt32 } timestamp 
* @property { UInt32 } confirmations 
* @property { String } raw 
* @property { String } r 
* @property { String } s 
* @property { UInt32 } v 
* @property { UInt32 } type 
* @property { Ethereum_Access[] } accessList 
*/

