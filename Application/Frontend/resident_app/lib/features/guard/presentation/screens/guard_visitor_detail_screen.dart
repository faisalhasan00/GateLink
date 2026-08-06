import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../../../../core/services/firestore_service.dart';

class GuardVisitorDetailScreen extends ConsumerWidget {
  final String visitorId;
  const GuardVisitorDetailScreen({super.key, required this.visitorId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final visitorsAsync = ref.watch(visitorsStreamProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Visitor Gate Details'),
        backgroundColor: AppColors.secondary,
        foregroundColor: Colors.white,
      ),
      body: visitorsAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Error: $e')),
        data: (snapshot) {
          final matchingDocs = snapshot.docs.where((d) => d.id == visitorId).toList();
          if (matchingDocs.isEmpty) {
            return const Center(
              child: Text('Visitor details not found or removed.', style: TextStyle(color: AppColors.textSecondary)),
            );
          }

          final doc = matchingDocs.first;
          final data = doc.data() as Map<String, dynamic>;
          final name = data['name'] ?? 'Unknown Visitor';
          final phone = data['phone'] ?? 'N/A';
          final type = data['type'] ?? 'Guest';
          final hostFlat = data['hostFlat'] ?? 'N/A';
          final residentName = data['hostResidentName'] ?? 'Resident';
          final status = data['status'] ?? 'pending';
          final vehicleNumber = data['vehicleNumber'] ?? 'None';
          final vehicleType = data['vehicleType'] ?? '4-Wheeler';
          final gender = data['gender'] ?? 'Not Specified';
          final company = data['company'] ?? '';
          final photoUrl = data['photoUrl'] as String?;
          final gateName = data['gateName'] ?? 'Gate 1 — Main Entry';
          final createdDate = data['createdDate'] ?? '';
          final entryTime = data['entryTime'];
          final exitTime = data['exitTime'];

          final isInside = status == 'inside';
          final isPending = status == 'pending';
          final isApproved = status == 'approved';
          final isRejected = status == 'rejected' || status == 'denied';

          return SingleChildScrollView(
            padding: const EdgeInsets.all(AppSpacing.pagePadding),
            child: Column(
              children: [
                // Visitor Header Card
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(AppSpacing.lg),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: isRejected
                          ? [AppColors.error, const Color(0xFF991B1B)]
                          : isApproved || isInside
                              ? [AppColors.success, const Color(0xFF047857)]
                              : [const Color(0xFF0F1923), const Color(0xFF1A2A3A)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(AppRadius.xl),
                  ),
                  child: Column(
                    children: [
                      if (photoUrl != null && photoUrl.isNotEmpty)
                        ClipRRect(
                          borderRadius: BorderRadius.circular(50),
                          child: Image.network(photoUrl, width: 80, height: 80, fit: BoxFit.cover),
                        )
                      else
                        CircleAvatar(
                          radius: 36,
                          backgroundColor: Colors.white.withValues(alpha: 0.2),
                          child: Text(
                            name.isNotEmpty ? name[0].toUpperCase() : 'V',
                            style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.white),
                          ),
                        ),
                      const SizedBox(height: 12),
                      Text(name, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: Colors.white)),
                      if (company.isNotEmpty) ...[
                        const SizedBox(height: 2),
                        Text(company, style: const TextStyle(fontSize: 13, color: Colors.white70)),
                      ],
                      const SizedBox(height: 10),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 5),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(AppRadius.full),
                        ),
                        child: Text(
                          status.toUpperCase().replaceAll('_', ' '),
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Colors.white),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: AppSpacing.lg),

                // Details List Card
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(AppSpacing.md),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(AppRadius.lg),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _DetailRow(label: 'Visitor Category', value: type),
                      _DetailRow(label: 'Mobile Number', value: phone),
                      _DetailRow(label: 'Gender', value: gender),
                      _DetailRow(label: 'Destination Flat', value: hostFlat),
                      _DetailRow(label: 'Resident Name', value: residentName),
                      _DetailRow(label: 'Vehicle Info', value: vehicleNumber.isEmpty ? 'None' : '$vehicleNumber ($vehicleType)'),
                      _DetailRow(label: 'Gate Name', value: gateName),
                      _DetailRow(label: 'Logged At', value: createdDate.isEmpty ? 'Just now' : createdDate),
                      if (entryTime != null) _DetailRow(label: 'Entry Timestamp', value: entryTime),
                      if (exitTime != null) _DetailRow(label: 'Exit Timestamp', value: exitTime),
                      if (data['durationString'] != null) _DetailRow(label: 'Visit Duration', value: data['durationString'] as String),
                    ],
                  ),
                ),
                const SizedBox(height: AppSpacing.lg),

