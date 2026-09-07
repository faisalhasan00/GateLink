import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  CreditCard, 
  ShieldCheck, 
  Wrench, 
  Megaphone, 
  Waves 
} from 'lucide-react';

export default function SocietyModulesGrid({ isDark }) {
  return (
    <section style={{ marginBottom: '70px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '12px' }}>
          Key Modules for RWA Management
        </h2>
        <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '680px', margin: '0 auto' }}>
          GateLink replaces disjointed spreadsheets, paper registers, and manual tracking with dedicated modules built specifically for housing society administration.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Module 1 */}
        <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <Building2 size={26} color="#0EA5E9" />
            <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>Resident &amp; Property Directory</h3>
          </div>
          <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '14px' }}>
            Maintain a centralized database of flat owners, verified tenants, family members, and assigned parking slots. Manage occupancy records, flat handovers, and emergency contact details with role-based privacy controls.
          </p>
          <div style={{ fontSize: '13px', color: '#0EA5E9', fontWeight: 700 }}>
            ✓ Flat-wise member roster &amp; parking slot allocation
          </div>
        </div>

        {/* Module 2 */}
        <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <CreditCard size={26} color="#0EA5E9" />
            <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>Automated Maintenance Billing</h3>
          </div>
          <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '14px' }}>
            Generate automated monthly invoices, enable instant UPI and card payments with digital receipts, and track collection dues in real time. Learn more about our <Link to="/maintenance-management" style={{ color: '#0EA5E9', fontWeight: 700, textDecoration: 'none' }}>society maintenance billing software</Link>.
          </p>
          <div style={{ fontSize: '13px', color: '#0EA5E9', fontWeight: 700 }}>
            ✓ Online payments, auto receipts &amp; defaulter tracking
          </div>
        </div>

        {/* Module 3 */}
        <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <ShieldCheck size={26} color="#0EA5E9" />
            <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>Gate Security &amp; Visitor Control</h3>
          </div>
          <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '14px' }}>
            Equip security staff with our digital gatekeeper terminal to verify guests, scan QR passes, and log deliveries. Explore our dedicated <Link to="/visitor-management" style={{ color: '#0EA5E9', fontWeight: 700, textDecoration: 'none' }}>visitor management system</Link> and <Link to="/security-management" style={{ color: '#0EA5E9', fontWeight: 700, textDecoration: 'none' }}>guard security app</Link>.
          </p>
          <div style={{ fontSize: '13px', color: '#0EA5E9', fontWeight: 700 }}>
            ✓ QR guest passes, delivery verification &amp; SOS sirens
          </div>
        </div>

        {/* Module 4 */}
        <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <Wrench size={26} color="#0EA5E9" />
            <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>Helpdesk &amp; Complaint Ticketing</h3>
          </div>
          <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '14px' }}>
            Enable residents to register maintenance requests for plumbing, electrical, and general issues directly from their phone. Management committees can assign tickets to staff and monitor resolution status transparently.
          </p>
          <div style={{ fontSize: '13px', color: '#0EA5E9', fontWeight: 700 }}>
            ✓ Ticket categorization, photo attachments &amp; status updates
          </div>
        </div>

        {/* Module 5 */}
        <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <Megaphone size={26} color="#0EA5E9" />
            <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>Digital Notice Board &amp; Broadcasts</h3>
          </div>
          <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '14px' }}>
            Publish official society announcements, meeting minutes, and maintenance schedules directly to resident mobile apps. Maintain an organized digital archive of society documents and circulars.
          </p>
          <div style={{ fontSize: '13px', color: '#0EA5E9', fontWeight: 700 }}>
            ✓ Instant circular alerts &amp; digital document repository
          </div>
        </div>

        {/* Module 6 */}
        <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '28px', borderRadius: '16px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <Waves size={26} color="#0EA5E9" />
            <h3 style={{ fontSize: '19px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>Clubhouse &amp; Amenity Booking</h3>
          </div>
          <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.65, marginBottom: '14px' }}>
            Avoid booking conflicts for shared society amenities. Residents can view real-time slot availability and reserve the clubhouse, party hall, swimming pool, or sports courts with instant confirmation.
          </p>
          <div style={{ fontSize: '13px', color: '#0EA5E9', fontWeight: 700 }}>
            ✓ Conflict-free slot scheduling &amp; transparent guidelines
          </div>
        </div>
      </div>
    </section>
  );
}
