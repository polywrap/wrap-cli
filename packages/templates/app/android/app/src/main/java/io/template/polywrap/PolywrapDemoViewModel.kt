package io.template.polywrap

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import io.polywrap.client.PolywrapClient
import io.polywrap.configBuilder.polywrapClient
import kotlinx.coroutines.launch
import wrap.Sha3
import wrap.Sha3ArgsSha3256

class PolywrapDemoViewModel: ViewModel() {

    private val sha3 = Sha3()

    fun polywrapDemo() = viewModelScope.launch {
        Log.i("polywrapDemo","Invoking: Logging.info(...)")

        val sha3Args = Sha3ArgsSha3256(
            message = "Hello Polywrap!"
        )
        val result = sha3.sha3_256(sha3Args)

        if (result.isSuccess) {
            println("Sha3.sha3_256:\n${result.getOrThrow()}")
        } else {
            println("Error - Sha3.sha3_256:\n${result.exceptionOrNull()}")
        }
    }

    override fun onCleared() {
        super.onCleared()
        // remember to close clients to prevent memory leaks when you're done using them
        client.close()
        defaultEth.client.close()
    }
}
