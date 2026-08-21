import React from 'react';
import { usePushNotifications } from '../../features/notifications/hooks/usePushNotifications';
import NotificationHeader from '../../features/notifications/components/NotificationHeader';
import NotificationComposer from '../../features/notifications/components/NotificationComposer';
import MobileLockscreenPreview from '../../features/notifications/components/MobileLockscreenPreview';
import NotificationHistoryTable from '../../features/notifications/components/NotificationHistoryTable';

export default function PushNotifications() {
  const {
    form,
    setForm,
    societies,
    sending,
    lastResult,
    history,
    historyLoading,
    presetCategory,
    setPresetCategory,
    filteredPresets,
    applyPreset,
    handleSend,
  } = usePushNotifications();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '40px' }}>
      {/* 1. Universal Notification Banner */}
      <NotificationHeader totalBroadcasts={history.length} />

      {/* 2. Main Grid: Composer & Device Live Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 0.9fr)', gap: '24px', alignItems: 'start' }}>
        {/* Left: Compose Form */}
        <NotificationComposer
          form={form}
          setForm={setForm}
          societies={societies}
          sending={sending}
          lastResult={lastResult}
          presetCategory={presetCategory}
          setPresetCategory={setPresetCategory}
          filteredPresets={filteredPresets}
          applyPreset={applyPreset}
          handleSend={handleSend}
        />

        {/* Right: Realistic Mobile Lockscreen Preview */}
        <MobileLockscreenPreview
          category={form.category}
          title={form.title}
          body={form.body}
        />
      </div>

      {/* 3. Broadcast History & Telemetry Table */}
      <NotificationHistoryTable
        history={history}
        loading={historyLoading}
      />
    </div>
  );
}
