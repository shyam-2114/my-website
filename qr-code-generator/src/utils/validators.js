// Central validation logic. Every validator returns an object:
// { valid: boolean, errors: { [fieldName]: string } }

const URL_PATTERN = /^(https?:\/\/)?((([a-z0-9]([a-z0-9-]*[a-z0-9])?)\.)+[a-z]{2,}|localhost|(\d{1,3}\.){3}\d{1,3})(:\d+)?(\/[^\s]*)?$/i
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// E.164-ish: optional +, 7-15 digits, allows spaces/dashes/parens which we strip before testing
const PHONE_PATTERN = /^\+?[0-9]{7,15}$/

export function isBlank(value) {
  return value === undefined || value === null || String(value).trim().length === 0
}

export function validateUrl(data) {
  const errors = {}
  if (isBlank(data.url)) {
    errors.url = 'Enter a URL to encode.'
  } else if (!URL_PATTERN.test(data.url.trim())) {
    errors.url = 'Enter a valid URL, e.g. https://example.com'
  }
  return { valid: Object.keys(errors).length === 0, errors }
}

export function validateText(data) {
  const errors = {}
  if (isBlank(data.text)) {
    errors.text = 'Enter some text to encode.'
  } else if (data.text.length > 2000) {
    errors.text = 'Text is too long (max 2000 characters).'
  }
  return { valid: Object.keys(errors).length === 0, errors }
}

export function validatePhone(data) {
  const errors = {}
  const stripped = (data.phone || '').replace(/[\s\-().]/g, '')
  if (isBlank(data.phone)) {
    errors.phone = 'Enter a phone number.'
  } else if (!PHONE_PATTERN.test(stripped)) {
    errors.phone = 'Enter a valid phone number, e.g. +1 555 123 4567'
  }
  return { valid: Object.keys(errors).length === 0, errors }
}

export function validateEmail(data) {
  const errors = {}
  if (isBlank(data.to)) {
    errors.to = 'Enter a recipient email address.'
  } else if (!EMAIL_PATTERN.test(data.to.trim())) {
    errors.to = 'Enter a valid email address.'
  }
  if (data.subject && data.subject.length > 200) {
    errors.subject = 'Subject is too long (max 200 characters).'
  }
  if (data.body && data.body.length > 2000) {
    errors.body = 'Message is too long (max 2000 characters).'
  }
  return { valid: Object.keys(errors).length === 0, errors }
}

export function validateWifi(data) {
  const errors = {}
  if (isBlank(data.ssid)) {
    errors.ssid = 'Enter the network name (SSID).'
  } else if (data.ssid.length > 32) {
    errors.ssid = 'SSID is too long (max 32 characters).'
  }
  if (data.encryption !== 'nopass' && isBlank(data.password)) {
    errors.password = 'Enter the network password, or choose "No password".'
  }
  if (data.password && data.password.length > 63) {
    errors.password = 'Password is too long (max 63 characters).'
  }
  return { valid: Object.keys(errors).length === 0, errors }
}

export function validateVCard(data) {
  const errors = {}
  if (isBlank(data.firstName) && isBlank(data.lastName)) {
    errors.firstName = 'Enter at least a first or last name.'
  }
  if (data.phone && !PHONE_PATTERN.test(data.phone.replace(/[\s\-().]/g, ''))) {
    errors.phone = 'Enter a valid phone number.'
  }
  if (data.email && !EMAIL_PATTERN.test(data.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }
  if (data.website && !URL_PATTERN.test(data.website.trim())) {
    errors.website = 'Enter a valid website URL.'
  }
  return { valid: Object.keys(errors).length === 0, errors }
}

export const VALIDATORS = {
  url: validateUrl,
  text: validateText,
  phone: validatePhone,
  email: validateEmail,
  wifi: validateWifi,
  vcard: validateVCard,
}

export function validateByType(type, data) {
  const fn = VALIDATORS[type]
  if (!fn) return { valid: false, errors: { _: 'Unknown QR type.' } }
  return fn(data)
}

export function validateHexColor(value) {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value)
}
