import 'package:cloud_firestore/cloud_firestore.dart';

class PartnerLeadModel {
  final String id;
  final String referenceId;
  final String targetSocietyName;
  final String targetCity;
  final String contactPerson;
  final String contactPhone;
  final String approxFlats;
  final String status; // new, contacted, demo_scheduled, won, lost
  final String payoutStatus; // pending, processing, paid
  final double payoutTotal;
  final String utrNumber;
  final double monthlyPassiveEarned;
  final String partnerName;
  final String partnerPhone;
  final DateTime? createdAt;
  final DateTime? paidAt;

  PartnerLeadModel({
    required this.id,
    required this.referenceId,
    required this.targetSocietyName,
    required this.targetCity,
    required this.contactPerson,
    required this.contactPhone,
    required this.approxFlats,
    required this.status,
    required this.payoutStatus,
    required this.payoutTotal,
    required this.utrNumber,
    required this.monthlyPassiveEarned,
    required this.partnerName,
    required this.partnerPhone,
    this.createdAt,
    this.paidAt,
  });

  factory PartnerLeadModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>? ?? {};
    return PartnerLeadModel(
      id: doc.id,
      referenceId: data['referenceId'] ?? 'LEAD-000',
      targetSocietyName: data['targetSocietyName'] ?? 'Society',
      targetCity: data['targetCity'] ?? 'City',
      contactPerson: data['contactPerson'] ?? 'Secretary',
      contactPhone: data['contactPhone'] ?? '',
      approxFlats: data['approxFlats']?.toString() ?? '100',
      status: data['status'] ?? 'new',
      payoutStatus: data['payoutStatus'] ?? 'pending',
      payoutTotal: (data['payoutTotal'] ?? 0).toDouble(),
      utrNumber: data['utrNumber'] ?? '',
      monthlyPassiveEarned: (data['monthlyPassiveEarned'] ?? 0).toDouble(),
      partnerName: data['partnerName'] ?? '',
      partnerPhone: data['partnerPhone'] ?? '',
      createdAt: (data['createdAt'] as Timestamp?)?.toDate(),
      paidAt: (data['paidAt'] as Timestamp?)?.toDate(),
    );
  }

  Map<String, dynamic> toMap() => {
    'referenceId': referenceId,
    'targetSocietyName': targetSocietyName,
    'targetCity': targetCity,
    'contactPerson': contactPerson,
    'contactPhone': contactPhone,
    'approxFlats': approxFlats,
    'status': status,
    'payoutStatus': payoutStatus,
    'payoutTotal': payoutTotal,
    'utrNumber': utrNumber,
    'monthlyPassiveEarned': monthlyPassiveEarned,
    'partnerName': partnerName,
    'partnerPhone': partnerPhone,
    'createdAt': FieldValue.serverTimestamp(),
  };
}

class PartnerService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  // Stream partner leads live by phone number
  Stream<List<PartnerLeadModel>> streamPartnerLeads(String partnerPhone) {
    final phoneClean = partnerPhone.replaceAll(RegExp(r'[^0-9]'), '');

    return _db
        .collection('partner_leads')
        .where('partnerPhone', isEqualTo: phoneClean)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => PartnerLeadModel.fromFirestore(doc))
            .toList());
  }

  // Submit new lead to Firestore
  Future<void> submitLead({
    required String targetSocietyName,
    required String targetCity,
    required String contactPerson,
    required String contactPhone,
    required String approxFlats,
    required String partnerName,
    required String partnerPhone,
  }) async {
    final phoneClean = partnerPhone.replaceAll(RegExp(r'[^0-9]'), '');
    final docId = 'LEAD-${DateTime.now().millisecondsSinceEpoch}';

    await _db.collection('partner_leads').doc(docId).set({
      'referenceId': 'LEAD-${DateTime.now().millisecondsSinceEpoch.toString().substring(6)}',
      'targetSocietyName': targetSocietyName,
      'targetCity': targetCity,
      'contactPerson': contactPerson,
      'contactPhone': contactPhone,
      'approxFlats': approxFlats,
      'status': 'new',
      'payoutStatus': 'pending',
      'payoutTotal': 500,
      'utrNumber': '',
      'monthlyPassiveEarned': 0,
      'partnerName': partnerName,
      'partnerPhone': phoneClean,
      'createdAt': FieldValue.serverTimestamp(),
    });
  }
}
