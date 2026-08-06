/**
 * Production Validation Utilities for Society Onboarding Module
 */

export function validateStep1(data, existingSocieties = []) {
  const errors = {};

  // Society Name
  const trimmedName = (data.name || '').trim();
  if (!trimmedName) {
    errors.name = 'Society Name is required.';
  } else if (trimmedName.length < 3 || trimmedName.length > 100) {
    errors.name = 'Society Name must be between 3 and 100 characters.';
  } else if (!/^[a-zA-Z0-9\s&.\-]+$/.test(trimmedName)) {
    errors.name = 'Only letters, numbers, spaces, &, -, and . are allowed.';
  } else {
    // Case-insensitive duplicate check
    const isDuplicate = existingSocieties.some(
      s => s.name?.trim().toLowerCase() === trimmedName.toLowerCase()
    );
    if (isDuplicate) {
      errors.name = 'A society with this name already exists.';
    }
  }

  // Society Code
  const code = (data.code || '').trim().toUpperCase();
  if (!code) {
    errors.code = 'Society Code is required.';
  } else if (!/^[A-Z0-9]{3,15}$/.test(code)) {
    errors.code = 'Code must be 3-15 uppercase characters (A-Z, 0-9) with no spaces.';
  } else {
    const isDuplicateCode = existingSocieties.some(
      s => s.code?.trim().toUpperCase() === code
    );
    if (isDuplicateCode) {
      errors.code = 'Society Code must be unique.';
    }
  }

  // Society Type
  const validTypes = ['Apartment', 'Villa', 'Gated Community', 'Commercial', 'Mixed Use'];
  if (!data.type || !validTypes.includes(data.type)) {
    errors.type = 'Please select a valid Society Type.';
  }

  // Registration Number
  if (data.registrationNumber) {
    const reg = data.registrationNumber.trim();
    if (reg.length > 50) {
      errors.registrationNumber = 'Registration Number cannot exceed 50 characters.';
    } else if (!/^[a-zA-Z0-9\s\-/]+$/.test(reg)) {
      errors.registrationNumber = 'Registration Number contains invalid characters.';
    }
  }

  // Year Established
  if (data.yearEstablished) {
    const year = Number(data.yearEstablished);
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < 1900 || year > currentYear) {
      errors.yearEstablished = `Year must be between 1900 and ${currentYear}.`;
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateStep2(data) {
  const errors = {};

  if (!data.addressLine1 || !data.addressLine1.trim()) {
    errors.addressLine1 = 'Address Line 1 is required.';
  }

  if (!data.area || !data.area.trim()) {
    errors.area = 'Area / Locality is required.';
  }

  if (!data.city || !data.city.trim()) {
    errors.city = 'City is required.';
  }

  if (!data.state || !data.state.trim()) {
    errors.state = 'State is required.';
  }

  if (!data.country || !data.country.trim()) {
    errors.country = 'Country is required.';
  }

  // PIN Code (Indian 6-digit validation)
  const pin = (data.pinCode || '').trim();
  if (!pin) {
    errors.pinCode = 'PIN Code is required.';
  } else if (!/^[1-9][0-9]{5}$/.test(pin)) {
    errors.pinCode = 'Enter a valid 6-digit Indian PIN Code (e.g. 400001).';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateStep3(data) {
  const errors = {};

  const blocks = Number(data.blocks);
  if (!data.blocks || isNaN(blocks) || blocks < 1 || blocks > 500) {
    errors.blocks = 'Total Blocks / Towers is required (1 to 500).';
  }

  if (data.floors) {
    const floors = Number(data.floors);
    if (isNaN(floors) || floors < 1) {
      errors.floors = 'Total Floors must be at least 1.';
    }
  }

  const flats = Number(data.flats);
  if (!data.flats || isNaN(flats) || flats < 1) {
    errors.flats = 'Total Flats is required and must be at least 1.';
  }

  if (data.villas) {
    const villas = Number(data.villas);
    if (isNaN(villas) || villas < 0) {
      errors.villas = 'Total Villas must be 0 or a positive number.';
    }
  }

  if (data.parkingSlots) {
    const parking = Number(data.parkingSlots);
    if (isNaN(parking) || parking < 0) {
      errors.parkingSlots = 'Parking slots must be 0 or a positive number.';
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateStep4(data, totalFlats) {
  const errors = {};

  const total = Number(totalFlats) || 0;
  const occupied = Number(data.occupiedFlats) || 0;
  const vacant = Number(data.vacantFlats) || 0;
  const rental = Number(data.rentalFlats) || 0;
  const owner = Number(data.ownerOccupiedFlats) || 0;

  if (occupied < 0 || occupied > total) {
    errors.occupiedFlats = `Occupied flats cannot exceed Total Flats (${total}).`;
  }

  if (vacant < 0 || vacant > total) {
    errors.vacantFlats = `Vacant flats cannot exceed Total Flats (${total}).`;
  }

  if (rental < 0 || rental > occupied) {
    errors.rentalFlats = `Rental flats cannot exceed Occupied Flats (${occupied}).`;
  }

  if (owner < 0 || owner > occupied) {
    errors.ownerOccupiedFlats = `Owner-occupied flats cannot exceed Occupied Flats (${occupied}).`;
  }

  // Live Equation Validation:
  // 1. Occupied + Vacant must equal Total Flats
  if (occupied + vacant !== total) {
    errors.equationOccupancy = `Occupied (${occupied}) + Vacant (${vacant}) must equal Total Flats (${total}).`;
  }

  // 2. Rental + Owner Occupied must equal Occupied Flats
  if (rental + owner !== occupied) {
    errors.equationRentalOwner = `Rental (${rental}) + Owner Occupied (${owner}) must equal Occupied Flats (${occupied}).`;
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateStep5(data, existingSocieties = []) {
  const errors = {};
  const nameRegex = /^[a-zA-Z\s'.]{1,100}$/;

  ['presidentName', 'secretaryName', 'treasurerName', 'managerName'].forEach(field => {
    if (data[field]) {
      const val = data[field].trim();
      if (!nameRegex.test(val)) {
        errors[field] = 'Must contain only letters and spaces (max 100 chars).';
      }
    }
  });

  // Phone Number (Indian mobile validation)
  const phone = (data.phone || '').trim();
  if (!phone) {
    errors.phone = 'Phone Number is required.';
  } else if (!/^(\+91[\s-]?)?[6-9]\d{9}$/.test(phone.replace(/\s+/g, ''))) {
    errors.phone = 'Enter a valid 10-digit Indian mobile number (e.g. +919820112345).';
  }

  // Admin Email
  const email = (data.email || '').trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.email = 'Admin Email is required.';
  } else if (!emailRegex.test(email)) {
    errors.email = 'Enter a valid RFC-compliant email address.';
  } else {
    const isDupEmail = existingSocieties.some(
      s => s.adminEmail?.trim().toLowerCase() === email
    );
    if (isDupEmail) {
      errors.email = 'Admin email is already registered to another society.';
    }
  }

  // Emergency Contact
  if (data.emergencyContact) {
    const emPhone = data.emergencyContact.trim();
    if (!/^(\+91[\s-]?)?[6-9]\d{9}$/.test(emPhone.replace(/\s+/g, ''))) {
      errors.emergencyContact = 'Enter a valid emergency contact mobile number.';
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

// Helper to auto-generate Society Code from Society Name
export function generateSocietyCode(name) {
  if (!name) return 'SOC001';
  const words = name.trim().split(/\s+/);
  let prefix = '';
  if (words.length >= 3) {
    prefix = (words[0][0] + words[1][0] + words[2][0]).toUpperCase();
  } else if (words[0].length >= 3) {
    prefix = words[0].substring(0, 3).toUpperCase();
  } else {
    prefix = words[0].toUpperCase().padEnd(3, 'X');
  }
  // Sanitize to A-Z
  prefix = prefix.replace(/[^A-Z]/g, 'S');
  const randomNum = Math.floor(100 + Math.random() * 900);
  return `${prefix}${randomNum}`;
}
