import { useState, useEffect } from 'react';
import { getSocietyAdminSession } from '../../../services/sessionManager';
import { societyAdminService } from '../../../services/societyAdminService';

export const generateSecurePassword = () => {
  const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789@#$';
  let pass = '';
  for (let i = 0; i < 8; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
};

export function useResidents() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResidentForView, setSelectedResidentForView] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    flatNumber: '',
    phone: '',
    email: '',
    password: generateSecurePassword(),
    role: 'resident',
    ownershipType: 'Owner'
  });

  const session = getSocietyAdminSession();
  const societyId = session?.societyId;

  useEffect(() => {
    if (!societyId) {
      setLoading(false);
      return;
    }
    const unsubscribe = societyAdminService.subscribeResidents(
      societyId,
      (data) => {
        setResidents(data);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching residents:', err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [societyId]);

  const handleApprove = async (userId) => {
    try {
      await societyAdminService.updateResidentStatus(societyId, userId, 'active');
    } catch (e) {
      alert('Error approving resident: ' + e.message);
    }
  };

  const handleReject = async (userId) => {
    if (window.confirm('Are you sure you want to decline this resident registration?')) {
      try {
        await societyAdminService.updateResidentStatus(societyId, userId, 'rejected');
      } catch (e) {
        alert('Error declining resident: ' + e.message);
      }
    }
  };

  const toggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' || currentStatus === 'approved' ? 'suspended' : 'active';
    try {
      await societyAdminService.updateResidentStatus(societyId, userId, newStatus);
    } catch (e) {
      alert('Error updating status: ' + e.message);
    }
  };

  const handleDeleteResident = async (userId, name, flatNumber) => {
    if (!window.confirm(`Are you sure you want to permanently delete resident record for "${name}" (Flat: ${flatNumber || 'N/A'})?\n\nThis will remove their access permissions from the society directory.`)) {
      return;
    }
    try {
      await societyAdminService.deleteResident(societyId, userId);
      alert(`Successfully deleted resident record for "${name}".`);
      if (selectedResidentForView?.id === userId) {
        setSelectedResidentForView(null);
      }
    } catch (e) {
      alert('Error deleting resident: ' + e.message);
    }
  };

  const handleOpenDocument = (e, url, typeName = 'Residence Document Proof') => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!url || url === '#' || url.trim() === '') {
      alert(`Document Info:\n\nType: ${typeName}\nStatus: Attached during mobile registration.`);
      return;
    }
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
      setFullscreenImage({ url, title: typeName });
    } else {
      alert(`Resident Verification Proof:\n\nType: ${typeName}\nAttachment Reference: ${url}`);
    }
  };

  const handleAddResident = async (e) => {
    e.preventDefault();
    try {
      await societyAdminService.addResident(societyId, formData);
      setIsModalOpen(false);
      setFormData({
        name: '',
        flatNumber: '',
        phone: '',
        email: '',
        password: generateSecurePassword(),
        role: 'resident',
        ownershipType: 'Owner'
      });
    } catch (error) {
      alert('Error adding resident: ' + error.message);
    }
  };

  // Filter residents
  const currentAdminEmail = (session?.email || '').toLowerCase();
  const nonAdminResidents = residents.filter((r) => {
    const role = (r.role || '').toLowerCase();
    const email = (r.email || '').toLowerCase();
    if (role === 'super_admin') return false;
    if (currentAdminEmail && email === currentAdminEmail && (role === 'admin' || role === 'society_admin') && !r.flatNumber) return false;
    return true;
  });

  const pendingList = nonAdminResidents.filter((r) => {
    const s = (r.status || '').toLowerCase();
    return s === 'pending' || s === 'pending_approval' || s === 'pending_verification' || s === 'unapproved';
  });

  const activeList = nonAdminResidents.filter((r) => {
    const s = (r.status || 'active').toLowerCase();
    return s === 'active' || s === 'approved' || s === 'suspended' || s === '' || !['pending', 'pending_approval', 'pending_verification', 'unapproved', 'rejected'].includes(s);
  });

  return {
    societyId,
    loading,
    activeTab,
    setActiveTab,
    isModalOpen,
    setIsModalOpen,
    selectedResidentForView,
    setSelectedResidentForView,
    fullscreenImage,
    setFullscreenImage,
    showPassword,
    setShowPassword,
    formData,
    setFormData,
    handleApprove,
    handleReject,
    toggleStatus,
    handleDeleteResident,
    handleOpenDocument,
    handleAddResident,
    activeList,
    pendingList
  };
}
