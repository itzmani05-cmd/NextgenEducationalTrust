// JSON-LD builders. Every function here only ever surfaces data that
// already exists elsewhere in the app (siteConfig, or content passed in by
// the caller) — nothing here should invent facts about the Trust.
import { SITE_NAME, SITE_URL, ORGANIZATION, absoluteUrl } from './siteConfig.js'

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['NGO', 'EducationalOrganization'],
    name: ORGANIZATION.name,
    url: ORGANIZATION.url,
    logo: ORGANIZATION.logo,
    image: ORGANIZATION.logo,
    email: ORGANIZATION.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: ORGANIZATION.address.streetAddress,
      addressLocality: ORGANIZATION.address.addressLocality,
      addressRegion: ORGANIZATION.address.addressRegion,
      postalCode: ORGANIZATION.address.postalCode,
      addressCountry: ORGANIZATION.address.addressCountry,
    },
    contactPoint: ORGANIZATION.phones.map((phone) => ({
      '@type': 'ContactPoint',
      telephone: phone,
      contactType: 'customer support',
      email: ORGANIZATION.email,
      areaServed: 'IN',
      availableLanguage: ['English', 'Tamil'],
    })),
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
  }
}

export function webPageSchema({ name, description, path }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url: absoluteUrl(path),
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
  }
}

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function contactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Us',
    url: absoluteUrl('/contact'),
    about: { '@type': 'Organization', name: SITE_NAME },
  }
}

// categories: [{ title, faqs: [{ q, a }] }] — same shape used to render
// FaqCategoriesSection, so the schema can never drift from the visible copy.
export function faqPageSchema(categories) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: categories.flatMap((cat) =>
      cat.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      }))
    ),
  }
}
