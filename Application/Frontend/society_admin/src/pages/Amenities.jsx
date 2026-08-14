import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  DollarSign, 
  Calendar, 
  Search, 
  Filter, 
  Check, 
  X, 
  Trash2, 
  Edit3, 
  Sparkles, 
  RefreshCw, 
  MapPin
} from 'lucide-react';
import { getSocietyAdminSession } from '../services/sessionManager';
import { societyAdminService } from '../services/societyAdminService';

const AMENITY_PRESET_IMAGES = [
  { label: 'Swimming Pool', url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=80', iconKey: 'pool' },
  { label: 'Clubhouse & Lounge', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80', iconKey: 'clubhouse' },
  { label: 'Fitness Center & Gym', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80', iconKey: 'gym' },
  { label: 'Tennis & Pickleball', url: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=600&q=80', iconKey: 'tennis' }
];

export default function Amenities() {
  const session = getSocietyAdminSession();
  const societyId = session?.societyId;

  const [activeTab, setActiveTab] = useState('facilities');
  const [amenities, setAmenities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [formData, setFormData] = useState({
    name: '',
    category: 'Sports & Fitness',
    description: '',
    capacity: 15,
    timings: '06:00 AM - 10:00 PM',
    fee: 'Free for Residents',
    pricePerHour: 0,
    location: 'Clubhouse Ground Floor',
    status: 'Available',
    coverUrl: AMENITY_PRESET_IMAGES[0].url,
    iconKey: 'pool',
    rules: 'Proper attire required. Prior booking mandatory.'
  });

  useEffect(() => {
    if (!societyId) {
      setLoading(false);
      return;
    }

    const unsubAmenity = societyAdminService.subscribeAmenities(
      societyId,
      (data) => {
        setAmenities(data);
        setLoading(false);
      },
      (err) => console.error("Amenities snapshot error:", err)
    );

    const unsubBookings = societyAdminService.subscribeAmenityBookings(
      societyId,
      (bData) => setBookings(bData),
      (err) => console.warn("Bookings snapshot notice:", err)
    );

    return () => {
      if (unsubAmenity) unsubAmenity();
      if (unsubBookings) unsubBookings();
    };
  }, [societyId]);

  const handleSaveAmenity = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSubmitting(true);
    try {
      await societyAdminService.createAmenity(societyId, {
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim(),
        capacity: Number(formData.capacity) || 10,
        timings: formData.timings.trim(),
        fee: formData.fee.trim(),
        pricePerHour: Number(formData.pricePerHour) || 0,
        location: formData.location.trim(),
        status: formData.status,
        coverUrl: formData.coverUrl,
        iconKey: formData.iconKey,
        rules: formData.rules.trim()
      });
      setIsModalOpen(false);
      alert(`Successfully saved ${formData.name}!`);
    } catch (error) {
      alert("Error saving amenity: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateBookingStatus = async (booking, newStatus) => {
    try {
      await societyAdminService.updateAmenityBookingStatus(societyId, booking.id, newStatus);
      alert(`Booking status updated to ${newStatus.toUpperCase()}!`);
    } catch (err) {
      alert("Error updating booking status: " + err.message);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchQuery = searchQuery === '' || 
      (b.residentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.flatNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.amenityName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'All' || (b.status || '').toLowerCase() === statusFilter.toLowerCase();
    return matchQuery && matchStatus;
  });

  if (loading) return <div style={{ padding: '36px', textAlign: 'center' }}>Loading Amenities & Bookings...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2>Society Amenities & Facilities</h2>
          <p>Manage society amenities, operating hours, resident bookings, and approvals</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={18} /> Add New Facility
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid var(--border-color)', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('facilities')}
          style={{ padding: '10px 18px', fontWeight: 800, border: 'none', background: 'none', borderBottom: activeTab === 'facilities' ? '3px solid var(--primary)' : '3px solid transparent' }}
        >
          <Building2 size={16} /> Facilities ({amenities.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          style={{ padding: '10px 18px', fontWeight: 800, border: 'none', background: 'none', borderBottom: activeTab === 'bookings' ? '3px solid var(--primary)' : '3px solid transparent' }}
        >
          <Calendar size={16} /> Reservations ({bookings.length})
        </button>
      </div>

      {activeTab === 'facilities' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {amenities.map((item) => (
            <div key={item.id} className="card" style={{ padding: '16px' }}>
              <h4>{item.name}</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.description}</p>
              <div style={{ fontSize: '12px', marginTop: '8px' }}>
                <div>⏱️ {item.timings || '06:00 AM - 10:00 PM'}</div>
                <div>📍 {item.location || 'Clubhouse'}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Resident</th>
                  <th>Facility</th>
                  <th>Date & Slot</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
                  <tr key={b.id}>
                    <td><strong>{b.residentName}</strong> (Flat {b.flatNumber})</td>
                    <td>{b.amenityName}</td>
                    <td>{b.bookingDate} ({b.timeSlot || 'All Day'})</td>
                    <td><span className="badge primary">{b.status}</span></td>
                    <td>
                      {b.status === 'pending' && (
                        <button className="btn btn-primary" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => handleUpdateBookingStatus(b, 'approved')}>
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Facility</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleSaveAmenity} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group">
                <label>Facility Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
