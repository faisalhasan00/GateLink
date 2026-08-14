import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import DemoModal from './DemoModal';
import { 
  UserCheck, 
  ShieldCheck, 
  User, 
  Building, 
  Wrench, 
  Truck, 
  Globe, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  X, 
  Activity,
  Layers,
  Lock,
  ChevronRight
} from 'lucide-react';

export default function EcosystemPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState('visitor');

  const nodes = [
    {
      id: 'visitor',
      title: 'Visitor',
      role: 'Guest / Cab / Delivery Agent',
      icon: <UserCheck size={28} color="#818CF8" />,
      color: '#818CF8',
      desc: 'Initiates entry request at gate via QR passcode scan or gatekeeper log.',
      dataInput: 'Pre-approved pass code or visitor phone/photo entry request',
      dataOutput: 'Transmits visitor credentials & gate pass token to Guard App',
      details: [
        '1-Tap QR passcode scanning at entry gates',
        'Automatic cab (Uber/Ola) and delivery (Amazon/Flipkart) classification',
        'Instant photo capture & blacklist cross-check',
        'Zero-wait pre-approved visitor entry'
      ]
    },
    {
      id: 'guard',
      title: 'Security Guard',
      role: 'Gatekeeper & Duty Officer',
      icon: <ShieldCheck size={28} color="#34D399" />,
      color: '#34D399',
      desc: 'Verifies visitor credentials and triggers real-time push alert to resident.',
      dataInput: 'Visitor request token & vehicle number plate log',
      dataOutput: 'Triggers high-priority push notification signal to Resident App',
      details: [
        'Multilingual Guard App (English, Hindi, Kannada, Tamil, etc.)',
        '5-second average gate entry verification',
        'Daily helper (Maid/Cook/Driver) attendance check-in',
        'Instant Emergency SOS siren receiver'
      ]
    },
    {
      id: 'resident',
      title: 'Resident',
      role: 'Flat Owner & Tenant',
      icon: <User size={28} color="#C084FC" />,
      color: '#C084FC',
      desc: 'Approves visitor entry, pays maintenance via Razorpay, & logs tickets.',
      dataInput: 'Visitor arrival push alert & monthly maintenance invoice',
      dataOutput: 'Transmits 1-tap entry approval, payment confirmation, or SOS panic alert',
      details: [
        '1-Tap visitor approval from lock screen notification',
        'Razorpay UPI/Card maintenance payment & instant PDF receipt',
        'Clubhouse, pool & tennis court slot reservation',
        '1-Tap Emergency SOS alert button for family safety'
      ]
    },
    {
      id: 'admin',
      title: 'Admin',
      role: 'Management Committee',
      icon: <Building size={28} color="#FBBF24" />,
      color: '#FBBF24',
      desc: 'Oversees financial ledgers, staff RBAC permissions, & helpdesk tickets.',
      dataInput: 'Razorpay settlement reports, complaint tickets, and gate traffic logs',
      dataOutput: 'Issues work-order tasks to staff, generates GST invoices, & publishes notices',
      details: [
        'Real-time society financial dashboard & 98%+ collection efficiency',
        'RBAC staff permission matrix for committee members',
        'Automated helpdesk ticket SLA management',
        'Centralized legal document vault & audit logs'
      ]
    },
    {
      id: 'staff',
      title: 'Maintenance Staff',
      role: 'Technician / Electrician / Plumber',
      icon: <Wrench size={28} color="#F87171" />,
      color: '#F87171',
      desc: 'Executes assigned work orders, resolves resident complaints, & orders vendor parts.',
      dataInput: 'Assigned complaint work order & technician SLA timer',
      dataOutput: 'Transmits ticket resolution status & requests vendor gate entry pass',
      details: [
        'Mobile work-order dispatch & technician SLA tracking',
        'Direct resident rating & work photo verification',
        'Inventory & spare parts request workflow',
        'Facility preventive asset maintenance checklist'
      ]
    },
    {
      id: 'vendor',
      title: 'Vendor',
      role: 'Contractor & Service Provider',
      icon: <Truck size={28} color="#38BDF8" />,
      color: '#38BDF8',
      desc: 'Fulfills facility contracts, Elevator/DG maintenance, & enters gate with QR badge.',
      dataInput: 'Vendor QR gate badge & servicing work order contract',
      dataOutput: 'Submits completed servicing logs & digital invoice to Admin',
      details: [
        'Time-bounded vendor QR entry pass verification',
        'Scheduled elevator, DG set, and water pump servicing logs',
        'Vendor GST invoice submission & approval pipeline',
        'Verified vendor badge credentials'
      ]
    },
    {
      id: 'society',
      title: 'Society OS',
      role: 'Unified RWA Platform',
      icon: <Globe size={28} color="#A7F3D0" />,
      color: '#A7F3D0',
      desc: 'Aggregates data signals from all 6 stakeholders into a 100% secure governance platform.',
      dataInput: 'Real-time telemetry & data events from all 6 ecosystem nodes',
      dataOutput: '100% Audit compliance, 24x7 gate security, & maximum property valuation',
      details: [
        '256-Bit SSL Data Encryption & AWS Cloud Infrastructure',
        'Multi-tenant data isolation & GDPR/DPDP privacy compliance',
        '1-Click automated PDF/Excel/CSV data exports',
        '99.9% Platform SLA availability guaranteed'
      ]
    }
  ];

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  return (
    <div style={{ backgroundColor: '#020617', color: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* Navbar */}
      <Navbar onOpenDemo={() => setIsDemoModalOpen(true)} />

      {/* Header Banner */}
      <section style={{
        paddingTop: '160px',
        paddingBottom: '50px',
        background: 'radial-gradient(circle at 50% 20%, #1E1B4B 0%, #0F172A 70%, #020617 100%)',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '30px', background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8', fontSize: '13px', fontWeight: 800, marginBottom: '16px' }}>
              <Zap size={14} /> LIVE CONNECTED ARCHITECTURE
            </div>
            <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-1.5px', margin: '0 0 16px 0' }}>
              The Connected GateLink Ecosystem
            </h1>
            <p style={{ fontSize: '18px', color: '#94A3B8', maxWidth: '760px', margin: '0 auto 20px auto', lineHeight: 1.6 }}>
              See how real-time data flows seamlessly between <strong style={{ color: '#FFFFFF' }}>Visitors, Security Guards, Residents, Admins, Staff, Vendors, and the Society OS</strong>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Interactive Ecosystem Visualization Canvas */}
      <section style={{ padding: '40px 0 100px 0', background: '#020617', position: 'relative' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Node Flow Track Bar */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
            borderRadius: '24px',
            padding: '32px 24px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)',
            marginBottom: '48px',
            position: 'relative'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <span style={{ fontSize: '11px', fontWeight: 900, color: '#818CF8', letterSpacing: '1px', textTransform: 'uppercase' }}>INTERACTIVE DATA PIPELINE (CLICK ANY NODE TO INSPECT)</span>
            </div>

            {/* Linear Animated Node Chain */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '12px', alignItems: 'center', position: 'relative' }}>
              
              {/* Background Connecting Glow Line */}
              <div style={{
                position: 'absolute',
                top: '42px',
                left: '6%',
                right: '6%',
                height: '4px',
                background: 'linear-gradient(90deg, #818CF8 0%, #34D399 20%, #C084FC 40%, #FBBF24 60%, #F87171 80%, #38BDF8 100%)',
                borderRadius: '2px',
                zIndex: 1,
                opacity: 0.6
              }} />

              {/* Individual Node Cards */}
              {nodes.map((n, idx) => {
                const isSelected = selectedNodeId === n.id;
                return (
                  <motion.div
                    key={n.id}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedNodeId(n.id)}
                    style={{
                      zIndex: 2,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center'
                    }}
                  >
                    {/* Node Icon Circle */}
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '20px',
                      background: isSelected ? n.color : 'rgba(15, 23, 42, 0.9)',
                      border: `2px solid ${isSelected ? '#FFFFFF' : n.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isSelected ? `0 0 25px ${n.color}` : '0 8px 20px rgba(0,0,0,0.4)',
                      transition: 'all 0.25s ease',
                      marginBottom: '12px'
                    }}>
                      {React.cloneElement(n.icon, { color: isSelected ? '#FFFFFF' : n.color })}
                    </div>

                    <div style={{ fontSize: '14px', fontWeight: 800, color: isSelected ? '#FFFFFF' : '#CBD5E1', marginBottom: '2px' }}>
                      {n.title}
                    </div>
                    <div style={{ fontSize: '10px', color: isSelected ? n.color : '#64748B', fontWeight: 700 }}>
                      STEP 0{idx + 1}
                    </div>
                  </motion.div>
                );
              })}

            </div>
          </div>

          {/* Selected Node Detailed Inspection Workspace */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
                borderRadius: '24px',
                padding: '40px',
                border: `1px solid ${selectedNode.color}40`,
                backdropFilter: 'blur(20px)',
                boxShadow: `0 20px 40px -15px ${selectedNode.color}20`,
                display: 'grid',
                gridTemplateColumns: '1.2fr 0.8fr',
                gap: '40px',
                alignItems: 'center'
              }}
            >
              
              {/* Left Details */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    background: `${selectedNode.color}20`,
                    border: `1px solid ${selectedNode.color}50`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {selectedNode.icon}
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 900, color: selectedNode.color, letterSpacing: '1px', textTransform: 'uppercase' }}>
                      {selectedNode.role}
                    </span>
                    <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                      {selectedNode.title} Node
                    </h2>
                  </div>
                </div>

                <p style={{ fontSize: '16px', color: '#CBD5E1', lineHeight: 1.6, marginBottom: '28px' }}>
                  {selectedNode.desc}
                </p>

                {/* Input & Output Telemetry Signals */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                  <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', marginBottom: '6px', letterSpacing: '0.5px' }}>📥 INPUT TELEMETRY SIGNAL</div>
                    <div style={{ fontSize: '13px', color: '#E2E8F0', fontWeight: 600 }}>{selectedNode.dataInput}</div>
                  </div>
                  <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: selectedNode.color, marginBottom: '6px', letterSpacing: '0.5px' }}>📤 OUTPUT BROADCAST SIGNAL</div>
                    <div style={{ fontSize: '13px', color: '#E2E8F0', fontWeight: 600 }}>{selectedNode.dataOutput}</div>
                  </div>
                </div>

                {/* Core Node Capabilities */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
                  {selectedNode.details.map((item) => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#F1F5F9', fontWeight: 600 }}>
                      <CheckCircle2 size={16} color={selectedNode.color} style={{ flexShrink: 0 }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setIsDemoModalOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '14px 28px',
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${selectedNode.color} 0%, #4F46E5 100%)`,
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: `0 4px 20px ${selectedNode.color}40`
                  }}
                >
                  <span>Explore {selectedNode.title} Integration</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* Right Live Stream Card */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.95)',
                borderRadius: '20px',
                padding: '28px',
                border: `1px solid ${selectedNode.color}40`,
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: selectedNode.color }} />
                    <span style={{ color: 'white', fontWeight: 800, fontSize: '13px' }}>REAL-TIME DATA SIGNAL</span>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 900, background: `${selectedNode.color}20`, color: selectedNode.color, padding: '3px 8px', borderRadius: '10px' }}>
                    ACTIVE STREAM
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontFamily: 'monospace', fontSize: '12px' }}>
                  <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', color: '#A5B4FC' }}>
                    event: <span style={{ color: '#FFFFFF' }}>"{selectedNode.id}_action_triggered"</span>
                  </div>
                  <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', color: '#34D399' }}>
                    status: <span style={{ color: '#FFFFFF' }}>"200 OK (0.04s latency)"</span>
                  </div>
                  <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', color: '#CBD5E1' }}>
                    encryption: <span style={{ color: '#FBBF24' }}>"AES-256 SSL TLS v1.3"</span>
                  </div>
                </div>

                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', color: '#94A3B8', fontSize: '12px' }}>
                  Seamlessly synchronized across iOS, Android & Web
                </div>
              </div>

            </motion.div>
          </AnimatePresence>

        </div>
      </section>

      {/* Footer */}
      <FooterSection />

      {/* Demo Modal */}
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