                // Activity Timeline
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(AppSpacing.md),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(AppRadius.lg),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.timeline_rounded, size: 18, color: AppColors.secondary),
                          SizedBox(width: 8),
                          Text('ACTIVITY TIMELINE', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: AppColors.textSecondary, letterSpacing: 0.5)),
                        ],
                      ),
                      const Divider(height: 20),
                      _TimelineStep(
                        title: 'Visitor Entry Logged',
                        subtitle: 'Logged at $gateName by Security Guard',
                        timestamp: createdDate.isEmpty ? 'Just now' : createdDate,
                        icon: Icons.note_add_rounded,
                        color: AppColors.secondary,
                        isFirst: true,
                      ),
                      _TimelineStep(
                        title: 'Resident Notification Sent',
                        subtitle: 'Sent to $residentName ($hostFlat)',
                        timestamp: createdDate.isEmpty ? 'Just now' : createdDate,
                        icon: Icons.notifications_active_rounded,
                        color: AppColors.info,
                      ),
                      if (isApproved || isInside || status == 'checked_out')
                        _TimelineStep(
                          title: 'Resident Approved Request',
                          subtitle: 'Approved by $residentName',
                          timestamp: data['approvedAt'] as String? ?? 'Approved',
                          icon: Icons.check_circle_rounded,
                          color: AppColors.success,
                        )
                      else if (isRejected)
                        _TimelineStep(
                          title: 'Resident Denied Entry',
                          subtitle: 'Entry request rejected by $residentName',
                          timestamp: data['rejectedAt'] as String? ?? 'Denied',
                          icon: Icons.cancel_rounded,
                          color: AppColors.error,
                        ),
                      if (entryTime != null)
                        _TimelineStep(
                          title: 'Visitor Checked In',
                          subtitle: 'Gate entry allowed',
                          timestamp: entryTime as String,
                          icon: Icons.meeting_room_rounded,
                          color: AppColors.primary,
                        ),
                      if (exitTime != null)
                        _TimelineStep(
                          title: 'Visitor Checked Out',
                          subtitle: 'Visit Duration: ${data["durationString"] ?? "Checked Out"}',
                          timestamp: exitTime as String,
                          icon: Icons.exit_to_app_rounded,
                          color: AppColors.textSecondary,
                          isLast: true,
                        ),
                    ],
                  ),
                ),
                const SizedBox(height: AppSpacing.xl),

                // Action Buttons
                Row(
                  children: [
                    if (isInside)
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () async {
                            final svc = ref.read(firestoreServiceProvider);
                            if (svc != null) {
                              await svc.markVisitorExit(doc.id);
                              if (context.mounted) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(content: Text('Visitor marked as checked out.')),
                                );
                              }
                            }
                          },
                          icon: const Icon(Icons.exit_to_app_rounded),
                          label: const Text('Mark Gate Exit'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.error,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                          ),
                        ),
                      )
                    else if (isPending || isApproved)
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () async {
                            final svc = ref.read(firestoreServiceProvider);
                            if (svc != null) {
                              await svc.updateVisitorStatus(doc.id, 'inside');
                              if (context.mounted) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(content: Text('Visitor checked in successfully!'), backgroundColor: AppColors.success),
                                );
                              }
                            }
                          },
                          icon: const Icon(Icons.meeting_room_rounded),
                          label: const Text('Check In Gate Entry'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.success,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                          ),
                        ),
                      ),
                    if (phone.length >= 10) ...[
                      const SizedBox(width: AppSpacing.sm),
                      ElevatedButton.icon(
                        onPressed: () => launchUrl(Uri.parse('tel:$phone')),
                        icon: const Icon(Icons.call_rounded),
                        label: const Text('Call'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                        ),
                      ),
                    ],
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  final String label;
  final String value;
  const _DetailRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 13, color: AppColors.textSecondary)),
          Flexible(
            child: Text(
              value,
              textAlign: TextAlign.end,
              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
            ),
          ),
        ],
      ),
    );
  }
}

class _TimelineStep extends StatelessWidget {
  final String title;
  final String subtitle;
  final String timestamp;
  final IconData icon;
  final Color color;
  final bool isFirst;
  final bool isLast;

  const _TimelineStep({
    required this.title,
    required this.subtitle,
    required this.timestamp,
    required this.icon,
    required this.color,
    this.isFirst = false,
    this.isLast = false,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Column(
            children: [
              CircleAvatar(
                radius: 14,
                backgroundColor: color.withValues(alpha: 0.15),
                child: Icon(icon, size: 14, color: color),
              ),
              if (!isLast)
                Container(
                  width: 2,
                  height: 32,
                  color: AppColors.gray200,
                ),
            ],
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                    Text(timestamp, style: const TextStyle(fontSize: 10, color: AppColors.textDisabled)),
                  ],
                ),
                const SizedBox(height: 2),
                Text(subtitle, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
