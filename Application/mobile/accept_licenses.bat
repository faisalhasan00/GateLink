@echo off
set JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.20.8-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%
set SDKMANAGER=C:\Users\faiza\AppData\Local\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat
set ANDROID_SDK_ROOT=C:\Users\faiza\AppData\Local\Android\Sdk

echo Accepting all Android SDK licenses...
(
echo y
echo y
echo y
echo y
echo y
echo y
echo y
echo y
echo y
echo y
) | %SDKMANAGER% --licenses --sdk_root=%ANDROID_SDK_ROOT%

echo.
echo Done!
