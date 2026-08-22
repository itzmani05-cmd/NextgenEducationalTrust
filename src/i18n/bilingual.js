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

// Every label is shown in both languages at once (e.g. "Full Name / முழு
// பெயர்") rather than behind a language toggle. Arrays (e.g. the stepper
// title list) are combined item by item.
export function bi(key) {
  const en = lookup(translations.en, key)
  const ta = lookup(translations.ta, key)

  if (Array.isArray(en)) {
    return en.map((v, i) => combine(v, Array.isArray(ta) ? ta[i] : undefined))
  }

  const result = combine(en, ta)
  return result !== undefined ? result : key
}

// English only — for wizard chrome (page title, step counter, the stepper's
// own step list, nav buttons, confirmation-screen text) rather than the
// actual questions/fields a student fills in, which use `bi()` above.
export function enOnly(key) {
  const en = lookup(translations.en, key)
  return en !== undefined ? en : key
}
