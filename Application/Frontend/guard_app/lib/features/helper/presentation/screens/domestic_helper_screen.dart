import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../providers/helper_providers.dart';
import 'register_helper_screen.dart';

class DomesticHelperScreen extends ConsumerWidget {
  const DomesticHelperScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final helpersAsync = ref.watch(registeredHelpersStreamProvider);
    final logsAsync = ref.watch(helperLogsStreamProvider);

    return DefaultTabController(
      length: 2,
      child: Scaffold(
        backgroundColor: AppColors.background,
        appBar: AppBar(
          title: const Text('Domestic Helpers & Pass'),
          bottom: const TabBar(
            tabs: [
              Tab(text: 'My Registered Helpers'),
              Tab(text: 'Today\'s Entry Logs'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            // Tab 1: Registered Helpers List
            helpersAsync.when(
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (e, _) => Center(child: Text('Error: $e')),
              data: (helpers) {
                if (helpers.isEmpty) {
                  return Center(
                    child: Padding(
                      padding: const EdgeInsets.all(32),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.cleaning_services_rounded, size: 64, color: AppColors.border),
                          const SizedBox(height: 16),
                          const Text('No Domestic Helpers Registered', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 8),
                          const Text('Register your maids, drivers, cooks, or caretakers for gate entry verification.', textAlign: TextAlign.center, style: TextStyle(fontSize: 13, color: AppColors.textSecondary)),
                          const SizedBox(height: 24),
                          ElevatedButton.icon(
                            onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const RegisterHelperScreen())),
                            icon: const Icon(Icons.person_add_rounded),
                            label: const Text('Register New Helper'),
                            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.white),
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
                    final isActive = helper.status == 'Active';

                    return Container(
                      padding: const EdgeInsets.all(AppSpacing.md),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(AppRadius.lg),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: Row(
                        children: [
                          CircleAvatar(
                            radius: 24,
                            backgroundColor: AppColors.primarySurface,
                            child: Text(
                              helper.name.isNotEmpty ? helper.name.substring(0, 1).toUpperCase() : 'H',
                              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.primary),
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(helper.name, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                                const SizedBox(height: 2),
                                Text('${helper.type} • ${helper.phone}', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                                const SizedBox(height: 4),
                                Text('Schedule: ${helper.workingDays}', style: const TextStyle(fontSize: 11, color: AppColors.textSecondary, fontWeight: FontWeight.w500)),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: isActive ? AppColors.success.withValues(alpha: 0.15) : AppColors.error.withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(AppRadius.full),
                            ),
                            child: Text(helper.status.toUpperCase(), style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: isActive ? AppColors.success : AppColors.error)),
                          ),
                        ],
                      ),
                    );
                  },
                );
              },
            ),

            // Tab 2: Today's Gate Log
            logsAsync.when(
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (e, _) => Center(child: Text('Error: $e')),
              data: (logs) {
                if (logs.isEmpty) {
                  return const Center(
                    child: Text('No helper or delivery entry logs for today.', style: TextStyle(color: AppColors.textSecondary)),
                  );
                }

                return ListView.separated(
                  padding: const EdgeInsets.all(AppSpacing.pagePadding),
                  itemCount: logs.length,
                  separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.sm),
                  itemBuilder: (context, index) {
                    final log = logs[index];
                    final isEntry = log.type == 'ENTRY';
                    final time = log.formattedTime;

                    return Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(AppRadius.md),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: Row(
                        children: [
                          Icon(isEntry ? Icons.login_rounded : Icons.logout_rounded, color: isEntry ? AppColors.success : AppColors.warning, size: 22),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(log.helperName, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                                Text('${log.helperType} • ${log.gateName} • $time', style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                              ],
                            ),
                          ),
                          Text(log.type, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: isEntry ? AppColors.success : AppColors.warning)),
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
          onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const RegisterHelperScreen())),
          backgroundColor: AppColors.primary,
          icon: const Icon(Icons.person_add_rounded, color: Colors.white),
          label: const Text('Add Helper', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
        ),
      ),
    );
  }
}
