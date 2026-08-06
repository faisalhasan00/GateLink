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
  ShieldAlert, 
  RefreshCw, 
  MapPin, 
  Tag, 
  FileText
} from 'lucide-react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  setDoc, 
  addDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db } from '../firebase';
import { getSocietyAdminSession } from '../services/sessionManager';

/**
 * Preset amenity cover photos for high-impact visual design
 */
const AMENITY_PRESET_IMAGES = [
  { label: 'Swimming Pool', url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=80', iconKey: 'pool' },
  { label: 'Clubhouse & Lounge', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80', iconKey: 'clubhouse' },
  { label: 'Fitness Center & Gym', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80', iconKey: 'gym' },
  { label: 'Tennis & Pickleball', url: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=600&q=80', iconKey: 'tennis' },
  { label: 'Banquet & Party Hall', url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80', iconKey: 'clubhouse' },
  { label: 'Badminton Court', url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80', iconKey: 'badminton' }
];

export default function Amenities() {
  const session = getSocietyAdminSession();
  const societyId = session?.societyId || 'SOC-001';

  // Navigation Tabs
  const [activeTab, setActiveTab] = useState('facilities'); // 'facilities' or 'bookings'

  // Firestore Collections State
  const [amenities, setAmenities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // Search & Filter State for Bookings
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Form Initial State
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

  // 1. Stream Amenities & Bookings from Firestore
  useEffect(() => {
    // Amenities Stream
    const qAmenity = query(collection(db, `societies/${societyId}/amenities`));
    const unsubAmenity = onSnapshot(qAmenity, (snapshot) => {
      const data = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      setAmenities(data);
      setLoading(false);
    }, (err) => {
      console.error("Amenities snapshot error:", err);
      setLoading(false);
    });

    // Bookings Stream
    const qBookings = query(collection(db, `societies/${societyId}/amenity_bookings`), orderBy('createdAt', 'desc'));
    const unsubBookings = onSnapshot(qBookings, (snapshot) => {
      const bData = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      setBookings(bData);
    }, (err) => {
      console.warn("Bookings snapshot notice:", err);
    });

    return () => {
      unsubAmenity();
      unsubBookings();
    };
  }, [societyId]);

  // Handle Form Input Changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Select Preset Image
  const handleSelectPreset = (preset) => {
    setFormData(prev => ({
      ...prev,
      coverUrl: preset.url,
      iconKey: preset.iconKey
    }));
  };

  // Open Modal for Create or Edit
  const openCreateModal = () => {
    setEditingAmenity(null);
    setFormData({
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
    setIsModalOpen(true);
  };

  const openEditModal = (amenity) => {
    setEditingAmenity(amenity);
    setFormData({
      name: amenity.name || '',
      category: amenity.category || 'Sports & Fitness',
      description: amenity.description || '',
      capacity: amenity.capacity || 15,
      timings: amenity.timings || amenity.timing || '06:00 AM - 10:00 PM',
      fee: amenity.fee || 'Free for Residents',
      pricePerHour: amenity.pricePerHour || 0,
      location: amenity.location || 'Main Clubhouse',
      status: amenity.status || 'Available',
      coverUrl: amenity.coverUrl || amenity.imageUrl || AMENITY_PRESET_IMAGES[0].url,
      iconKey: amenity.iconKey || 'pool',
      rules: amenity.rules || 'Prior booking mandatory.'
    });
    setIsModalOpen(true);
  };

  // Save Amenity Handler
  const handleSaveAmenity = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSubmitting(true);
    try {
      const docId = editingAmenity 
        ? editingAmenity.id 
        : formData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_');

      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim(),
        capacity: Number(formData.capacity) || 10,
        timings: formData.timings.trim(),
        timing: formData.timings.trim(),
        fee: formData.fee.trim(),
        pricePerHour: Number(formData.pricePerHour) || 0,
        location: formData.location.trim(),
        status: formData.status,
        available: formData.status === 'Available',
        coverUrl: formData.coverUrl,
        imageUrl: formData.coverUrl,
        iconKey: formData.iconKey,
        rules: formData.rules.trim(),
        updatedAt: new Date().toISOString()
      };

      if (!editingAmenity) {
        payload.createdAt = new Date().toISOString();
      }

      await setDoc(doc(db, `societies/${societyId}/amenities`, docId), payload, { merge: true });
      setIsModalOpen(false);
      alert(editingAmenity ? `Successfully updated ${formData.name}!` : `Successfully added ${formData.name}!`);
    } catch (error) {
      console.error("Error saving amenity:", error);
      alert("Error saving amenity: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Amenity Status (Available vs Maintenance)
  const toggleAmenityStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Available' ? 'Maintenance' : 'Available';
    try {
      await updateDoc(doc(db, `societies/${societyId}/amenities`, id), {
        status: newStatus,
        available: newStatus === 'Available'
      });
    } catch (err) {
      alert("Error updating status: " + err.message);
    }
  };

  // Delete Amenity
  const handleDeleteAmenity = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete amenity "${name}"?`)) return;
    try {
      await deleteDoc(doc(db, `societies/${societyId}/amenities`, id));
    } catch (err) {
      alert("Error deleting amenity: " + err.message);
    }
  };

  // Seed Default Amenities
  const handleSeedAmenities = async () => {
    setSeeding(true);
    try {
      const defaults = [
        {
          id: 'swimming_pool',
          name: 'Olympic Swimming Pool',
          category: 'Sports & Fitness',
          description: 'Temperature-controlled lap pool with dedicated kids pool area and lounging deck.',
          capacity: 25,
          timings: '06:00 AM - 09:00 PM',
          fee: 'Free for Residents',
          pricePerHour: 0,
          location: 'Clubhouse Level 1',
          status: 'Available',
          coverUrl: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=80',
          iconKey: 'pool',
          rules: 'Proper swimwear mandatory. Children under 10 must be accompanied by an adult.'
        },
        {
          id: 'grand_clubhouse',
          name: 'Grand Clubhouse & Lawn',
          category: 'Events & Party',
          description: 'Luxury air-conditioned hall with sound system for birthday parties and society events.',
          capacity: 100,
          timings: '09:00 AM - 11:00 PM',
          fee: '₹1,500 / Hour',
          pricePerHour: 1500,
          location: 'Central Lawn Complex',
          status: 'Available',
          coverUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
          iconKey: 'clubhouse',
          rules: 'Security deposit required. Music must be turned down by 10:00 PM.'
        },
        {
          id: 'fitness_gym',
          name: 'Fitness & Gym Center',
          category: 'Sports & Fitness',
          description: 'Fully equipped cardio and strength training gym with certified personal trainers.',
          capacity: 30,
          timings: '05:00 AM - 11:00 PM',
          fee: 'Free for Residents',
          pricePerHour: 0,
          location: 'Block A Ground Floor',
          status: 'Available',
          coverUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
          iconKey: 'gym',
          rules: 'Gym shoes and towel required. Re-rack weights after use.'
        },
        {
          id: 'tennis_court',
          name: 'Tennis & Pickleball Court',
          category: 'Sports & Fitness',
          description: 'Synthetic floodlit court suitable for tennis, pickleball, and evening matches.',
          capacity: 8,
          timings: '06:00 AM - 10:00 PM',
          fee: '₹200 / Hour',
          pricePerHour: 200,
          location: 'Sports Complex Court 1',
          status: 'Available',
          coverUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=600&q=80',
          iconKey: 'tennis',
          rules: 'Non-marking shoes required. Maximum 1 hour slot per booking.'
        }
      ];

      for (const item of defaults) {
        await setDoc(doc(db, `societies/${societyId}/amenities`, item.id), {
          ...item,
          available: true,
          createdAt: new Date().toISOString()
        }, { merge: true });
      }
      alert('Successfully seeded luxury society amenities!');
    } catch (err) {
      alert('Error seeding amenities: ' + err.message);
    } finally {
      setSeeding(false);
    }
  };

  // Booking Actions: Approve / Reject / Delete
  const handleUpdateBookingStatus = async (booking, newStatus, rejectionReason = '') => {
    try {
      await updateDoc(doc(db, `societies/${societyId}/amenity_bookings`, booking.id), {
        status: newStatus,
        rejectionReason: rejectionReason || null,
        updatedAt: new Date().toISOString()
      });

      // Send Instant Real-Time In-App Notification to Resident
      if (booking.residentUid) {
        try {
          const title = newStatus === 'approved' 
            ? '✅ Amenity Booking Confirmed' 
            : '❌ Amenity Booking Update';
          const msg = newStatus === 'approved'
            ? `Your booking for ${booking.amenityName} on ${booking.bookingDate || 'scheduled date'} (${booking.timeSlot || 'slot'}) has been APPROVED!`
            : `Your booking for ${booking.amenityName} was declined. ${rejectionReason ? `Reason: ${rejectionReason}` : ''}`;

          await addDoc(collection(db, `societies/${societyId}/users/${booking.residentUid}/notifications`), {
            title: title,
            message: msg,
            type: 'amenity',
            bookingId: booking.id,
            read: false,
            createdAt: new Date().toISOString()
          });
        } catch (notifErr) {
          console.warn("Notification send notice:", notifErr);
        }
      }

      alert(`Booking status updated to ${newStatus.toUpperCase()}!`);
    } catch (err) {
      alert("Error updating booking status: " + err.message);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking record?')) return;
    try {
      await deleteDoc(doc(db, `societies/${societyId}/amenity_bookings`, id));
    } catch (err) {
      alert("Error deleting booking: " + err.message);
    }
  };

  // Filter Bookings Roster
  const filteredBookings = bookings.filter(b => {
    const matchQuery = searchQuery === '' || 
      (b.residentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.flatNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.amenityName || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchStatus = statusFilter === 'All' || (b.status || '').toLowerCase() === statusFilter.toLowerCase();
    return matchQuery && matchStatus;
  });

  // Calculate Metrics
  const pendingBookingsCount = bookings.filter(b => (b.status || '').toLowerCase() === 'pending').length;
  const approvedBookingsCount = bookings.filter(b => (b.status || '').toLowerCase() === 'approved').length;
  const totalRevenue = bookings
    .filter(b => (b.status || '').toLowerCase() === 'approved')
    .reduce((sum, b) => sum + (Number(b.amount) || Number(b.pricePerHour) || 0), 0);

  if (loading) {
    return (
      <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '12px', fontWeight: 600 }}>Loading Amenities & Bookings Console...</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Page Title Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
            Society Amenities & Facilities
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Manage society amenities, operating hours, resident bookings, and approvals
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {amenities.length === 0 && (
            <button 
              type="button" 
              className="btn btn-outline"
              disabled={seeding}
              onClick={handleSeedAmenities}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Sparkles size={16} /> {seeding ? 'Seeding...' : 'Seed Default Amenities'}
            </button>
          )}
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={openCreateModal}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={18} /> Add New Facility
          </button>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '18px 20px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Active Facilities</span>
            <Building2 size={20} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: 'var(--text-primary)', marginTop: '8px' }}>
            {amenities.filter(a => a.status === 'Available').length} <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>/ {amenities.length} total</span>
          </div>
        </div>

        <div className="card" style={{ padding: '18px 20px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Pending Approvals</span>
            <Clock size={20} color="#D97706" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#D97706', marginTop: '8px' }}>
            {pendingBookingsCount}
          </div>
        </div>

        <div className="card" style={{ padding: '18px 20px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Confirmed Bookings</span>
            <Calendar size={20} color="var(--secondary)" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: 'var(--secondary)', marginTop: '8px' }}>
            {approvedBookingsCount}
          </div>
        </div>

        <div className="card" style={{ padding: '18px 20px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Booking Revenue</span>
            <DollarSign size={20} color="#059669" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#059669', marginTop: '8px' }}>
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid var(--border-color)', marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('facilities')}
          style={{
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: 800,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'facilities' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'facilities' ? 'var(--primary)' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Building2 size={16} /> Society Facilities Catalog ({amenities.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('bookings')}
          style={{
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: 800,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'bookings' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'bookings' ? 'var(--primary)' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Calendar size={16} /> Resident Slot Reservations ({bookings.length})
          {pendingBookingsCount > 0 && (
            <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 900 }}>
              {pendingBookingsCount} Pending
            </span>
          )}
        </button>
      </div>

      {/* ── TAB 1: FACILITIES CATALOG GRID ────────────────────────────────── */}
      {activeTab === 'facilities' && (
        <div>
          {amenities.length === 0 ? (
            <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
              <Building2 size={42} style={{ opacity: 0.3, marginBottom: '12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>No Amenities Configured Yet</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '8px 0 20px 0' }}>
                Add your society's swimming pool, clubhouse, tennis courts, or gym to allow residents to book slots online.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button type="button" className="btn btn-outline" onClick={handleSeedAmenities} disabled={seeding}>
                  <Sparkles size={16} /> Seed Default Amenities
                </button>
                <button type="button" className="btn btn-primary" onClick={openCreateModal}>
                  <Plus size={16} /> Add First Facility
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {amenities.map((item) => {
                const isAvail = item.status === 'Available';
                return (
                  <div key={item.id} className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: '14px', display: 'flex', flexDirection: 'column' }}>
                    {/* Cover Image Banner */}
                    <div style={{ height: '150px', width: '100%', position: 'relative', overflow: 'hidden', background: '#E2E8F0' }}>
                      <img 
                        src={item.coverUrl || item.imageUrl || AMENITY_PRESET_IMAGES[0].url} 
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = AMENITY_PRESET_IMAGES[0].url; }}
                      />
                      <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                        <span className={`badge ${isAvail ? 'success' : 'danger'}`} style={{ fontWeight: 800, textTransform: 'uppercase' }}>
                          {isAvail ? '● Available' : '● Maintenance / Closed'}
                        </span>
                      </div>
                      <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', color: '#FFFFFF', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>
                        {item.category || 'General'}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h4 style={{ fontSize: '17px', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                          {item.name}
                        </h4>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 14px 0', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {item.description || 'No detailed description provided.'}
                        </p>

                        {/* Facility Details Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'var(--bg-color)', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontWeight: 600 }}>
                            <Clock size={14} color="var(--primary)" />
                            <span>{item.timings || item.timing || '6 AM - 10 PM'}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontWeight: 600 }}>
                            <Users size={14} color="var(--primary)" />
                            <span>Cap: {item.capacity || 10} Persons</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontWeight: 600 }}>
                            <DollarSign size={14} color="#059669" />
                            <span>{item.fee || 'Free'}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontWeight: 600 }}>
                            <MapPin size={14} color="var(--primary)" />
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.location || 'Clubhouse'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                        <button 
                          type="button"
                          className="btn btn-outline" 
                          style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          onClick={() => openEditModal(item)}
                        >
                          <Edit3 size={14} /> Edit
                        </button>

                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            className="btn btn-outline"
                            style={{ padding: '6px 12px', fontSize: '12px', color: isAvail ? 'var(--danger)' : 'var(--secondary)', borderColor: isAvail ? 'var(--danger)' : 'var(--secondary)' }}
                            onClick={() => toggleAmenityStatus(item.id, item.status)}
                          >
                            {isAvail ? <><XCircle size={14} /> Close</> : <><CheckCircle size={14} /> Reopen</>}
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline"
                            style={{ padding: '6px 10px', fontSize: '12px', color: 'var(--danger)', borderColor: 'var(--border-color)' }}
                            onClick={() => handleDeleteAmenity(item.id, item.name)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: RESIDENT SLOT RESERVATIONS & BOOKINGS ──────────────────── */}
      {activeTab === 'bookings' && (
        <div className="card">
          {/* Roster Filter Bar */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            {/* Search Box */}
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search resident, flat, or amenity..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }}
              />
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={14} color="var(--text-secondary)" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Status:</span>
              {['All', 'Pending', 'Approved', 'Rejected', 'Cancelled'].map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: statusFilter === st ? 'var(--primary)' : 'var(--bg-color)',
                    color: statusFilter === st ? '#FFFFFF' : 'var(--text-secondary)'
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings Table */}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Resident & Flat</th>
                  <th>Amenity Facility</th>
                  <th>Booking Date & Slot</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action Approval</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-secondary)' }}>
                      No resident amenity bookings found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => {
                    const st = (b.status || 'pending').toLowerCase();
                    return (
                      <tr key={b.id}>
                        <td>
                          <div>
                            <strong style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{b.residentName || 'Resident'}</strong>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                              Flat: {b.flatNumber || b.hostFlat || 'N/A'} {b.phone ? `• ${b.phone}` : ''}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Building2 size={16} color="var(--primary)" />
                            <strong style={{ fontSize: '13px' }}>{b.amenityName || 'Amenity Facility'}</strong>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>{b.bookingDate || 'Scheduled Date'}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={11} /> {b.timeSlot || b.slot || 'All Day'}
                            </div>
                          </div>
                        </td>
                        <td>
                          <strong style={{ color: '#059669', fontSize: '13px' }}>
                            {b.amount ? `₹${b.amount}` : b.pricePerHour ? `₹${b.pricePerHour}` : 'Free'}
                          </strong>
                        </td>
                        <td>
                          <span className={`badge ${
                            st === 'approved' ? 'success' : 
                            st === 'pending' ? 'warning' : 'danger'
                          }`} style={{ textTransform: 'uppercase', fontWeight: 800 }}>
                            {st}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            {st === 'pending' && (
                              <>
                                <button
                                  type="button"
                                  className="btn btn-outline"
                                  style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--secondary)', borderColor: 'var(--secondary)' }}
                                  onClick={() => handleUpdateBookingStatus(b, 'approved')}
                                >
                                  <Check size={14} /> Approve
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-outline"
                                  style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                                  onClick={() => {
                                    const reason = prompt('Optional reason for rejecting booking:');
                                    handleUpdateBookingStatus(b, 'rejected', reason || '');
                                  }}
                                >
                                  <X size={14} /> Reject
                                </button>
                              </>
                            )}

                            {st === 'approved' && (
                              <button
                                type="button"
                                className="btn btn-outline"
                                style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--danger)', borderColor: 'var(--border-color)' }}
                                onClick={() => handleUpdateBookingStatus(b, 'cancelled', 'Cancelled by Admin')}
                              >
                                Cancel Slot
                              </button>
                            )}

                            <button
                              type="button"
                              className="btn-icon"
                              onClick={() => handleDeleteBooking(b.id)}
                              title="Delete Record"
                            >
                              <Trash2 size={14} color="var(--danger)" />
                            </button>
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
      )}

      {/* ── CREATE / EDIT AMENITY MODAL ───────────────────────────────────── */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '16px', padding: '24px' }}>
            <div className="card-header" style={{ margin: '-24px -24px 20px -24px', padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="card-title" style={{ fontSize: '18px', fontWeight: 800 }}>
                {editingAmenity ? 'Edit Facility Profile' : 'Add New Society Facility'}
              </h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveAmenity} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Preset Image Cover Selector */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Select Facility Cover Image *</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '10px' }}>
                  {AMENITY_PRESET_IMAGES.map((preset, idx) => (
                    <div 
                      key={idx}
                      onClick={() => handleSelectPreset(preset)}
                      style={{
                        height: '64px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        position: 'relative',
                        border: formData.coverUrl === preset.url ? '3px solid var(--primary)' : '1px solid var(--border-color)'
                      }}
                    >
                      <img src={preset.url} alt={preset.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', color: '#FFF', fontSize: '9px', fontWeight: 700, padding: '2px 4px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {preset.label}
                      </div>
                    </div>
                  ))}
                </div>
                <input 
                  type="url"
                  placeholder="Or paste custom Image URL (https://...)"
                  value={formData.coverUrl}
                  onChange={e => handleInputChange('coverUrl', e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '12px', outline: 'none' }}
                />
              </div>

              {/* Amenity Name & Category */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Facility Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Olympic Swimming Pool"
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Category</label>
                  <select
                    value={formData.category}
                    onChange={e => handleInputChange('category', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none', background: 'var(--surface-color)' }}
                  >
                    <option value="Sports & Fitness">Sports & Fitness</option>
                    <option value="Events & Party">Events & Party</option>
                    <option value="Leisure & Spa">Leisure & Spa</option>
                    <option value="Community Work">Community Work</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Description</label>
                <textarea
                  rows={2}
                  placeholder="Short description of rules, features, and equipment..."
                  value={formData.description}
                  onChange={e => handleInputChange('description', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none', fontFamily: 'inherit' }}
                />
              </div>

              {/* Operating Timings & Max Capacity */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Operating Hours</label>
                  <input
                    type="text"
                    placeholder="e.g. 06:00 AM - 10:00 PM"
                    value={formData.timings}
                    onChange={e => handleInputChange('timings', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Max Slot Capacity (Persons)</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.capacity}
                    onChange={e => handleInputChange('capacity', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Booking Fee & Hourly Charges */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Fee Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Free or ₹500 / Hour"
                    value={formData.fee}
                    onChange={e => handleInputChange('fee', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Price Per Hour (₹ Numeric)</label>
                  <input
                    type="number"
                    min={0}
                    placeholder="0 if free"
                    value={formData.pricePerHour}
                    onChange={e => handleInputChange('pricePerHour', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Facility Location & Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Location / Block</label>
                  <input
                    type="text"
                    placeholder="e.g. Clubhouse Level 2"
                    value={formData.location}
                    onChange={e => handleInputChange('location', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Initial Status</label>
                  <select
                    value={formData.status}
                    onChange={e => handleInputChange('status', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none', background: 'var(--surface-color)' }}
                  >
                    <option value="Available">Available (Open)</option>
                    <option value="Maintenance">Maintenance (Closed)</option>
                  </select>
                </div>
              </div>

              {/* Rules & Guidelines */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Rules & Guidelines</label>
                <input
                  type="text"
                  placeholder="e.g. Proper footwear required. No food allowed inside."
                  value={formData.rules}
                  onChange={e => handleInputChange('rules', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }}
                />
              </div>

              {/* Modal Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1, padding: '10px' }} onClick={() => setIsModalOpen(false)} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '10px' }} disabled={submitting}>
                  {submitting ? 'Saving...' : editingAmenity ? 'Update Facility' : 'Create Facility'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
