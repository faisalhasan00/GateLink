/**
 * Production Security & Sanitization Utilities for SocietySphere Admin
 */

// Basic XSS Sanitization: Escapes dangerous HTML characters to prevent XSS payloads
export function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
}

// Recursively sanitize all string properties in an object/payload
export function sanitizePayload(payload) {
  if (!payload || typeof payload !== 'object') return payload;

  if (Array.isArray(payload)) {
    return payload.map(item => sanitizePayload(item));
  }

  const sanitized = {};
  for (const key of Object.keys(payload)) {
    const value = payload[key];
    if (typeof value === 'string') {
      sanitized[key] = escapeHtml(value.trim());
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizePayload(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

// Client-side Rate Limiter: Allows max 10 society onboarding submissions per minute
const RATE_LIMIT_KEY = 'society_onboarding_attempts';
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 60 * 1000; // 1 minute

export function checkRateLimit() {
  try {
    const now = Date.now();
    const attempts = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '[]');

    // Filter out attempts outside the 1-minute window
    const recentAttempts = attempts.filter(ts => now - ts < WINDOW_MS);

    if (recentAttempts.length >= MAX_ATTEMPTS) {
      return {
        allowed: false,
        message: `Rate limit exceeded. Maximum ${MAX_ATTEMPTS} attempts per minute. Please try again later.`
      };
    }

    recentAttempts.push(now);
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recentAttempts));
    return { allowed: true };
  } catch (err) {
    // Fallback if localStorage unavailable
    return { allowed: true };
  }
}

// Simple client UUID generator (RFC4122 compliant fallback)
export function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
