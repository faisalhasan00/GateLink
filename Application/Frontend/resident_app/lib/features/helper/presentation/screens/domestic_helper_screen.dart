import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../domain/models/helper_log_model.dart';
import '../../providers/helper_providers.dart';
import '../widgets/helper_card_widget.dart';
import 'register_helper_screen.dart';

class DomesticHelperScreen extends ConsumerWidget {
  const DomesticHelperScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final myHelpersAsync = ref.watch(myHelpersStreamProvider);
    final helperLogsAsync = ref.watch(todayHelperLogsStreamProvider);
    final userProfile = ref.watch(userProfileProvider).value;
    final societyId = userProfile?['societyId'] as String? ?? '';
    final societyName = userProfile?['societyName'] as String? ?? 'GateLink Community';

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (didPop) return;
        if (context.canPop()) {
          context.pop();
        } else {
          context.go('/home/dashboard');
        }
      },
      child: DefaultTabController(
        length: 2,
        child: Scaffold(
          backgroundColor: const Color(0xFFF8FAFC),
          appBar: AppBar(
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
              onPressed: () {
                if (context.canPop()) {
                  context.pop();
                } else {
                  context.go('/home/dashboard');
                }
              },
            ),
            title: const Text('Domestic Staff & Pass'),
            backgroundColor: Colors.white,
            foregroundColor: const Color(0xFF0F172A),
            elevation: 0.5,
            actions: [
              IconButton(
                tooltip: 'Add Domestic Staff',
                icon: const Icon(Icons.person_add_alt_1_rounded, color: Color(0xFF1E3A8A)),
                onPressed: () => Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const RegisterHelperScreen()),
                ),
              ),
            ],
            bottom: const TabBar(
              labelColor: Color(0xFF1E3A8A),
              unselectedLabelColor: Color(0xFF64748B),
              indicatorColor: Color(0xFF1E3A8A),
              indicatorWeight: 3,
              labelStyle: TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
              tabs: [
                Tab(text: 'My Registered Staff'),
                Tab(text: 'Gate Entry Logs'),
              ],
            ),
          ),
          body: TabBarView(
            children: [
              // Tab 1: Registered Helpers List
              myHelpersAsync.when(
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (err, _) => Center(
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.error_outline_rounded, size: 48, color: Color(0xFFEF4444)),
                        const SizedBox(height: 12),
                        Text('Error loading staff: $err', textAlign: TextAlign.center),
                      ],
                    ),
                  ),
                ),
                data: (helpers) {
                  if (helpers.isEmpty) {
                    return Center(
                      child: Padding(
                        padding: const EdgeInsets.all(32),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(20),
                              decoration: const BoxDecoration(
                                color: Color(0xFFE0F2FE),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(
                                Icons.cleaning_services_rounded,
                                size: 54,
                                color: Color(0xFF0284C7),
                              ),
                            ),
                            const SizedBox(height: 20),
                            const Text(
                              'No Domestic Staff Registered',
                              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                            ),
                            const SizedBox(height: 8),
                            const Text(
                              'Register your maids, cooks, drivers, or cleaners to give them a permanent QR gate entry pass.',
                              textAlign: TextAlign.center,
                              style: TextStyle(fontSize: 13, color: Color(0xFF64748B), height: 1.4),
                            ),
                            const SizedBox(height: 24),
                            ElevatedButton.icon(
                              onPressed: () => Navigator.push(
                                context,
                                MaterialPageRoute(builder: (_) => const RegisterHelperScreen()),
                              ),
                              icon: const Icon(Icons.add_rounded, size: 20),
                              label: const Text('Register New Staff Pass'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF1E3A8A),
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }

                  return ListView.separated(
                    padding: const EdgeInsets.all(AppSpacing.pagePadding),
                    itemCount: helpers.length,
                    separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.md),
                    itemBuilder: (context, index) {
                      final helper = helpers[index];
                      return HelperCardWidget(
                        helper: helper,
                        societyId: societyId,
                        societyName: societyName,
                      );
                    },
                  );
                },
              ),

              // Tab 2: Today's Entry Logs
              helperLogsAsync.when(
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (err, _) => Center(
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Text('Error loading logs: $err'),
                  ),
                ),
                data: (logs) {
                  if (logs.isEmpty) {
                    return Center(
                      child: Padding(
                        padding: const EdgeInsets.all(32),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: const [
                            Icon(Icons.history_toggle_off_rounded, size: 54, color: Color(0xFF94A3B8)),
                            SizedBox(height: 16),
                            Text(
                              'No Gate Activity Today',
                              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                            ),
                            SizedBox(height: 6),
                            Text(
                              'Whenever your domestic staff check in or out at the gate, real-time records will appear here.',
                              textAlign: TextAlign.center,
                              style: TextStyle(fontSize: 13, color: Color(0xFF64748B)),
                            ),
                          ],
                        ),
                      ),
                    );
                  }

                  return ListView.separated(
                    padding: const EdgeInsets.all(AppSpacing.pagePadding),
                    itemCount: logs.length,
                    separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.sm),
                    itemBuilder: (context, index) {
                      final log = logs[index];
                      final isEntry = log.type.toUpperCase().contains('IN') || log.type.toUpperCase().contains('ENTRY');
                      return Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFFE2E8F0)),
                        ),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: isEntry ? const Color(0xFFDCFCE7) : const Color(0xFFEFF6FF),
                                shape: BoxShape.circle,
                              ),
                              child: Icon(
                                isEntry ? Icons.login_rounded : Icons.logout_rounded,
                                color: isEntry ? const Color(0xFF16A34A) : const Color(0xFF2563EB),
                                size: 20,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    log.helperName,
                                    style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14, color: Color(0xFF0F172A)),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    '${log.helperType} • ${log.gateName} • Guard: ${log.guardName}',
                                    style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                                  ),
                                ],
                              ),
                            ),
                            Text(
                              log.formattedTime,
                              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF334155)),
                            ),
                          ],
                        ),
                      );
                    },
                  );
                },
              ),
            ],
          ),
          floatingActionButton: FloatingActionButton.extended(
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const RegisterHelperScreen()),
            ),
            backgroundColor: const Color(0xFF1E3A8A),
            foregroundColor: Colors.white,
            icon: const Icon(Icons.add_rounded),
            label: const Text('Add Staff'),
          ),
        ),
      ),
    );
  }
}
