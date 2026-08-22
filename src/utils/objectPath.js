export function getPath(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj)
}

export function setPath(obj, path, value) {
  const keys = path.split('.')
  const clone = Array.isArray(obj) ? [...obj] : { ...obj }
  let cursor = clone
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    cursor[key] = Array.isArray(cursor[key]) ? [...cursor[key]] : { ...cursor[key] }
    cursor = cursor[key]
  }
  cursor[keys[keys.length - 1]] = value
  return clone
}

// Replaces any File instances with null so the result is safely JSON-serializable
// (for API submission or localStorage caching) without corrupting the shape.
export function stripFiles(value) {
  if (value instanceof File) return null
  if (Array.isArray(value)) return value.map(stripFiles)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, stripFiles(v)]))
  }
  return value
}

// Walks an object and collects every File instance found, as [{ key, file }]
// with dot-notation keys (e.g. "tenth.markSheet") matching getPath/setPath.
export function collectFiles(obj, prefix = '') {
  const found = []
  for (const [k, v] of Object.entries(obj || {})) {
    const key = prefix ? `${prefix}.${k}` : k
    if (v instanceof File) {
      found.push({ key, file: v })
    } else if (v && typeof v === 'object' && !Array.isArray(v)) {
      found.push(...collectFiles(v, key))
    }
  }
  return found
}
