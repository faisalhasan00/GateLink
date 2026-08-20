import React from 'react';
import { Search, Filter, ShieldCheck, CheckCircle, XCircle, FileText, Plus } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function MaintenanceTable({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  methodFilter,
  setMethodFilter,
  pendingVerifications,
  filteredBills,
  onGenerateClick,
  onApproveVerification,
  onRejectVerification,
  onSelectInvoice,
  onOpenPaymentModal
}) {
  return (
    <div className="card">
      <div className="card-header" style={{ flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 className="card-title">Society Billing & Collection Ledger</h3>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Real-time audit log of maintenance dues, payments, and gateway settlements
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search flat, name, invoice..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '8px 12px 8px 32px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontSize: '13px',
                width: '210px',
                outline: 'none',
                background: 'var(--bg-color)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={14} color="var(--text-muted)" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '8px 10px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontSize: '13px',
                background: 'var(--bg-color)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            >
              <option value="All">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="pending_verification">Pending Verification</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <Button variant="primary" onClick={onGenerateClick} icon={<Plus size={16} />}>
            Generate Bills
          </Button>
        </div>
      </div>

      {/* Pending Offline UTR Verification Banner */}
      {pendingVerifications.length > 0 && (
        <div style={{ margin: '0 20px 16px 20px', padding: '14px 18px', borderRadius: '10px', background: '#FEF3C7', border: '1px solid #F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={20} color="#D97706" />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#92400E' }}>
                {pendingVerifications.length} Offline Payment UTR Verification(s) Pending
              </div>
              <div style={{ fontSize: '12px', color: '#B45309' }}>
                Residents have submitted bank transfer UTR numbers awaiting management committee clearance.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoices Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Invoice No.</th>
              <th>Flat & Resident</th>
              <th>Billing Month</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Payment Info</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-secondary)' }}>
                  No maintenance records matching the selected filter criteria.
                </td>
              </tr>
            ) : (
              filteredBills.map((bill) => {
                const isPaid = bill.status === 'paid';
                const isPendingVerif = bill.status === 'pending_verification';
                const isOverdue = bill.status === 'overdue' || (bill.status === 'pending' && new Date(bill.dueDate) < new Date());

                return (
                  <tr key={bill.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1E3A8A' }}>
                        {bill.billNumber || bill.id.slice(0, 8)}
                      </span>
                    </td>
                    <td>
                      <div>
                        <strong style={{ fontSize: '14px' }}>{bill.flatNumber || 'Flat N/A'}</strong>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{bill.residentName || 'Resident'}</div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>{bill.month || bill.title}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', color: isOverdue ? 'var(--danger)' : 'var(--text-secondary)' }}>
                        {bill.dueDate || '15th of month'}
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontSize: '15px', color: 'var(--text-primary)' }}>
                        ₹{Number(bill.amount || 0).toLocaleString()}
                      </strong>
                    </td>
                    <td>
                      {isPaid ? (
                        <div style={{ fontSize: '11px', color: '#16A34A' }}>
                          <div>{bill.paymentMethod || 'Online Gateway'}</div>
                          {bill.transactionId && (
                            <code style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{bill.transactionId.slice(0, 14)}</code>
                          )}
                        </div>
                      ) : isPendingVerif ? (
                        <div style={{ fontSize: '11px', color: '#D97706' }}>
                          <div>UTR Submitted</div>
                          <code style={{ fontSize: '10px' }}>{bill.utrNumber || 'Awaiting Check'}</code>
                        </div>
                      ) : (
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Unpaid</span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          isPaid ? 'success' : isPendingVerif ? 'warning' : isOverdue ? 'danger' : 'secondary'
                        }`}
                      >
                        {isPaid ? 'Paid' : isPendingVerif ? 'Verifying' : isOverdue ? 'Overdue' : 'Pending'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          onClick={() => onSelectInvoice(bill)}
                        >
                          <FileText size={12} /> View
                        </button>
                        {isPendingVerif && (
                          <>
                            <button
                              className="btn btn-primary"
                              style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}
                              onClick={() => onApproveVerification(bill)}
                            >
                              <CheckCircle size={12} /> Clear
                            </button>
                            <button
                              className="btn btn-outline"
                              style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                              onClick={() => onRejectVerification(bill)}
                            >
                              <XCircle size={12} />
                            </button>
                          </>
                        )}
                        {!isPaid && !isPendingVerif && (
                          <button
                            className="btn btn-outline"
                            style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--primary)' }}
                            onClick={() => onOpenPaymentModal(bill)}
                          >
                            Record Pay
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
