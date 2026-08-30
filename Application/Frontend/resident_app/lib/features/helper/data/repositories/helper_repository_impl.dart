import 'package:cloud_firestore/cloud_firestore.dart';
import '../../domain/models/helper_attendance_day.dart';
import '../../domain/models/helper_log_model.dart';
import '../../domain/models/helper_model.dart';
import '../../domain/models/helper_salary_record.dart';
import '../../domain/repositories/helper_repository.dart';

class HelperRepositoryImpl implements HelperRepository {
  final FirebaseFirestore _firestore;

  HelperRepositoryImpl([FirebaseFirestore? firestore])
      : _firestore = firestore ?? FirebaseFirestore.instance;

  @override
  Stream<List<HelperModel>> watchMyHelpers(
      String societyId, String residentUid) {
    if (societyId.isEmpty || residentUid.isEmpty) return Stream.value([]);

    return _firestore
        .collection('societies/$societyId/helpers')
        .where('residentUid', isEqualTo: residentUid)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs.map((doc) {
        final data = doc.data();
        data['societyId'] = societyId;
        return HelperModel.fromMap(data, defaultId: doc.id);
      }).toList();
    });
  }

  @override
  Stream<List<HelperLogModel>> watchTodayHelperLogs(String societyId) {
    if (societyId.isEmpty) return Stream.value([]);

    return _firestore
        .collection('societies/$societyId/helper_logs')
        .orderBy('timestamp', descending: true)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs.map((doc) {
        return HelperLogModel.fromMap(doc.data(), defaultId: doc.id);
      }).toList();
    });
  }

  @override
  Future<List<HelperAttendanceDay>> getMonthlyAttendance(
      String societyId, String helperId, int year, int month) async {
    if (societyId.isEmpty || helperId.isEmpty) return [];

    final daysInMonth = DateTime(year, month + 1, 0).day;
    final monthStr = month.toString().padLeft(2, '0');
    final monthPrefix = '$year-$monthStr';

    // Query all logs for this helper
    final querySnap = await _firestore
        .collection('societies/$societyId/helper_logs')
        .where('helperId', isEqualTo: helperId)
        .get();

    final logs = querySnap.docs.map((doc) {
      return HelperLogModel.fromMap(doc.data(), defaultId: doc.id);
    }).where((log) => log.timestamp.startsWith(monthPrefix)).toList();

    // Map logs to days
    final List<HelperAttendanceDay> attendanceDays = [];

    for (int day = 1; day <= daysInMonth; day++) {
      final dayStr = day.toString().padLeft(2, '0');
      final dateKey = '$monthPrefix-$dayStr';
      final currentDayDate = DateTime(year, month, day);

      final dayLogs = logs.where((l) => l.timestamp.startsWith(dateKey)).toList();

      if (dayLogs.isEmpty) {
        attendanceDays.add(HelperAttendanceDay(
          date: currentDayDate,
          isPresent: false,
        ));
      } else {
        // Sort day logs chronologically
        dayLogs.sort((a, b) => a.timestamp.compareTo(b.timestamp));

        final entryLogs = dayLogs.where((l) => l.action.toUpperCase() == 'ENTRY').toList();
        final exitLogs = dayLogs.where((l) => l.action.toUpperCase() == 'EXIT').toList();

        final firstEntry = entryLogs.isNotEmpty ? entryLogs.first : dayLogs.first;
        final lastExit = exitLogs.isNotEmpty ? exitLogs.last : null;

        Duration? dutyDuration;
        if (firstEntry.timestamp.isNotEmpty && lastExit != null && lastExit.timestamp.isNotEmpty) {
          final entryDt = DateTime.tryParse(firstEntry.timestamp);
          final exitDt = DateTime.tryParse(lastExit.timestamp);
          if (entryDt != null && exitDt != null && exitDt.isAfter(entryDt)) {
            dutyDuration = exitDt.difference(entryDt);
          }
        }

        attendanceDays.add(HelperAttendanceDay(
          date: currentDayDate,
          isPresent: true,
          entryTime: firstEntry.timestamp,
          exitTime: lastExit?.timestamp,
          duration: dutyDuration,
          entryGate: firstEntry.gateName,
          exitGate: lastExit?.gateName,
          guardName: firstEntry.guardName,
        ));
      }
    }

    return attendanceDays;
  }

  @override
  Future<HelperSalaryRecord?> getSalaryRecord(
      String societyId, String helperId, String yearMonth) async {
    if (societyId.isEmpty || helperId.isEmpty || yearMonth.isEmpty) return null;

    final docSnap = await _firestore
        .doc('societies/$societyId/helpers/$helperId/salary_records/$yearMonth')
        .get();

    if (!docSnap.exists || docSnap.data() == null) return null;
    return HelperSalaryRecord.fromMap(docSnap.data()!, defaultId: docSnap.id);
  }

  @override
  Future<void> saveSalaryRecord(
      String societyId, String helperId, HelperSalaryRecord record) async {
    await _firestore
        .doc('societies/$societyId/helpers/$helperId/salary_records/${record.yearMonth}')
        .set(record.toMap(), SetOptions(merge: true));
  }

  @override
  Future<void> updateHelperSalaryConfig(
      String societyId, String helperId, double monthlySalary, String salaryCalculationType) async {
    await _firestore.doc('societies/$societyId/helpers/$helperId').update({
      'monthlySalary': monthlySalary,
      'salaryCalculationType': salaryCalculationType,
      'updatedAt': FieldValue.serverTimestamp(),
    });
  }

  @override
  Future<void> registerHelper({
    required String societyId,
    required String residentUid,
    required String residentName,
    required String flatNumber,
    required String name,
    required String phone,
    required String type,
    required String govtIdType,
    required String govtIdNumber,
    required String workingDays,
    required String emergencyContact,
  }) async {
    final docRef = _firestore.collection('societies/$societyId/helpers').doc();
    final helperId = docRef.id;
    final qrString = 'GATELINK:HELPER:$societyId:$helperId';

    final docData = {
      'id': helperId,
      'societyId': societyId,
      'name': name.trim(),
      'phone': phone.trim(),
      'type': type,
      'govtIdType': govtIdType,
      'govtIdNumber': govtIdNumber.trim(),
      'workingDays': workingDays.trim(),
      'emergencyContact': emergencyContact.trim(),
      'residentUid': residentUid,
      'residentName': residentName,
      'flatNumber': flatNumber,
      'status': 'Active',
      'isInside': false,
      'qrCodeData': qrString,
      'monthlySalary': 3500.0,
      'salaryCalculationType': 'pro_rata',
      'createdAt': DateTime.now().toIso8601String(),
    };

    await docRef.set(docData);
  }

  @override
  Future<void> updateHelperStatus({
    required String societyId,
    required String helperId,
    required String status,
  }) async {
    await _firestore.doc('societies/$societyId/helpers/$helperId').update({
      'status': status,
      'updatedAt': FieldValue.serverTimestamp(),
    });
  }

  @override
  Future<void> deleteHelper({
    required String societyId,
    required String helperId,
  }) async {
    await _firestore.doc('societies/$societyId/helpers/$helperId').delete();
  }
}

