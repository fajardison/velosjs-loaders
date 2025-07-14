import fs from 'fs/promises'
import path from 'path'
import { pathToFileURL } from 'url'
import validateExtensions from '../validators/validateExtensions.js'
import isAllowedLoader from '../validators/validateAllowedLoader.js'
import { SelfImportHandler } from '../utils/selfImportHandler.js'

/**
 * Recursively loads JavaScript modules from one or more directories.
 *
 * For each valid file:
 * - If `onLoad` is provided, it will be called with (mod, fullPath, filename)
 * - Otherwise, if `app.register` is a function, the module will be registered.
 *
 * Automatically skips self-imports to prevent infinite loops.
 *
 * @param {object} app - The application object.
 * @param {string|string[]} dirs - One or more directory paths.
 * @param {(mod: Function, fullPath: string, filename: string) => Promise<void>} [onLoad] - Optional callback when a module is loaded.
 */
export default async function recursiveModuleLoader(app, dirs, onLoad = null) {
  if (!Array.isArray(dirs)) dirs = [dirs]

  const selfImportHandler = new SelfImportHandler({
    loaderUrl: import.meta.url,
    loaderFunctionName: 'recursiveModuleLoader'
  })

  const visited = new Set()

  for (const dir of dirs) {
    const fullPath = path.resolve(dir)
    await loadFromDir(app, fullPath, fullPath, onLoad, visited, selfImportHandler)
  }
}

/**
 * Helper function to recursively scan and load modules from a directory.
 *
 * @param {object} app - Application object passed from the main loader.
 * @param {string} currentDir - Current directory being scanned.
 * @param {string} baseDir - Root directory for relative path tracking.
 * @param {Function|null} onLoad - Optional callback when module is found.
 * @param {Set<string>} visited - Set of already visited directories.
 * @param {SelfImportHandler} selfImportHandler - Self-import guard.
 */
async function loadFromDir(app, currentDir, baseDir, onLoad, visited, selfImportHandler) {
  if (visited.has(currentDir)) return
  visited.add(currentDir)

  let entries
  try {
    entries = await fs.readdir(currentDir, { withFileTypes: true })
  } catch {
    console.warn(`⚠️ Cannot read directory: ${currentDir}`)
    return
  }

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name)

    if (entry.isDirectory()) {
      if (!isAllowedLoader(entry.name)) continue
      await loadFromDir(app, fullPath, baseDir, onLoad, visited, selfImportHandler)
      continue
    }

    if (!entry.isFile()) continue

    const relativePath = path.relative(baseDir, fullPath)

    let type
    try {
      ({ type } = validateExtensions(relativePath))
    } catch {
      continue // Skip unsupported extension
    }

    try {
      const { default: mod } = await import(pathToFileURL(fullPath).href)

      if (selfImportHandler.shouldSkip(fullPath, mod)) {
        console.warn(`⚠️ Skipped "${entry.name}" due to self-import`)
        continue
      }

      if (typeof mod === 'function') {
        if (onLoad) {
          await onLoad(mod, fullPath, entry.name)
        } else if (typeof app.register === 'function') {
          await app.register(mod)
        } else {
          console.warn(`⚠️ app.register() not found. Skipped file "${entry.name}"`)
        }
      }
    } catch (err) {
      console.warn(`⚠️ Failed to load "${fullPath}":\n${err.message}`)
    }
  }
}
