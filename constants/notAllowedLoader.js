/**
 * List of file or folder names to be excluded from loading.
 *
 * This helps avoid:
 * - System folders (e.g., `node_modules`, `.git`, `.vscode`)
 * - Hidden/system files (e.g., `.DS_Store` on macOS, `Thumbs.db` on Windows)
 * - Certain config files (e.g., `.npmignore`)
 *
 * Any entry matching a name in this list will be skipped by the loader.
 *
 * @type {string[]}
 */
const notAllowedLoader = [
  'node_modules',
  '.git',
  '.npmignore',
  '.vscode',
  '.DS_Store',
  'Thumbs.db'
]

export default notAllowedLoader
