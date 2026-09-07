import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../domain/models/helper_model.dart';
import '../../providers/helper_providers.dart';
import '../widgets/helper_directory_card.dart';
import '../widgets/helper_directory_header.dart';
import '../widgets/helper_gate_log_item.dart';
import '../widgets/helper_scan_badge_sheet.dart';
import 'register_helper_screen.dart';

class DomesticHelperScreen extends ConsumerStatefulWidget {
  const DomesticHelperScreen({super.key});

  @override
  ConsumerState<DomesticHelperScreen> createState() =>
      _DomesticHelperScreenState();
}

class _DomesticHelperScreenState extends ConsumerState<DomesticHelperScreen> {
  String _searchQuery = '';
  String? _processingHelperId;

  Future<void> _handleAttendanceToggle(HelperModel helper) async {
    final userProfile = ref.read(userProfileProvider).value;
    final societyId = userProfile?['societyId'] as String? ?? '';
    final guardName = userProfile?['name'] as String? ?? 'Security Guard';
    final gateName = userProfile?['gateName'] as String? ?? 'Main Gate';

    if (societyId.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Society information not found.')),
      );
      return;
    }

    setState(() => _processingHelperId = helper.id);

    try {
      final repository = ref.read(helperRepositoryProvider);
      final isNowInside = await repository.toggleHelperAttendance(
        societyId: societyId,
        helper: helper,
        guardName: guardName,
        gateName: gateName,
      );

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: isNowInside
              ? const Color(0xFF10B981)
              : const Color(0xFF3B82F6),
          content: Row(
            children: [
              Icon(
                isNowInside
                    ? Icons.check_circle_rounded
                    : Icons.logout_rounded,
                color: Colors.white,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  isNowInside
                      ? '✅ ${helper.name} (${helper.type}) checked IN at $gateName'
                      : '👋 ${helper.name} (${helper.type}) checked OUT from $gateName',
                  style: const TextStyle(
                      fontWeight: FontWeight.w700, color: Colors.white),
                ),
              ),
            ],
          ),
          duration: const Duration(seconds: 3),
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: const Color(0xFFEF4444),
          content: Text('Failed to update attendance: $e'),
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _processingHelperId = null);
      }
    }
  }

  void _findAndToggleHelper(String helperId) {
    final helpers =
        ref.read(registeredHelpersStreamProvider).value ?? [];
    final match = helpers.where((h) => h.id == helperId).firstOrNull;
    if (match != null) {
      _handleAttendanceToggle(match);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          backgroundColor: Color(0xFFEF4444),
          content: Text('Staff ID not found in this society.'),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final helpersAsync = ref.watch(registeredHelpersStreamProvider);
    final logsAsync = ref.watch(helperLogsStreamProvider);

    return DefaultTabController(
      length: 2,
      child: Scaffold(
        backgroundColor: const Color(0xFFF8FAFC),
        appBar: AppBar(
          title: const Text('Domestic Staff Attendance'),
          backgroundColor: Colors.white,
          foregroundColor: const Color(0xFF0F172A),
          elevation: 0.5,
          actions: [
            IconButton(
              tooltip: 'Scan Staff QR Badge',
              icon: const Icon(Icons.qr_code_scanner_rounded,
                  color: Color(0xFF1E3A8A)),
              onPressed: () => HelperScanBadgeSheet.show(
                context,
                onHelperIdScanned: _findAndToggleHelper,
              ),
            ),
            IconButton(
              tooltip: 'Register New Helper',
              icon: const Icon(Icons.person_add_alt_1_rounded,
                  color: Color(0xFF1E3A8A)),
              onPressed: () => Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (_) => const RegisterHelperScreen()),
              ),
            ),
          ],
          bottom: const TabBar(
            labelColor: Color(0xFF1E3A8A),
            unselectedLabelColor: Color(0xFF64748B),
            indicatorColor: Color(0xFF1E3A8A),
            indicatorWeight: 3,
            labelStyle:
                TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
            tabs: [
              Tab(text: 'Staff Directory'),
              Tab(text: 'Today\'s Gate Logs'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            // Tab 1: Staff Directory with 1-Tap In/Out Actions
            helpersAsync.when(
              loading: () =>
                  const Center(child: CircularProgressIndicator()),
              error: (e, _) => Center(child: Text('Error loading staff: $e')),
              data: (helpers) {
                final filtered = helpers.where((h) {
                  if (_searchQuery.isEmpty) return true;
                  final q = _searchQuery.toLowerCase();
                  return h.name.toLowerCase().contains(q) ||
                      h.type.toLowerCase().contains(q) ||
                      h.flatNumber.toLowerCase().contains(q) ||
                      h.phone.contains(q);
                }).toList();

                final insideCount =
                    helpers.where((h) => h.isInside).length;

                return Column(
                  children: [
                    HelperDirectoryHeader(
                      insideCount: insideCount,
                      totalCount: helpers.length,
                      searchQuery: _searchQuery,
                      onSearchChanged: (val) =>
                          setState(() => _searchQuery = val),
                    ),
                    Expanded(
                      child: filtered.isEmpty
                          ? Center(
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const Icon(Icons.search_off_rounded,
                                      size: 48, color: Color(0xFFCBD5E1)),
                                  const SizedBox(height: 12),
                                  Text(
                                    _searchQuery.isEmpty
                                        ? 'No domestic staff registered yet'
                                        : 'No staff matching "$_searchQuery"',
                                    style: const TextStyle(
                                        color: Color(0xFF64748B),
                                        fontWeight: FontWeight.w600),
                                  ),
                                ],
                              ),
                            )
                          : ListView.separated(
                              padding: const EdgeInsets.all(
                                  AppSpacing.pagePadding),
                              itemCount: filtered.length,
                              separatorBuilder: (_, __) =>
                                  const SizedBox(height: 12),
                              itemBuilder: (context, index) {
                                final helper = filtered[index];
                                return HelperDirectoryCard(
                                  helper: helper,
                                  isProcessing:
                                      _processingHelperId == helper.id,
                                  onToggleAttendance: () =>
                                      _handleAttendanceToggle(helper),
                                );
                              },
                            ),
                    ),
                  ],
                );
              },
            ),

            // Tab 2: Today's Gate Log
            logsAsync.when(
              loading: () =>
                  const Center(child: CircularProgressIndicator()),
              error: (e, _) => Center(child: Text('Error: $e')),
              data: (logs) {
                if (logs.isEmpty) {
                  return const Center(
                    child: Text(
                      'No staff entry/exit logs recorded today.',
                      style: TextStyle(color: Color(0xFF64748B)),
                    ),
                  );
                }

                return ListView.separated(
                  padding: const EdgeInsets.all(AppSpacing.pagePadding),
                  itemCount: logs.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 10),
                  itemBuilder: (context, index) {
                    final log = logs[index];
                    return HelperGateLogItem(log: log);
                  },
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
