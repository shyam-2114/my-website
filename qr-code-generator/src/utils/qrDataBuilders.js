// Converts validated form state into the exact payload string that gets
// encoded into the QR code, following the relevant standards (MECARD/vCard,
// WIFI: URI scheme, mailto:, tel:) so real-world scanners interpret it correctly.

function escapeWifi(value = '') {
  // Per the WIFI: QR spec, escape backslash, semicolon, comma and colon
  return value.replace(/([\\;,:"])/g, '\\$1')
}

function escapeVCard(value = '') {
  return value.replace(/([\\;,])/g, '\\$1').replace(/\n/g, '\\n')
}

export function buildUrlPayload(data) {
  const trimmed = data.url.trim()
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`
  }
  return trimmed
}

export function buildTextPayload(data) {
  return data.text
}

export function buildPhonePayload(data) {
  const stripped = data.phone.replace(/[\s\-().]/g, '')
  return `tel:${stripped}`
}

export function buildEmailPayload(data) {
  const params = []
  if (data.subject) params.push(`subject=${encodeURIComponent(data.subject)}`)
  if (data.body) params.push(`body=${encodeURIComponent(data.body)}`)
  const query = params.length ? `?${params.join('&')}` : ''
  return `mailto:${data.to.trim()}${query}`
}

export function buildWifiPayload(data) {
  const type = data.encryption === 'nopass' ? 'nopass' : data.encryption // WPA | WEP | nopass
  const ssid = escapeWifi(data.ssid)
  const pass = data.encryption === 'nopass' ? '' : escapeWifi(data.password || '')
  const hidden = data.hidden ? 'true' : 'false'
  return `WIFI:T:${type};S:${ssid};${type === 'nopass' ? '' : `P:${pass};`}H:${hidden};;`
}

export function buildVCardPayload(data) {
  const lines = ['BEGIN:VCARD', 'VERSION:3.0']
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(' ')
  lines.push(`N:${escapeVCard(data.lastName || '')};${escapeVCard(data.firstName || '')};;;`)
  lines.push(`FN:${escapeVCard(fullName)}`)
  if (data.organization) lines.push(`ORG:${escapeVCard(data.organization)}`)
  if (data.title) lines.push(`TITLE:${escapeVCard(data.title)}`)
  if (data.phone) lines.push(`TEL;TYPE=CELL:${data.phone.replace(/[\s\-().]/g, '')}`)
  if (data.email) lines.push(`EMAIL:${data.email.trim()}`)
  if (data.website) lines.push(`URL:${data.website.trim()}`)
  if (data.address) lines.push(`ADR;TYPE=HOME:;;${escapeVCard(data.address)};;;;`)
  lines.push('END:VCARD')
  return lines.join('\n')
}

export const BUILDERS = {
  url: buildUrlPayload,
  text: buildTextPayload,
  phone: buildPhonePayload,
  email: buildEmailPayload,
  wifi: buildWifiPayload,
  vcard: buildVCardPayload,
}

export function buildPayload(type, data) {
  const fn = BUILDERS[type]
  if (!fn) return ''
  return fn(data)
}
