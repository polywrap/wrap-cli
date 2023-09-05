package io.template.polywrap

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import io.template.myapplication.ui.theme.MyApplicationTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MyApplicationTheme {
                Column(
                    verticalArrangement = Arrangement.Center,
                    modifier = Modifier.fillMaxHeight().padding(16.dp)
                ) {
                    Surface(
                        modifier = Modifier.fillMaxWidth().height(60.dp),
                        color = MaterialTheme.colorScheme.background
                    ) {
                        PolywrapDemo()
                    }
                }
            }
        }
    }
}

@Composable
fun PolywrapDemo(demoViewModel: PolywrapDemoViewModel = viewModel()) {
    Button(onClick = { demoViewModel.polywrapDemo() }) {
        Text(text = "Click here and check the logs!")
    }
}

@Preview(showBackground = true)
@Composable
fun PolywrapDemoPreview() {
    MyApplicationTheme {
        PolywrapDemo()
    }
}