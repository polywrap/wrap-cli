/**
* Ethereum Module
* @module ethereum_module
* 
*/

/**
* 
* @function module:method.awaitTransaction
* @param { String } txHash 
* @param { UInt32 } confirmations 
* @param { UInt32 } timeout 
* @param { Ethereum_Connection | null } connection 
* @returns { Ethereum_TxReceipt }
*/

/**
* 
* @function module:method.callContractMethod
* @param { String } address 
* @param { String } method 
* @param { String[] | null } args 
* @param { Ethereum_Connection | null } connection 
* @param { Ethereum_TxOverrides | null } txOverrides 
* @returns { Ethereum_TxResponse }
*/

/**
* 
* @function module:method.callContractMethodAndWait
* @param { String } address 
* @param { String } method 
* @param { String[] | null } args 
* @param { Ethereum_Connection | null } connection 
* @param { Ethereum_TxOverrides | null } txOverrides 
* @returns { Ethereum_TxReceipt }
*/

/**
* 
* @function module:method.callContractStatic
* @param { String } address 
* @param { String } method 
* @param { String[] | null } args 
* @param { Ethereum_Connection | null } connection 
* @param { Ethereum_TxOverrides | null } txOverrides 
* @returns { Ethereum_StaticTxResult }
*/

/**
* 
* @function module:method.callContractView
* @param { String } address 
* @param { String } method 
* @param { String[] | null } args 
* @param { Ethereum_Connection | null } connection 
* @returns { String }
*/

/**
* 
* @function module:method.checkAddress
* @param { String } address 
* @returns { Boolean }
*/

/**
* 
* @function module:method.deployContract
* @param { String } abi 
* @param { String } bytecode 
* @param { String[] | null } args 
* @param { Ethereum_Connection | null } connection 
* @returns { String }
*/

/**
* 
* @function module:method.encodeFunction
* @param { String } method 
* @param { String[] | null } args 
* @returns { String }
*/

/**
* 
* @function module:method.encodeParams
* @param { String[] } types 
* @param { String[] } values 
* @returns { String }
*/

/**
* 
* @function module:method.estimateContractCallGas
* @param { String } address 
* @param { String } method 
* @param { String[] | null } args 
* @param { Ethereum_Connection | null } connection 
* @param { Ethereum_TxOverrides | null } txOverrides 
* @returns { BigInt }
*/

/**
* 
* @function module:method.estimateTransactionGas
* @param { Ethereum_TxRequest } tx 
* @param { Ethereum_Connection | null } connection 
* @returns { BigInt }
*/

/**
* 
* @function module:method.getBalance
* @param { String } address 
* @param { BigInt | null } blockTag 
* @param { Ethereum_Connection | null } connection 
* @returns { BigInt }
*/

/**
* 
* @function module:method.getGasPrice
* @param { Ethereum_Connection | null } connection 
* @returns { BigInt }
*/

/**
* 
* @function module:method.getNetwork
* @param { Ethereum_Connection | null } connection 
* @returns { Ethereum_Network }
*/

/**
* 
* @function module:method.getSignerAddress
* @param { Ethereum_Connection | null } connection 
* @returns { String }
*/

/**
* 
* @function module:method.getSignerBalance
* @param { BigInt | null } blockTag 
* @param { Ethereum_Connection | null } connection 
* @returns { BigInt }
*/

/**
* 
* @function module:method.getSignerTransactionCount
* @param { BigInt | null } blockTag 
* @param { Ethereum_Connection | null } connection 
* @returns { BigInt }
*/

/**
* 
* @function module:method.sendRPC
* @param { String } method 
* @param { String[] } params 
* @param { Ethereum_Connection | null } connection 
* @returns { String }
*/

/**
* 
* @function module:method.sendTransaction
* @param { Ethereum_TxRequest } tx 
* @param { Ethereum_Connection | null } connection 
* @returns { Ethereum_TxResponse }
*/

/**
* 
* @function module:method.sendTransactionAndWait
* @param { Ethereum_TxRequest } tx 
* @param { Ethereum_Connection | null } connection 
* @returns { Ethereum_TxReceipt }
*/

/**
* 
* @function module:method.signMessage
* @param { String } message 
* @param { Ethereum_Connection | null } connection 
* @returns { String }
*/

/**
* 
* @function module:method.solidityKeccak256
* @param { String[] } types 
* @param { String[] } values 
* @returns { String }
*/

/**
* 
* @function module:method.solidityPack
* @param { String[] } types 
* @param { String[] } values 
* @returns { String }
*/

/**
* 
* @function module:method.soliditySha256
* @param { String[] } types 
* @param { String[] } values 
* @returns { String }
*/

/**
* 
* @function module:method.toEth
* @param { BigInt } wei 
* @returns { String }
*/

/**
* 
* @function module:method.toWei
* @param { String } eth 
* @returns { BigInt }
*/

/**
* 
* @function module:method.waitForEvent
* @param { String } address 
* @param { String } event 
* @param { String[] | null } args 
* @param { UInt32 | null } timeout 
* @param { Ethereum_Connection | null } connection 
* @returns { Ethereum_EventNotification }
*/

