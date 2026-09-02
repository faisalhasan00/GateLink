import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { usePolls } from '../features/polls/hooks/usePolls';
import { PollsHeader } from '../features/polls/components/PollsHeader';
import { PollCard } from '../features/polls/components/PollCard';
import { CreatePollModal } from '../features/polls/components/CreatePollModal';
import { PollsEmptyState } from '../features/polls/components/PollsEmptyState';

export default function PollsPage() {
  const {
    polls,
    loading,
    isModalOpen,
    setIsModalOpen,
    isSubmitting,
    toastMessage,
    formData,
    setFormData,
    openCreateModal,
    handleAddOption,
    handleRemoveOption,
    handleOptionChange,
    handleCreatePoll,
    handleClosePoll,
    handleDeletePoll,
    handleExportVotes,
    metrics,
  } = usePolls();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div 
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 9999,
            backgroundColor: '#16A34A',
            color: '#FFFFFF',
            padding: '12px 22px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: 700,
            fontSize: '14px'
          }}
        >
          <CheckCircle2 size={20} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner & Metrics */}
      <PollsHeader metrics={metrics} onOpenCreateModal={openCreateModal} />

      {/* Polls Grid or Empty State */}
      {loading ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)', borderRadius: '16px' }}>
          <p>Loading society polls &amp; voting telemetry...</p>
        </div>
      ) : polls.length === 0 ? (
        <PollsEmptyState onOpenCreateModal={openCreateModal} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
          {polls.map((poll) => (
            <PollCard
              key={poll.id}
              poll={poll}
              onExportVotes={handleExportVotes}
              onClosePoll={handleClosePoll}
              onDeletePoll={handleDeletePoll}
            />
          ))}
        </div>
      )}

      {/* Create Poll Modal */}
      <CreatePollModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onAddOption={handleAddOption}
        onRemoveOption={handleRemoveOption}
        onOptionChange={handleOptionChange}
        onSubmit={handleCreatePoll}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
