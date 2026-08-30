class HelperAttendanceDay {
  final DateTime date;
  final bool isPresent;
  final String? entryTime;
  final String? exitTime;
  final Duration? duration;
  final String? entryGate;
  final String? exitGate;
  final String? guardName;

  const HelperAttendanceDay({
    required this.date,
    required this.isPresent,
    this.entryTime,
    this.exitTime,
    this.duration,
    this.entryGate,
    this.exitGate,
    this.guardName,
  });

  String get formattedDuration {
    if (duration == null || duration!.inMinutes == 0) {
      return isPresent ? 'Active on duty' : 'Absent';
    }
    final hours = duration!.inHours;
    final mins = duration!.inMinutes.remainder(60);
    if (hours > 0) {
      return '${hours}h ${mins}m';
    }
    return '${mins}m';
  }
}
