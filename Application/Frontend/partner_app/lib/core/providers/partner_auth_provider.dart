import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

class PartnerUser {
  final String uid;
  final String name;
  final String phone;
  final String email;
  final String category;
  final String upiId;
  final String city;

  PartnerUser({
    required this.uid,
    required this.name,
    required this.phone,
    required this.email,
    required this.category,
    required this.upiId,
    required this.city,
  });

  Map<String, String> toMap() => {
    'uid': uid,
    'name': name,
    'phone': phone,
    'email': email,
    'category': category,
    'upiId': upiId,
    'city': city,
  };
}

class PartnerAuthNotifier extends StateNotifier<PartnerUser?> {
  PartnerAuthNotifier() : super(null) {
    _loadFromPrefs();
  }

  Future<void> _loadFromPrefs() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final name = prefs.getString('partner_name');
      final phone = prefs.getString('partner_phone') ?? '';
      final email = prefs.getString('partner_email') ?? '';
      if (name != null && name.isNotEmpty && (phone.isNotEmpty || email.isNotEmpty)) {
        state = PartnerUser(
          uid: prefs.getString('partner_uid') ?? 'PARTNER-${DateTime.now().millisecondsSinceEpoch}',
          name: name,
          phone: phone,
          email: email,
          category: prefs.getString('partner_category') ?? 'Channel Partner',
          upiId: prefs.getString('partner_upi') ?? '',
          city: prefs.getString('partner_city') ?? 'Hyderabad',
        );
      }
    } catch (_) {}
  }

  Future<void> loginOrRegister({
    required String name,
    required String phone,
    required String email,
    required String category,
    required String upiId,
    required String city,
  }) async {
    final user = PartnerUser(
      uid: 'PARTNER-${DateTime.now().millisecondsSinceEpoch.toString().substring(5)}',
      name: name,
      phone: phone,
      email: email,
      category: category,
      upiId: upiId,
      city: city,
    );

    state = user;

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('partner_uid', user.uid);
      await prefs.setString('partner_name', user.name);
      await prefs.setString('partner_phone', user.phone);
      await prefs.setString('partner_email', user.email);
      await prefs.setString('partner_category', user.category);
      await prefs.setString('partner_upi', user.upiId);
      await prefs.setString('partner_city', user.city);
    } catch (_) {}
  }

  Future<void> updateProfile({
    required String name,
    required String category,
    required String upiId,
    required String email,
    required String city,
  }) async {
    if (state == null) return;
    final updated = PartnerUser(
      uid: state!.uid,
      name: name,
      phone: state!.phone,
      email: email,
      category: category,
      upiId: upiId,
      city: city,
    );
    state = updated;

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('partner_name', name);
      await prefs.setString('partner_category', category);
      await prefs.setString('partner_upi', upiId);
      await prefs.setString('partner_email', email);
      await prefs.setString('partner_city', city);
    } catch (_) {}
  }

  Future<void> logout() async {
    state = null;
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.clear();
    } catch (_) {}
  }
}

final partnerAuthProvider = StateNotifierProvider<PartnerAuthNotifier, PartnerUser?>((ref) {
  return PartnerAuthNotifier();
});
