import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/partner_auth_provider.dart';
import '../../../../core/widgets/partner_logo.dart';
import '../widgets/account_audit_log_view.dart';
import '../widgets/audit_header_banner.dart';
import '../widgets/audit_tab_button.dart';
import '../widgets/lead_audit_logs_view.dart';

class RegistrationAuditLogScreen extends ConsumerStatefulWidget {
  const RegistrationAuditLogScreen({super.key});

  @override
  ConsumerState<RegistrationAuditLogScreen> createState() => _RegistrationAuditLogScreenState();
}

class _RegistrationAuditLogScreenState extends ConsumerState<RegistrationAuditLogScreen> {
  String _activeTab = 'account';

  @override
  Widget build(BuildContext context) {
    final partnerUser = ref.watch(partnerAuthProvider);
    final partnerPhone = partnerUser?.phone ?? '';
    final cleanPhone = partnerPhone.replaceAll(RegExp(r'[^0-9]'), '');
    final partnerEmail = partnerUser?.email.trim().toLowerCase() ?? '';

    return Scaffold(
      appBar: AppBar(
        title: const PartnerLogo(
          size: PartnerLogoSize.small,
          showTagline: false,
          isDark: true,
        ),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.pagePadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AuditHeaderBanner(partnerName: partnerUser?.name ?? 'Partner'),
            const SizedBox(height: 20),

            // Tab Controls
            Row(
              children: [
                Expanded(
                  child: AuditTabButton(
                    label: 'Account Registration Log',
                    icon: Icons.badge_outlined,
                    isSelected: _activeTab == 'account',
                    onTap: () => setState(() => _activeTab = 'account'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: AuditTabButton(
                    label: 'Lead Registration Logs',
                    icon: Icons.list_alt_rounded,
                    isSelected: _activeTab == 'leads',
                    onTap: () => setState(() => _activeTab = 'leads'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            if (_activeTab == 'account')
              AccountAuditLogView(partnerUser: partnerUser)
            else
              LeadAuditLogsView(cleanPhone: cleanPhone, partnerEmail: partnerEmail),
          ],
        ),
      ),
    );
  }
}
