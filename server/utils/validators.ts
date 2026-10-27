export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateRegistration(data: any): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
    errors.name = 'Full Name cannot be empty.';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || typeof data.email !== 'string' || !data.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!emailRegex.test(data.email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!data.password || typeof data.password !== 'string') {
    errors.password = 'Password is required.';
  } else if (data.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long.';
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateLogin(data: any): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.email || typeof data.email !== 'string' || !data.email.trim()) {
    errors.email = 'Email is required.';
  }

  if (!data.password || typeof data.password !== 'string') {
    errors.password = 'Password is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateNewsSubmission(data: any): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.headline || typeof data.headline !== 'string' || !data.headline.trim()) {
    errors.headline = 'News headline is required.';
  } else if (data.headline.trim().length < 6) {
    errors.headline = 'Headline must be at least 6 characters.';
  }

  if (!data.content || typeof data.content !== 'string' || !data.content.trim()) {
    errors.content = 'News article content is required.';
  } else if (data.content.trim().length < 20) {
    errors.content = 'Article content must be at least 20 characters for meaningful analysis.';
  }

  if (data.sourceUrl && typeof data.sourceUrl === 'string' && data.sourceUrl.trim().length > 0) {
    const urlStr = data.sourceUrl.trim();
    const formatted = urlStr.startsWith('http://') || urlStr.startsWith('https://') ? urlStr : `https://${urlStr}`;
    try {
      new URL(formatted);
    } catch {
      errors.sourceUrl = 'Please provide a valid source URL (e.g., https://reuters.com/...)';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
