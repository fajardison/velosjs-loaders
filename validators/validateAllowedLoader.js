import notAllowedLoader from '../constants/notAllowedLoader.js'

/**
 * Determines whether a loader entry (file/folder) is allowed to be loaded.
 *
 * This function checks:
 * - If the name exists in the forbidden list (`notAllowedLoader`)
 * - If the entry is hidden (starts with "."), when `skipHidden` is enabled
 *
 * @param {string} folderName - Entry name (file or folder name, not full path).
 * @param {object} [options] - Optional flags for validation.
 * @param {boolean} [options.ignoreCase=true] - Ignore case when comparing names.
 * @param {boolean} [options.skipHidden=true] - Skip entries starting with a dot (`.`).
 * @returns {boolean} Returns `true` if the entry is allowed; otherwise `false`.
 */

export default function isAllowedLoader(folderName, options = {}) {
  if (typeof folderName !== 'string') return false

  const {
    ignoreCase = true,
    skipHidden = true
  } = options

  const name = ignoreCase ? folderName.toLowerCase() : folderName
  
  if (skipHidden && name.startsWith('.')) {
    return false
  }

  return !notAllowedLoader.some(forbidden => {
    const blockedName = ignoreCase ? forbidden.toLowerCase() : forbidden
    return name === blockedName
  })
}
