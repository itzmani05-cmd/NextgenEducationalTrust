import { Helmet } from 'react-helmet-async'
import { SITE_NAME, DEFAULT_OG_IMAGE, absoluteUrl } from '../seo/siteConfig.js'

// Reusable per-page head manager. Pages pass only what differs from the
// defaults; canonical/OG/Twitter tags are derived from `path` + `image` so
// every page can't accidentally diverge in structure, only in content.
export default function SEO({
  title,
  description,
  path = '/',
  image = DEFAULT_OG_IMAGE,
  keywords,
  noindex = false,
  type = 'website',
  jsonLd,
}) {
  const canonical = absoluteUrl(path)
  const jsonLdList = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : []

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonical} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {jsonLdList.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}
