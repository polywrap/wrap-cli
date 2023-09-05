package io.template.polywrap

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import io.polywrap.client.PolywrapClient
import io.polywrap.configBuilder.polywrapClient
import io.polywrap.plugins.logger.loggerPlugin
import kotlinx.coroutines.launch
import wrap.Ethereum
import wrap.EthereumArgsEncodeParams
import wrap.Logging
import wrap.LoggingArgsLog
import wrap.LoggingLogLevel

class PolywrapDemoViewModel: ViewModel() {

    // we can create a custom client
    val loggerInterfaceUri = "wrapscan.io/polywrap/logger@1.0"
    private val client = polywrapClient {
        addDefaults()
        setPackage("plugin/logger" to loggerPlugin(null))
        addInterfaceImplementation(loggerInterfaceUri, "plugin/logger")
        setRedirect(loggerInterfaceUri to "plugin/logger")
    }

    // and use the custom client to create an SDK class instance
    private val logger = Logging(client)
    // the client can be shared across SDK instances
    private val ethereum = Ethereum(client)

    // Because their lifetimes are tied to the client, SDK instances work well as extension properties
    val PolywrapClient.eth
        get() = ethereum

    // or we can create an SDK class instance with a new client using default configuration
    private val defaultEth = Ethereum()

    fun polywrapDemo() = viewModelScope.launch {
        Log.i("polywrapDemo","Invoking: Logging.info(...)")

        logger.log(LoggingArgsLog(LoggingLogLevel.INFO, "Hello there")).getOrThrow()
        logger.log(LoggingArgsLog(LoggingLogLevel.INFO, "Hello again")).getOrThrow()
        logger.log(LoggingArgsLog(LoggingLogLevel.INFO, "One last time...")).getOrThrow()

        Log.i("polywrapDemo","Invoking: Ethereum.encodeParams(...)")

        val encodeArgs = EthereumArgsEncodeParams(
            types = listOf("address", "uint256"),
            values = listOf("0xB1B7586656116D546033e3bAFF69BFcD6592225E", "500")
        )
        val result = client.eth.encodeParams(encodeArgs)

        if (result.isSuccess) {
            println("Ethereum.encodeParams:\n${result.getOrThrow()}")
        } else {
            println("Error - Ethereum.encodeParams:\n${result.exceptionOrNull()}")
        }
    }

    override fun onCleared() {
        super.onCleared()
        // remember to close clients to prevent memory leaks when you're done using them
        client.close()
        defaultEth.client.close()
    }
}


