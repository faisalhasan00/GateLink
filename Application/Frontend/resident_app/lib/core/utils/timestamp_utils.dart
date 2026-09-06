import 'package:cloud_firestore/cloud_firestore.dart';

/// Utility methods to safely handle date and timestamp values in Firestore models.
class TimestampUtils {
  TimestampUtils._();

  /// Safely converts any dynamic timestamp/date field (Timestamp, DateTime, int, String, null)
  /// into a non-null ISO-8601 String.
  static String parseToString(dynamic value, {String fallback = ''}) {
    if (value == null) return fallback;
    if (value is Timestamp) {
      return value.toDate().toUtc().toIso8601String();
    }
    if (value is DateTime) {
      return value.toUtc().toIso8601String();
    }
    if (value is int) {
      return DateTime.fromMillisecondsSinceEpoch(value, isUtc: true).toIso8601String();
    }
    if (value is String) {
      return value;
    }
    return value.toString();
  }

  /// Safely converts any dynamic timestamp/date field into a nullable String.
  static String? parseToNullableString(dynamic value) {
    if (value == null) return null;
    final str = parseToString(value);
    return str.isEmpty ? null : str;
  }

  /// Safely converts any dynamic timestamp/date field to a DateTime object.
  static DateTime? parseToDateTime(dynamic value) {
    if (value == null) return null;
    if (value is Timestamp) return value.toDate();
    if (value is DateTime) return value;
    if (value is int) return DateTime.fromMillisecondsSinceEpoch(value);
    if (value is String) {
      if (value.trim().isEmpty) return null;
      return DateTime.tryParse(value);
    }
    return null;
  }
}
