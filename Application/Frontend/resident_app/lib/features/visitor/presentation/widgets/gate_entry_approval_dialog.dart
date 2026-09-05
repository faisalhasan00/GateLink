import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import 'approval_dialog/approval_dialog_action_button.dart';
import 'approval_dialog/approval_dialog_header_badge.dart';
import 'approval_dialog/approval_dialog_meta_chip.dart';
import 'approval_dialog/approval_dialog_visitor_card.dart';

/// Types of gate entry approvals
enum GateEntryType { delivery, visitor, cab, service }

/// Production-grade Gate Entry Approval Notification Dialog & Modal Sheet
/// Composes clean micro-components from approval_dialog/
class GateEntryApprovalDialog extends StatelessWidget {
  final String title;
  final String visitorName;
  final String? providerName;
  final String? avatarUrl;
  final String? phoneNumber;
  final String gateName;
  final String? temperatureText;
  final String? maskStatusText;
  final GateEntryType entryType;
  final VoidCallback onAllow;
  final VoidCallback onLeaveAtGate;
  final VoidCallback onDeny;

  const GateEntryApprovalDialog({
    super.key,
    required this.title,
    required this.visitorName,
    this.providerName,
    this.avatarUrl,
    this.phoneNumber,
    this.gateName = 'Main Gate',
    this.temperatureText = '98.3°F',
    this.maskStatusText = 'Mask Verified',
    this.entryType = GateEntryType.delivery,
    required this.onAllow,
    required this.onLeaveAtGate,
    required this.onDeny,
  });

  /// Helper static method to display gate entry approval modal sheet/dialog
  static Future<T?> show<T>({
    required BuildContext context,
    required String title,
    required String visitorName,
    String? providerName,
    String? avatarUrl,
    String? phoneNumber,
    String gateName = 'Main Gate',
    String? temperatureText = '98.3°F',
    String? maskStatusText = 'Mask Verified',
    GateEntryType entryType = GateEntryType.delivery,
    required VoidCallback onAllow,
    required VoidCallback onLeaveAtGate,
    required VoidCallback onDeny,
  }) {
    return showDialog<T>(
      context: context,
      barrierDismissible: false,
      barrierColor: Colors.black.withValues(alpha: 0.65),
      builder: (ctx) => Dialog(
        backgroundColor: Colors.transparent,
        insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
        child: GateEntryApprovalDialog(
          title: title,
          visitorName: visitorName,
          providerName: providerName,
          avatarUrl: avatarUrl,
          phoneNumber: phoneNumber,
          gateName: gateName,
          temperatureText: temperatureText,
          maskStatusText: maskStatusText,
          entryType: entryType,
          onAllow: onAllow,
          onLeaveAtGate: onLeaveAtGate,
          onDeny: onDeny,
        ),
      ),
    );
  }

  IconData get _entryIcon {
    switch (entryType) {
      case GateEntryType.delivery:
        return Icons.two_wheeler_rounded;
      case GateEntryType.visitor:
        return Icons.person_pin_circle_rounded;
      case GateEntryType.cab:
        return Icons.local_taxi_rounded;
      case GateEntryType.service:
        return Icons.build_circle_rounded;
    }
  }

  Color get _headerBadgeColor {
    switch (entryType) {
      case GateEntryType.delivery:
        return const Color(0xFFF97316); // Orange accent
      case GateEntryType.visitor:
        return AppColors.primaryLight; // Sky Blue
      case GateEntryType.cab:
        return AppColors.accent; // Amber
      case GateEntryType.service:
        return AppColors.maintenance; // Purple
    }
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      alignment: Alignment.topCenter,
      children: [
        // Main White Card Container
        Container(
          width: double.infinity,
          margin: const EdgeInsets.only(top: 36),
          padding: const EdgeInsets.fromLTRB(20, 48, 20, 24),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(24),
            boxShadow: [
              BoxShadow(
                color: AppColors.primaryDark.withValues(alpha: 0.18),
                blurRadius: 30,
                offset: const Offset(0, 12),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Headline Title
              Text(
                title,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textPrimary,
                  height: 1.25,
                  letterSpacing: -0.3,
                ),
              ),
              const SizedBox(height: AppSpacing.sm),

              // Verification Chips Wrap (Temperature / Mask / Gate Tag)
              Wrap(
                alignment: WrapAlignment.center,
                spacing: 8,
                runSpacing: 6,
                children: [
                  if (temperatureText != null)
                    ApprovalDialogMetaChip(
                      icon: Icons.thermostat_rounded,
                      text: temperatureText!,
                      iconColor: AppColors.error,
                    ),
                  if (maskStatusText != null)
                    ApprovalDialogMetaChip(
                      icon: Icons.sanitizer_rounded,
                      text: maskStatusText!,
                      iconColor: AppColors.primaryLight,
                    ),
                  ApprovalDialogMetaChip(
                    icon: Icons.meeting_room_rounded,
                    text: gateName,
                    iconColor: AppColors.primary,
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),

              // Visitor / Agent Info Micro-Card Component
              ApprovalDialogVisitorCard(
                visitorName: visitorName,
                providerName: providerName,
                avatarUrl: avatarUrl,
                phoneNumber: phoneNumber,
                providerBadgeColor: _headerBadgeColor,
              ),
              const SizedBox(height: AppSpacing.lg),

              // Bottom 3 Circular Action Buttons Row
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  // 1. Deny Entry Button
                  ApprovalDialogActionButton(
                    label: 'DENY\nENTRY',
                    icon: Icons.close_rounded,
                    buttonColor: AppColors.surface,
                    borderColor: AppColors.error,
                    iconColor: AppColors.error,
                    textColor: AppColors.error,
                    onPressed: () {
                      Navigator.of(context).pop();
                      onDeny();
                    },
                  ),

                  // 2. Leave at Gate Button
                  ApprovalDialogActionButton(
                    label: 'LEAVE\nAT GATE',
                    icon: Icons.inventory_2_outlined,
                    buttonColor: AppColors.surface,
                    borderColor: AppColors.primaryLight,
                    iconColor: AppColors.primaryLight,
                    textColor: AppColors.primaryLight,
                    onPressed: () {
                      Navigator.of(context).pop();
                      onLeaveAtGate();
                    },
                  ),

                  // 3. Allow Entry Button
                  ApprovalDialogActionButton(
                    label: 'ALLOW\nENTRY',
                    icon: Icons.check_rounded,
                    buttonColor: AppColors.success,
                    borderColor: AppColors.success,
                    iconColor: Colors.white,
                    textColor: AppColors.success,
                    isSolid: true,
                    onPressed: () {
                      Navigator.of(context).pop();
                      onAllow();
                    },
                  ),
                ],
              ),
            ],
          ),
        ),

        // Top Overflowing Circle Icon Badge Micro-Component
        ApprovalDialogHeaderBadge(
          icon: _entryIcon,
          badgeColor: _headerBadgeColor,
        ),
      ],
    );
  }
}
