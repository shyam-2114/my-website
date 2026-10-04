export const QR_TYPES = [
  { id: 'url', label: 'URL' },
  { id: 'text', label: 'Text' },
  { id: 'phone', label: 'Phone' },
  { id: 'email', label: 'Email' },
  { id: 'wifi', label: 'Wi-Fi' },
  { id: 'vcard', label: 'Contact' },
]

export const DEFAULT_FORM_DATA = {
  url: { url: '' },
  text: { text: '' },
  phone: { phone: '' },
  email: { to: '', subject: '', body: '' },
  wifi: { ssid: '', password: '', encryption: 'WPA', hidden: false },
  vcard: {
    firstName: '',
    lastName: '',
    organization: '',
    title: '',
    phone: '',
    email: '',
    website: '',
    address: '',
  },
}

export const DEFAULT_STYLE = {
  fgColor: '#14161A',
  bgColor: '#FFFFFF',
  logo: null, // data URL
  errorCorrectionLevel: 'M', // L, M, Q, H — auto-raised to H when a logo is set
}
