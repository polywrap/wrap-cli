import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.serialization")
    id("com.github.node-gradle.node")
}

android {
    namespace = "io.template.polywrap"
    compileSdk = 33

    defaultConfig {
        applicationId = "io.template.polywrap"
        minSdk = 24
        targetSdk = 33
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.4.8"
    }
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    // polywrap client
    implementation("io.polywrap:polywrap-client:0.11.0-SNAPSHOT")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-core:1.5.1")
    // polywrap logger plugin
    implementation("io.polywrap.plugins:logger:0.10.2")
    implementation("com.github.tony19:logback-android:3.0.0")

    // ui
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.6.1")

    // defaults
    implementation("androidx.core:core-ktx:1.10.1")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.6.1")
    implementation("androidx.activity:activity-compose:1.7.2")
    implementation(platform("androidx.compose:compose-bom:2023.03.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
    androidTestImplementation(platform("androidx.compose:compose-bom:2023.03.00"))
    androidTestImplementation("androidx.compose.ui:ui-test-junit4")
    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}

// set up NodeJS to run the Polywrap CLI
// NodeJS installation will be stored in gradle cache
node {
    val nullString: String? = null
    distBaseUrl.set(nullString)
    // Whether to download and install a specific Node.js version or not
    // If false, it will use the globally installed Node.js
    // If true, it will download node using above parameters
    // Note that npm is bundled with Node.js
    download.set(true)
}

tasks.register<com.github.gradle.node.npm.task.NpxTask>("codegen") {
    group = "polywrap"
    dependsOn(tasks.npmInstall)
    command.set("polywrap")
    args.set(listOf("codegen",
        "-m", "$rootDir/polywrap.yaml",
        "-g", "$projectDir/src/main/java/wrap"
    ))
}

tasks.withType<KotlinCompile> { dependsOn("codegen") }