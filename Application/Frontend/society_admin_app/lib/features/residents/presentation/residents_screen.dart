import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/providers/admin_providers.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/app_text_field.dart';
import '../../../core/widgets/state_views.dart';
import 'widgets/add_resident_sheet.dart';
import 'widgets/pending_resident_card.dart';
import 'widgets/resident_details_sheet.dart';
import 'widgets/resident_directory_item.dart';

class ResidentsScreen extends ConsumerStatefulWidget {
  const ResidentsScreen({super.key});

  @override
  ConsumerState<ResidentsScreen> createState() => _ResidentsScreenState();
}

class _ResidentsScreenState extends ConsumerState<ResidentsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final society = ref.watch(activeSocietyProvider);
    final residentsAsync = ref.watch(residentsStreamProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Residents Management'),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppColors.primaryNavy,
          labelColor: AppColors.primaryNavy,
          unselectedLabelColor: AppColors.textSecondary,
          labelStyle: const TextStyle(fontWeight: FontWeight.w700),
          tabs: [
            Tab(
              child: residentsAsync.maybeWhen(
                data: (list) {
                  final pendingCount =
                      list.where((r) => r.status == 'pending').length;
                  return Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text('Approvals'),
                      if (pendingCount > 0) ...[
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.accentAmber,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            pendingCount.toString(),
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ],
                  );
                },
                orElse: () => const Text('Approvals'),
              ),
            ),
            const Tab(text: 'Directory'),
          ],
        ),
      ),
      floatingActionButton: society != null
          ? FloatingActionButton.extended(
              onPressed: () =>
                  AddResidentBottomSheet.show(context, society.id),
              backgroundColor: AppColors.primaryNavy,
              icon: const Icon(Icons.person_add_alt_1, color: Colors.white),
              label: const Text(
                'Add Resident',
                style:
                    TextStyle(color: Colors.white, fontWeight: FontWeight.w700),
              ),
            )
          : null,
      body: residentsAsync.when(
        loading: () =>
            const LoadingStateWidget(message: 'Loading residents...'),
        error: (err, _) => ErrorStateWidget(
          message: 'Failed to load residents: ${err.toString()}',
          onRetry: () => ref.invalidate(residentsStreamProvider),
        ),
        data: (residents) {
          final pendingResidents =
              residents.where((r) => r.status == 'pending').toList();
          final approvedResidents =
              residents.where((r) => r.status != 'pending').toList();

          final filteredDirectory = approvedResidents.where((r) {
            final q = _searchQuery.toLowerCase();
            return r.name.toLowerCase().contains(q) ||
                r.flatNo.toLowerCase().contains(q) ||
                r.phone.contains(q) ||
                r.wing.toLowerCase().contains(q);
          }).toList();

          return TabBarView(
            controller: _tabController,
            children: [
              // TAB 1: PENDING APPROVALS
              pendingResidents.isEmpty
                  ? const EmptyStateWidget(
                      title: 'No Pending Approvals',
                      description:
                          'All resident onboarding requests have been reviewed.',
                      icon: Icons.check_circle_outline,
                    )
                  : ListView.separated(
                      padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
                      itemCount: pendingResidents.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 12),
                      itemBuilder: (context, index) {
                        final resident = pendingResidents[index];
                        return PendingResidentCard(
                          resident: resident,
                          onApprove: () async {
                            if (society != null) {
                              await ref
                                  .read(firestoreServiceProvider)
                                  .updateResidentStatus(
                                    society.id,
                                    resident.id,
                                    'approved',
                                  );
                            }
                          },
                          onReject: () async {
                            if (society != null) {
                              await ref
                                  .read(firestoreServiceProvider)
                                  .updateResidentStatus(
                                    society.id,
                                    resident.id,
                                    'rejected',
                                  );
                            }
                          },
                        );
                      },
                    ),

              // TAB 2: ACTIVE RESIDENTS DIRECTORY
              Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: AppTextField(
                      controller: _searchController,
                      hintText:
                          'Search by name, flat (e.g. A-402), or phone...',
                      prefixIcon:
                          const Icon(Icons.search, color: AppColors.textMuted),
                      onChanged: (val) =>
                          setState(() => _searchQuery = val),
                    ),
                  ),
                  Expanded(
                    child: filteredDirectory.isEmpty
                        ? const EmptyStateWidget(
                            title: 'No Residents Found',
                            description:
                                'No resident records match your search criteria.',
                            icon: Icons.person_search_outlined,
                          )
                        : ListView.separated(
                            padding: const EdgeInsets.fromLTRB(16, 0, 16, 80),
                            itemCount: filteredDirectory.length,
                            separatorBuilder: (_, __) =>
                                const SizedBox(height: 10),
                            itemBuilder: (context, index) {
                              final resident = filteredDirectory[index];
                              return ResidentDirectoryItem(
                                resident: resident,
                                onTap: () {
                                  if (society != null) {
                                    ResidentDetailsBottomSheet.show(
                                      context,
                                      resident: resident,
                                      societyId: society.id,
                                    );
                                  }
                                },
                              );
                            },
                          ),
                  ),
                ],
              ),
            ],
          );
        },
      ),
    );
  }
}
