/**
 * Allowed file extensions for dynamic loading.
 *
 * - `jsModule`: JavaScript module files (.js, .mjs, .cjs)
 * - `json`: JSON configuration files (.json)
 *
 * Used to validate files before importing or reading with loaders.
 *
 * @example
 * allowedExtensions.jsModule.includes('.mjs') // true
 * allowedExtensions.json.includes('.yaml')    // false
 */
const allowedExtensions = {
  jsModule: ['.js', '.mjs', '.cjs'],
  json: ['.json'],
}

export default allowedExtensions
