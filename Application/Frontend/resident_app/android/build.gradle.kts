allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

subprojects {
    project.evaluationDependsOn(":app")
}

subprojects {
    val p = this
    val applyCompileSdk = {
        if (p.plugins.hasPlugin("com.android.application") || p.plugins.hasPlugin("com.android.library")) {
            p.extensions.getByType(com.android.build.gradle.BaseExtension::class.java).compileSdkVersion(36)
        }
    }
    if (p.state.executed) {
        applyCompileSdk()
    } else {
        p.afterEvaluate { applyCompileSdk() }
    }
}

tasks.register<Delete>("clean") {
    delete(rootProject.layout.buildDirectory)
}
