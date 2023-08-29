package io.template.polywrap

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.lifecycle.viewmodel.compose.viewModel
import io.template.myapplication.ui.theme.MyApplicationTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MyApplicationTheme {
                // A surface container using the 'background' color from the theme
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    PolywrapDemo()
                }
            }
        }
    }
}

@Composable
fun PolywrapDemo(demoViewModel: PolywrapDemoViewModel = viewModel()) {
    Button(onClick = { demoViewModel.polywrapDemo() }) {
        Text(text = "Hello Polywrap!")
    }
}

@Preview(showBackground = true)
@Composable
fun PolywrapDemoPreview() {
    MyApplicationTheme {
        PolywrapDemo()
    }
}