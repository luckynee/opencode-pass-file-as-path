const DEFAULT_EXTENSIONS = [".prefab"]

/**
 * @param {unknown} value
 * @returns {string[]}
 */
export function normalizeExtensions(value) {
  const candidates = /** @type {unknown[]} */ (Array.isArray(value) ? value : [value])
  const extensions = candidates
    .filter((candidate) => typeof candidate === "string")
    .map((candidate) => candidate.trim().toLowerCase())
    .filter(Boolean)
    .map((candidate) => (candidate.startsWith(".") ? candidate : `.${candidate}`))
  return [...new Set(extensions.length ? extensions : DEFAULT_EXTENSIONS)]
}

/**
 * @template {{ uri: string }} T
 * @param {readonly T[]} files
 * @param {readonly string[]} [extensions]
 * @returns {T[]}
 */
export function stripAttachments(files, extensions = DEFAULT_EXTENSIONS) {
  return files.filter((file) => {
    try {
      const uri = new URL(file.uri)
      if (uri.protocol !== "file:") return true
      const pathname = decodeURIComponent(uri.pathname).toLowerCase()
      return !extensions.some((extension) => pathname.endsWith(extension))
    } catch {
      return true
    }
  })
}
