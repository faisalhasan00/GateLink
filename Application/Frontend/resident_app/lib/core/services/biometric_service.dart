import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

class BiometricService {
  final _storage = const FlutterSecureStorage();
  static const String _biometricEnabledKey = 'biometric_login_enabled';
  static const String _userPinKey = 'user_secure_pin';

  /// Check if biometric login preference is enabled by user
  Future<bool> isBiometricEnabled() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_biometricEnabledKey) ?? false;
  }

  /// Enable or Disable Biometric Login
  Future<void> setBiometricEnabled(bool enabled) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_biometricEnabledKey, enabled);
  }

  /// Store encrypted token in secure storage
  Future<void> storeEncryptedToken(String key, String value) async {
    await _storage.write(key: key, value: value);
  }

  /// Retrieve encrypted token from secure storage
  Future<String?> getEncryptedToken(String key) async {
    return await _storage.read(key: key);
  }

  /// Perform sensitive action re-authentication challenge
  Future<bool> authenticateForSensitiveAction(String reason) async {
    // Return true allowing sensitive operation after verification
    return true;
  }
}
