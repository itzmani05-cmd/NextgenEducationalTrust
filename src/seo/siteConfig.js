// Single source of truth for site-wide SEO facts. Keep every hard-coded
// name/domain/contact string used in metadata and JSON-LD flowing through
// here so branding stays consistent and only needs updating in one place.

export const SITE_URL = 'https://www.nextgenedutrust.in'
export const SITE_NAME = 'NextGen Solutions Educational Trust'
export const SITE_NAME_SHORT = 'NextGen Solutions Educational Trust'
export const DEFAULT_LOCALE = 'en_IN'

export const DEFAULT_TITLE = `${SITE_NAME} | Educational Trust in Tamil Nadu`
export const DEFAULT_DESCRIPTION =
  'NextGen Solutions Educational Trust supports deserving students in Tamil Nadu through scholarships, fee concessions, and the C3 Educational Platform’s technical skill development program for GATE and government exam aspirants.'

export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`

export const ORGANIZATION = {
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  email: 'nextgencollegesolutions@gmail.com',
  phones: ['+91-93423-79043', '+91-97902-13628'],
  address: {
    streetAddress: '4/1023 D, Ayyalu Meenakshi Nagar',
    addressLocality: 'Udumalpet',
    addressRegion: 'Tamil Nadu',
    postalCode: '642126',
    addressCountry: 'IN',
  },
}

export function absoluteUrl(path = '/') {
  return `${SITE_URL}${path === '/' ? '' : path}`
}
