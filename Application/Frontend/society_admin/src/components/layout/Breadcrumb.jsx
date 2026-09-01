import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const PATH_NAME_MAP = {
  '': 'Dashboard',
  'residents': 'Resident Directory',
  'visitors': 'Visitor Gate Logs',
  'complaints': 'Helpdesk Complaints',
  'amenities': 'Amenity Bookings',
  'maintenance': 'Maintenance & Billing',
  'documents': 'Document Repository',
  'parking': 'Parking Allocation',
  'notices': 'Notice Board',
  'staff': 'Staff Management',
  'patrol': 'Guard Night Patrolling',
  'helpers': 'Helpers & Deliveries',
  'sos': 'Emergency SOS',
  'reports': 'Reports & Analytics',
  'legal': 'Terms & Compliance',
  'profile': 'Admin Profile',
  'settings': 'Society Settings',
  'super-admin': 'Super Admin',
  'societies': 'Society Management',
  'crm': 'CRM & Sales Leads',
  'ads': 'Ad Campaigns',
};

export default function Breadcrumb() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
      <Link to="/" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <Home size={13} />
      </Link>
      
      {pathSegments.length === 0 && (
        <>
          <ChevronRight size={12} />
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Dashboard</span>
        </>
      )}

      {pathSegments.map((segment, index) => {
        const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
        const isLast = index === pathSegments.length - 1;
        const name = PATH_NAME_MAP[segment] || segment;

        return (
          <React.Fragment key={url}>
            <ChevronRight size={12} />
            {isLast ? (
              <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{name}</span>
            ) : (
              <Link to={url} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>
                {name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
