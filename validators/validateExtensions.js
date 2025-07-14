import allowedExtensions from '../constants/allowedExtensions.js'

/**
 * Validates the file extension and returns its type category.
 *
 * Matches the file extension against the allowedExtensions config.
 *
 * @param {string} filename - The filename (must include an extension).
 * @returns {{ ext: string, type: string }} - The matched extension and its type.
 *
 * @throws {Error} If:
 *   - `filename` is not a string
 *   - No extension is found in the filename
 *   - The extension is not supported
 *
 * @example
 * validateExtensions("config.json")
 * // → { ext: ".json", type: "json" }
 */
export default function validateExtensions(filename) {
  if (typeof filename !== 'string') {
    throw new Error('Invalid argument: "filename" must be a string.')
  }

  const dotIndex = filename.lastIndexOf('.')
  if (dotIndex === -1) {
    throw new Error(`Missing extension: "${filename}" has no file extension.`)
  }

  const ext = filename.slice(dotIndex)

  for (const [type, extensions] of Object.entries(allowedExtensions)) {
    if (extensions.includes(ext)) {
      return { ext, type }
    }
  }

  const allowedList = Object.values(allowedExtensions).flat().join(', ')
  throw new Error(`Unsupported extension: "${ext}" is not allowed. Supported extensions: ${allowedList}`)
}
