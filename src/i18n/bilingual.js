import { translations } from './applyTranslations.js'

function lookup(tree, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), tree)
}

function combine(en, ta) {
  if (en === undefined && ta === undefined) return undefined
  if (en === undefined) return ta
  if (ta === undefined) return en
  if (en === ta) return en
  return `${en} / ${ta}`
}

export function bi(key) {
  const en = lookup(translations.en, key)
  const ta = lookup(translations.ta, key)

  if (Array.isArray(en)) {
    return en.map((v, i) => combine(v, Array.isArray(ta) ? ta[i] : undefined))
  }

  const result = combine(en, ta)
  return result !== undefined ? result : key
}

export function enOnly(key) {
  const en = lookup(translations.en, key)
  return en !== undefined ? en : key
}
