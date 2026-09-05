import 'package:flutter/material.dart';
import '../../../../../core/theme/app_colors.dart';

/// Visitor/Agent profile card containing avatar, name, provider tag & phone call button
class ApprovalDialogVisitorCard extends StatelessWidget {
  final String visitorName;
  final String? providerName;
  final String? avatarUrl;
  final String? phoneNumber;
  final Color providerBadgeColor;

  const ApprovalDialogVisitorCard({
    super.key,
    required this.visitorName,
    this.providerName,
    this.avatarUrl,
    this.phoneNumber,
    required this.providerBadgeColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.gray50,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.gray200),
      ),
      child: Row(
        children: [
          // Avatar Image or Fallback Initials Circle
          CircleAvatar(
            radius: 24,
            backgroundColor: AppColors.primarySurface,
            backgroundImage: avatarUrl != null && avatarUrl!.isNotEmpty
                ? NetworkImage(avatarUrl!)
                : null,
            child: avatarUrl == null || avatarUrl!.isEmpty
                ? Text(
                    visitorName.isNotEmpty ? visitorName[0].toUpperCase() : 'G',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: AppColors.primary,
                    ),
                  )
                : null,
          ),
          const SizedBox(width: 12),

          // Name & Provider Badge
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  visitorName,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 2),
                if (providerName != null && providerName!.isNotEmpty)
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: providerBadgeColor.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          providerName!,
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w800,
                            color: providerBadgeColor,
                          ),
                        ),
                      ),
                    ],
                  ),
              ],
            ),
          ),

          // Quick Phone Call Button
          if (phoneNumber != null && phoneNumber!.isNotEmpty)
            IconButton(
              onPressed: () {
                // Trigger direct phone call
              },
              icon: const Icon(
                Icons.phone_rounded,
                color: AppColors.success,
                size: 22,
              ),
              style: IconButton.styleFrom(
                backgroundColor: AppColors.successSurface,
                padding: const EdgeInsets.all(10),
              ),
            ),
        ],
      ),
    );
  }
}
