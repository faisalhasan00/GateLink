import React from 'react';
import { Printer, Shield, QrCode } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function PrintableQrTags({ checkpoints, societyName }) {
  const handlePrint = () => {
    window.print();
  };

  if (!checkpoints || checkpoints.length === 0) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
        <QrCode size={48} style={{ color: '#94A3B8', margin: '0 auto 12px' }} />
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1E293B', margin: 0 }}>No Checkpoints to Print</h3>
        <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
          Create patrol checkpoints first under the "Checkpoints Manager" tab to generate printable wall placards.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Top Action Bar (hidden when printing) */}
      <div className="no-print" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        backgroundColor: '#FFFFFF',
        padding: '16px 20px',
        borderRadius: '14px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Printable Wall Placards ({checkpoints.length} Checkpoints)
          </h3>
          <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0' }}>
            High-resolution QR code tags ready for laminating and perimeter wall mounting.
          </p>
        </div>

        <Button onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}>
          <Printer size={16} /> Print All QR Placards
        </Button>
      </div>

      {/* Printable Grid */}
      <div className="printable-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px',
      }}>
        {checkpoints.map((cp) => {
          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(cp.qrPayload || `gatelink://patrol?code=${cp.code}`)}`;

          return (
            <div
              key={cp.id}
              className="qr-placard-card"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '2px solid #0F172A',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                pageBreakInside: 'avoid',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Shield size={16} color="#1E3A8A" />
                <span style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '1px', color: '#1E3A8A', textTransform: 'uppercase' }}>
                  GateLink Security Patrol Point
                </span>
              </div>

              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginBottom: '2px' }}>
                {societyName || 'GateLink Community'}
              </div>

              {/* Code Badge */}
              <div style={{
                backgroundColor: '#1E3A8A',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: 900,
                padding: '4px 16px',
                borderRadius: '999px',
                margin: '8px 0',
                letterSpacing: '0.5px'
              }}>
                {cp.code}
              </div>

              {/* Checkpoint Name & Area */}
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#1E293B' }}>
                {cp.name}
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', fontWeight: 600 }}>
                📍 {cp.area}
              </div>

              {/* High-Res QR Code Image */}
              <div style={{
                margin: '16px 0',
                padding: '12px',
                backgroundColor: '#FFFFFF',
                border: '2px solid #E2E8F0',
                borderRadius: '12px'
              }}>
                <img
                  src={qrUrl}
                  alt={`QR for ${cp.code}`}
                  style={{ width: '180px', height: '180px', display: 'block' }}
                />
              </div>

              {/* Instructions / Footer */}
              <div style={{ fontSize: '10.5px', color: '#475569', lineHeight: 1.3, maxWidth: '260px' }}>
                {cp.instructions || 'Security Guards: Scan with GateLink Guard App on every patrol round.'}
              </div>

              <div style={{ fontSize: '9px', color: '#94A3B8', marginTop: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Sequence Order: #{cp.order || 1} • Auto-Logged with GPS Stamp
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-grid, .printable-grid * {
            visibility: visible;
          }
          .printable-grid {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 16px !important;
          }
          .no-print {
            display: none !important;
          }
          .qr-placard-card {
            border: 2px solid #000000 !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>
    </div>
  );
}
