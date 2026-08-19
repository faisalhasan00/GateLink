import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Download, Printer, X, ShieldCheck, Sparkles, Building2 } from 'lucide-react';

export default function GateQrGeneratorModal({ isOpen, onClose, societyId = 'SOC-001', societyName = 'Palm Meadows Residency', gateName = 'Main Gate 1' }) {
  const printRef = useRef(null);

  if (!isOpen) return null;

  const targetQrUrl = `https://gatelink.in/gate?soc=${encodeURIComponent(societyId)}&gate=${encodeURIComponent(gateName)}`;

  const handlePrint = () => {
    const printContent = printRef.current;
    const windowUrl = 'about:blank';
    const uniqueName = new Date().getTime();
    const windowName = 'Print' + uniqueName;
    const printWindow = window.open(windowUrl, windowName, 'left=200,top=50,width=800,height=900');

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>GateLink Gate QR Poster - ${societyName}</title>
            <style>
              body { font-family: 'Inter', sans-serif; text-align: center; padding: 40px; background: #ffffff; color: #0f172a; }
              .poster-card { border: 4px solid #1e3a8a; border-radius: 24px; padding: 40px; max-width: 500px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
              .header { font-size: 28px; font-weight: 900; color: #1e3a8a; margin-bottom: 4px; }
              .sub { font-size: 16px; color: #0ea5e9; font-weight: 700; margin-bottom: 24px; }
              .qr-box { padding: 24px; background: #f8fafc; border-radius: 20px; display: inline-block; border: 2px solid #e2e8f0; margin-bottom: 24px; }
              .instructions { font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 8px; }
              .desc { font-size: 14px; color: #64748b; margin-bottom: 24px; }
              .footer { font-size: 12px; color: #94a3b8; font-weight: 700; border-top: 1px solid #e2e8f0; padding-top: 16px; }
            </style>
          </head>
          <body>
            <div class="poster-card">
              <div class="header">🛡️ ${societyName}</div>
              <div class="sub">Gate Security Check-in • ${gateName}</div>
              <div class="qr-box">
                ${printContent.innerHTML}
              </div>
              <div class="instructions">📱 VISITING SOMEONE? SCAN QR TO CHECK-IN</div>
              <div class="desc">Scan with your Phone Camera to request instant gate approval from resident & security.</div>
              <div class="footer">POWERED BY GATELINK GATEKEEPER OS • NO APP DOWNLOAD REQUIRED</div>
            </div>
            <script>
              window.onload = function() { window.print(); window.close(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1200,
      padding: '20px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        maxWidth: '480px',
        width: '100%',
        padding: '28px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <QrCode size={22} color="#1E3A8A" />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 900, margin: 0, color: '#1E293B' }}>Gate Standee QR Generator</h3>
            <div style={{ fontSize: '12px', color: '#64748B' }}>{societyName} • {gateName}</div>
          </div>
        </div>

        {/* Poster Preview Card */}
        <div style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          color: '#FFFFFF',
          textAlign: 'center',
          marginBottom: '20px',
          border: '1px solid #334155'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#38BDF8', marginBottom: '4px' }}>
            Official Gate Standee Poster
          </div>
          <div style={{ fontSize: '16px', fontWeight: 900, marginBottom: '16px' }}>
            Scan QR to Self Check-in
          </div>

          <div ref={printRef} style={{
            display: 'inline-block',
            padding: '16px',
            background: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <QRCodeSVG
              value={targetQrUrl}
              size={180}
              level="H"
              includeMargin={false}
            />
          </div>

          <div style={{ marginTop: '14px', fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>
            URL: <span style={{ color: '#BAE6FD', fontWeight: 700 }}>{targetQrUrl}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handlePrint}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#1E3A8A',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Printer size={16} /> Print Gate Standee
          </button>

          <button
            onClick={onClose}
            style={{
              padding: '12px 18px',
              borderRadius: '10px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              color: '#475569',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
