enum AppLanguage {
  english(code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧'),
  hindi(code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳'),
  telugu(code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳');

  final String code;
  final String name;
  final String nativeName;
  final String flag;

  const AppLanguage({
    required this.code,
    required this.name,
    required this.nativeName,
    required this.flag,
  });

  static AppLanguage fromCode(String? code) {
    switch (code?.toLowerCase()) {
      case 'hi':
        return AppLanguage.hindi;
      case 'te':
        return AppLanguage.telugu;
      default:
        return AppLanguage.english;
    }
  }
}
