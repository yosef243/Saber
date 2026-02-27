// js/utils/format.js
export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

export function toIntSafe(value, fallback = 0) {
  const n = Number.parseInt(String(value), 10);
  return Number.isFinite(n) ? n : fallback;
}

export function sanitizeInput(str) {
  return String(str ?? '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function formatArabicNumber(n) {
  try {
    return new Intl.NumberFormat('ar-EG').format(n);
  } catch {
    return String(n);
  }
}