import notAllowedLoader from '../constants/notAllowedLoader.js'

/**
 * Mengecek apakah nama folder diperbolehkan.
 *
 * @param {string} folderName - Nama folder (bukan path penuh).
 * @param {object} [options]
 * @param {boolean} [options.ignoreCase=true] - Abaikan huruf kapital.
 * @param {boolean} [options.skipHidden=true] - Lewati folder tersembunyi (awalan ".").
 * @returns {boolean}
 */
export default function isAllowedLoader(folderName, options = {}) {
  if (typeof folderName !== 'string') return false

  const {
    ignoreCase = true,
    skipHidden = true
  } = options

  const name = ignoreCase ? folderName.toLowerCase() : folderName

  // Tolak jika hidden folder
  if (skipHidden && name.startsWith('.')) {
    return false
  }

  // Tolak jika nama folder masuk daftar blacklist
  return !notAllowedLoader.some(forbidden => {
    const blockedName = ignoreCase ? forbidden.toLowerCase() : forbidden
    return name === blockedName
  })
    }
