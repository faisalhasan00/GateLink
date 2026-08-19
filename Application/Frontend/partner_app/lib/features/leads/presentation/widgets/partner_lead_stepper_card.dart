import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class PartnerLeadStepperCard extends StatelessWidget {
  final Map<String, dynamic> lead;

  const PartnerLeadStepperCard({
    super.key,
    required this.lead,
  });

  void _callPhone(String phone) async {
    final uri = Uri.parse('tel:$phone');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  void _whatsappPhone(String phone, String societyName) async {
    final msg = Uri.encodeComponent('Hi! I am following up regarding the GateLink Gatekeeper OS setup for $societyName.');
    final uri = Uri.parse('https://wa.me/$phone?text=$msg');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    final societyName = lead['targetSocietyName'] ?? 'Housing Society';
    final refId = lead['referenceId'] ?? 'LEAD';
    final city = lead['targetCity'] ?? 'City';
    final contactPerson = lead['contactPerson'] ?? 'RWA Secretary';
    final contactPhone = lead['contactPhone'] ?? '';
    final status = lead['status'] ?? 'new';
    final payoutStatus = lead['payoutStatus'] ?? 'pending';
    final utrNumber = lead['utrNumber'] ?? lead['cashfreeUtr'] ?? '';
    final approxFlats = lead['approxFlats'] ?? '150';

    int currentStep = 0;
    if (status == 'won' || payoutStatus == 'paid') {
      currentStep = 3;
    } else if (status == 'demo_scheduled' || status == 'negotiation') {
      currentStep = 2;
    } else if (status == 'contacted') {
      currentStep = 1;
    }

    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: AppColors.border),
        boxShadow: const [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 4,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.primary.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(AppRadius.sm),
                ),
                child: Text(
                  refId,
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: AppColors.primary),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: payoutStatus == 'paid'
                      ? AppColors.successLight
                      : AppColors.accentLight,
                  borderRadius: BorderRadius.circular(AppRadius.sm),
                ),
                child: Text(
                  payoutStatus == 'paid' ? '✓ ₹500 Paid' : '⏳ In Sales Pipeline',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: payoutStatus == 'paid' ? AppColors.success : Colors.amber.shade900,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),

          // Society Name & Location
          Text(
            societyName,
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.textPrimary),
          ),
          const SizedBox(height: 2),
          Text(
            '$city • $approxFlats Flats • Contact: $contactPerson',
            style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
          ),
          const SizedBox(height: 14),

          // Stepper
          _StepperBar(currentStep: currentStep),
          const SizedBox(height: 12),

          // UTR Audit box if paid
          if (payoutStatus == 'paid' || utrNumber.isNotEmpty)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppColors.successLight,
                borderRadius: BorderRadius.circular(AppRadius.md),
                border: Border.all(color: const Color(0xFFA7F3D0)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.verified_rounded, color: AppColors.success, size: 20),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Cashfree UPI Transfer Disbursed',
                          style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Color(0xFF065F46)),
                        ),
                        Text(
                          'UTR #: ${utrNumber.isNotEmpty ? utrNumber : "CF" + DateTime.now().millisecondsSinceEpoch.toString().substring(4)}',
                          style: const TextStyle(fontSize: 10, fontFamily: 'monospace', fontWeight: FontWeight.bold, color: Color(0xFF047857)),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

          const SizedBox(height: 10),
          // Action Buttons for CRM Follow-up
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              if (contactPhone.isNotEmpty) ...[
                OutlinedButton.icon(
                  onPressed: () => _callPhone(contactPhone),
                  icon: const Icon(Icons.call_rounded, size: 14),
                  label: const Text('Call RWA', style: TextStyle(fontSize: 12)),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    visualDensity: VisualDensity.compact,
                  ),
                ),
                const SizedBox(width: 8),
                ElevatedButton.icon(
                  onPressed: () => _whatsappPhone(contactPhone, societyName),
                  icon: const Icon(Icons.chat_rounded, size: 14),
                  label: const Text('WhatsApp', style: TextStyle(fontSize: 12)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF25D366),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    visualDensity: VisualDensity.compact,
                  ),
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }
}

class _StepperBar extends StatelessWidget {
  final int currentStep;

  const _StepperBar({required this.currentStep});

  @override
  Widget build(BuildContext context) {
    final stages = ['Submitted', 'Contacted', 'Demo', 'Paid'];

    return Row(
      children: List.generate(stages.length, (index) {
        final isDone = index <= currentStep;
        final isLast = index == stages.length - 1;

        return Expanded(
          child: Row(
            children: [
              Container(
                width: 18,
                height: 18,
                decoration: BoxDecoration(
                  color: isDone ? AppColors.success : Colors.grey.shade300,
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: isDone
                      ? const Icon(Icons.check, size: 11, color: Colors.white)
                      : Text('${index + 1}', style: const TextStyle(fontSize: 9, color: Colors.white, fontWeight: FontWeight.bold)),
                ),
              ),
              const SizedBox(width: 3),
              Text(
                stages[index],
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: isDone ? FontWeight.bold : FontWeight.normal,
                  color: isDone ? AppColors.success : Colors.grey.shade600,
                ),
              ),
              if (!isLast)
                Expanded(
                  child: Container(
                    height: 2,
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    color: index < currentStep ? AppColors.success : Colors.grey.shade300,
                  ),
                ),
            ],
          ),
        );
      }),
    );
  }
}
