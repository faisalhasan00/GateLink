import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../domain/models/helper_model.dart';
import '../../providers/helper_providers.dart';
import 'register_helper_screen.dart';

class DomesticHelperScreen extends ConsumerStatefulWidget {
  const DomesticHelperScreen({super.key});

  @override
  ConsumerState<DomesticHelperScreen> createState() => _DomesticHelperScreenState();
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
          backgroundColor: isNowInside ? const Color(0xFF10B981) : const Color(0xFF3B82F6),
          content: Row(
            children: [
              Icon(
                isNowInside ? Icons.check_circle_rounded : Icons.logout_rounded,
                color: Colors.white,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  isNowInside
                      ? '✅ ${helper.name} (${helper.type}) checked IN at $gateName'
                      : '👋 ${helper.name} (${helper.type}) checked OUT from $gateName',
                  style: const TextStyle(fontWeight: FontWeight.w700, color: Colors.white),
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

  void _openQrScanner() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.black,
      builder: (ctx) {
        return Scaffold(
          backgroundColor: Colors.black,
          appBar: AppBar(
            backgroundColor: Colors.black,
            foregroundColor: Colors.white,
            title: const Text('Scan Staff ID Badge'),
            leading: IconButton(
              icon: const Icon(Icons.close_rounded),
              onPressed: () => Navigator.pop(ctx),
            ),
          ),
          body: Stack(
            children: [
              MobileScanner(
                onDetect: (capture) {
                  final List<Barcode> barcodes = capture.barcodes;
                  for (final barcode in barcodes) {
                    final rawValue = barcode.rawValue ?? '';
                    if (rawValue.startsWith('GATELINK:HELPER:')) {
                      final parts = rawValue.split(':');
                      if (parts.length >= 4) {
                        final helperId = parts[3];
                        Navigator.pop(ctx);
                        _findAndToggleHelper(helperId);
                        break;
                      }
                    }
                  }
                },
              ),
              Center(
                child: Container(
                  width: 250,
                  height: 250,
                  decoration: BoxDecoration(
                    border: Border.all(color: const Color(0xFF0EA5E9), width: 3),
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
              ),
              Positioned(
                bottom: 40,
                left: 20,
                right: 20,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.75),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Text(
                    'Point camera at Domestic Staff QR Badge on phone or ID card',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w600),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  void _findAndToggleHelper(String helperId) {
    final helpers = ref.read(registeredHelpersStreamProvider).value ?? [];
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
              icon: const Icon(Icons.qr_code_scanner_rounded, color: Color(0xFF1E3A8A)),
              onPressed: _openQrScanner,
            ),
            IconButton(
              tooltip: 'Register New Helper',
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
              Tab(text: 'Staff Directory'),
              Tab(text: 'Today\'s Gate Logs'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            // Tab 1: Staff Directory with 1-Tap In/Out Actions
            helpersAsync.when(
              loading: () => const Center(child: CircularProgressIndicator()),
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

                final insideCount = helpers.where((h) => h.isInside).length;

                return Column(
                  children: [
                    // Top Live Counter & Search Bar
                    Container(
                      padding: const EdgeInsets.all(AppSpacing.md),
                      color: Colors.white,
                      child: Column(
                        children: [
                          // Live Counter Pill
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                            decoration: BoxDecoration(
                              color: const Color(0xFFE0F2FE),
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(color: const Color(0xFFBAE6FD)),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    Container(
                                      width: 10,
                                      height: 10,
                                      decoration: const BoxDecoration(
                                        color: Color(0xFF10B981),
                                        shape: BoxShape.circle,
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      '$insideCount Staff currently inside society',
                                      style: const TextStyle(
                                        fontSize: 13,
                                        fontWeight: FontWeight.w700,
                                        color: Color(0xFF0369A1),
                                      ),
                                    ),
                                  ],
                                ),
                                Text(
                                  'Total: ${helpers.length}',
                                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF64748B)),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 12),
                          // Search Box
                          TextField(
                            onChanged: (val) => setState(() => _searchQuery = val),
                            decoration: InputDecoration(
                              hintText: 'Search by Maid name, Flat, or Category...',
                              hintStyle: const TextStyle(fontSize: 13, color: Color(0xFF94A3B8)),
                              prefixIcon: const Icon(Icons.search_rounded, size: 20, color: Color(0xFF64748B)),
                              suffixIcon: _searchQuery.isNotEmpty
                                  ? IconButton(
                                      icon: const Icon(Icons.clear_rounded, size: 18),
                                      onPressed: () => setState(() => _searchQuery = ''),
                                    )
                                  : null,
                              filled: true,
                              fillColor: const Color(0xFFF1F5F9),
                              contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 16),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide.none,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),

                    // List of Helpers
                    Expanded(
                      child: filtered.isEmpty
                          ? Center(
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const Icon(Icons.search_off_rounded, size: 48, color: Color(0xFFCBD5E1)),
                                  const SizedBox(height: 12),
                                  Text(
                                    _searchQuery.isEmpty ? 'No domestic staff registered yet' : 'No staff matching "$_searchQuery"',
                                    style: const TextStyle(color: Color(0xFF64748B), fontWeight: FontWeight.w600),
                                  ),
                                ],
                              ),
                            )
                          : ListView.separated(
                              padding: const EdgeInsets.all(AppSpacing.pagePadding),
                              itemCount: filtered.length,
                              separatorBuilder: (_, __) => const SizedBox(height: 12),
                              itemBuilder: (context, index) {
                                final helper = filtered[index];
                                final isInside = helper.isInside;
                                final isProcessing = _processingHelperId == helper.id;

                                return Container(
                                  padding: const EdgeInsets.all(14),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(
                                      color: isInside ? const Color(0xFF86EFAC) : const Color(0xFFE2E8F0),
                                      width: isInside ? 1.5 : 1,
                                    ),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black.withValues(alpha: 0.03),
                                        blurRadius: 6,
                                        offset: const Offset(0, 2),
                                      ),
                                    ],
                                  ),
                                  child: Row(
                                    children: [
                                      // Avatar with live indicator badge
                                      Stack(
                                        children: [
                                          CircleAvatar(
                                            radius: 24,
                                            backgroundColor: isInside ? const Color(0xFFDCFCE7) : const Color(0xFFF1F5F9),
                                            child: Text(
                                              helper.name.isNotEmpty ? helper.name.substring(0, 1).toUpperCase() : 'H',
                                              style: TextStyle(
                                                fontSize: 18,
                                                fontWeight: FontWeight.w800,
                                                color: isInside ? const Color(0xFF15803D) : const Color(0xFF475569),
                                              ),
                                            ),
                                          ),
                                          Positioned(
                                            bottom: 0,
                                            right: 0,
                                            child: Container(
                                              width: 14,
                                              height: 14,
                                              decoration: BoxDecoration(
                                                color: isInside ? const Color(0xFF10B981) : const Color(0xFF94A3B8),
                                                shape: BoxShape.circle,
                                                border: Border.all(color: Colors.white, width: 2),
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(width: 14),

                                      // Details
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Row(
                                              children: [
                                                Flexible(
                                                  child: Text(
                                                    helper.name,
                                                    style: const TextStyle(
                                                      fontSize: 15,
                                                      fontWeight: FontWeight.w700,
                                                      color: Color(0xFF0F172A),
                                                    ),
                                                    maxLines: 1,
                                                    overflow: TextOverflow.ellipsis,
                                                  ),
                                                ),
                                                const SizedBox(width: 6),
                                                Container(
                                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                                  decoration: BoxDecoration(
                                                    color: const Color(0xFFEFF6FF),
                                                    borderRadius: BorderRadius.circular(6),
                                                  ),
                                                  child: Text(
                                                    'Flat ${helper.flatNumber}',
                                                    style: const TextStyle(
                                                      fontSize: 11,
                                                      fontWeight: FontWeight.w700,
                                                      color: Color(0xFF1D4ED8),
                                                    ),
                                                  ),
                                                ),
                                              ],
                                            ),
                                            const SizedBox(height: 3),
                                            Text(
                                              '${helper.type} • ${helper.workingDays}',
                                              style: const TextStyle(
                                                fontSize: 12,
                                                color: Color(0xFF64748B),
                                                fontWeight: FontWeight.w500,
                                              ),
                                            ),
                                            const SizedBox(height: 2),
                                            Text(
                                              isInside
                                                  ? '🟢 Inside since ${helper.lastCheckIn != null ? _formatTimestamp(helper.lastCheckIn!) : 'today'}'
                                                  : '⚪ Outside campus',
                                              style: TextStyle(
                                                fontSize: 11,
                                                fontWeight: FontWeight.w600,
                                                color: isInside ? const Color(0xFF16A34A) : const Color(0xFF94A3B8),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),

                                      // Quick In/Out Toggle Action Button
                                      SizedBox(
                                        height: 40,
                                        child: isProcessing
                                            ? const Center(child: SizedBox(width: 24, height: 24, child: CircularProgressIndicator(strokeWidth: 2.5)))
                                            : ElevatedButton.icon(
                                                onPressed: () => _handleAttendanceToggle(helper),
                                                icon: Icon(
                                                  isInside ? Icons.logout_rounded : Icons.login_rounded,
                                                  size: 16,
                                                ),
                                                label: Text(
                                                  isInside ? 'Mark OUT' : 'Mark IN',
                                                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800),
                                                ),
                                                style: ElevatedButton.styleFrom(
                                                  elevation: 0,
                                                  backgroundColor: isInside ? const Color(0xFFEF4444) : const Color(0xFF10B981),
                                                  foregroundColor: Colors.white,
                                                  padding: const EdgeInsets.symmetric(horizontal: 12),
                                                  shape: RoundedRectangleBorder(
                                                    borderRadius: BorderRadius.circular(10),
                                                  ),
                                                ),
                                              ),
                                      ),
                                    ],
                                  ),
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
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (e, _) => Center(child: Text('Error: $e')),
              data: (logs) {
                if (logs.isEmpty) {
                  return const Center(
                    child: Text('No staff entry/exit logs recorded today.', style: TextStyle(color: Color(0xFF64748B))),
                  );
                }

                return ListView.separated(
                  padding: const EdgeInsets.all(AppSpacing.pagePadding),
                  itemCount: logs.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 10),
                  itemBuilder: (context, index) {
                    final log = logs[index];
                    final isEntry = log.type == 'ENTRY';

                    return Container(
                      padding: const EdgeInsets.all(12),
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
                              color: isEntry ? const Color(0xFFDCFCE7) : const Color(0xFFFEE2E2),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Icon(
                              isEntry ? Icons.arrow_downward_rounded : Icons.arrow_upward_rounded,
                              color: isEntry ? const Color(0xFF16A34A) : const Color(0xFFDC2626),
                              size: 18,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  '${log.helperName} (${log.helperType})',
                                  style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: Color(0xFF0F172A)),
                                ),
                                Text(
                                  'Flat ${log.flatNumber} • Gate: ${log.gateName} (by ${log.guardName})',
                                  style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                                ),
                              ],
                            ),
                          ),
                          Text(
                            log.formattedTime,
                            style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12, color: Color(0xFF1E3A8A)),
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
      ),
    );
  }

  String _formatTimestamp(String isoString) {
    try {
      final dt = DateTime.parse(isoString).toLocal();
      final hour = dt.hour > 12 ? dt.hour - 12 : (dt.hour == 0 ? 12 : dt.hour);
      final period = dt.hour >= 12 ? 'PM' : 'AM';
      final minute = dt.minute.toString().padLeft(2, '0');
      return '$hour:$minute $period';
    } catch (_) {
      return '';
    }
  }
}
