// Pure validation functions for WMS inputs

export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
};

export const isValidPassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  return password.length >= 6;
};

export const isNonEmptyString = (str) => {
  return typeof str === 'string' && str.trim().length > 0;
};

export const isValidNumber = (val) => {
  if (val === null || val === undefined || val === '') return false;
  const num = Number(val);
  return !isNaN(num) && isFinite(num) && num >= 0;
};

export const validateLeaveDates = (startDate, endDate, existingRequests = []) => {
  if (!startDate || !endDate) {
    return { valid: false, error: 'Both start and end dates are required' };
  }
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { valid: false, error: 'Please enter valid date formats (YYYY-MM-DD)' };
  }
  if (start > end) {
    return { valid: false, error: 'Start date cannot be after end date' };
  }

  // Check overlap against existing requests
  const hasOverlap = existingRequests.some((req) => {
    if (req.status === 'REJECTED' || req.status === 'CANCELLED') return false;
    const reqStart = new Date(req.startDate);
    const reqEnd = new Date(req.endDate);
    return start <= reqEnd && end >= reqStart;
  });

  if (hasOverlap) {
    return {
      valid: false,
      error: '! Overlapping leave request detected for selected dates',
    };
  }

  return { valid: true, error: null };
};
