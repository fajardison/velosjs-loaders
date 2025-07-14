import fs from 'fs/promises'
import path from 'path'
import { pathToFileURL } from 'url'
import validateExtensions from '../validators/validateExtensions.js'
import { SelfImportHandler } from '../utils/selfImportHandler.js'

/**
 * Dynamically loads one or more files (.js, .mjs, .cjs, .json) from a given directory.
 * Automatically skips self-imports and validates file extensions.
 *
 * @param {string} baseDir - The base directory where the file(s) are located.
 * @param {string|string[]} filenames - A filename or array of filenames to load.
 * @returns {Promise<any|any[]>} The loaded content (JSON or default module exports).
 *
 * @throws {Error} If the file is not found or has an invalid extension.
 */
export default async function fileLoader(baseDir, filenames) {
  const loaderUrl = import.meta.url

  const selfImportHandler = new SelfImportHandler({
    loaderUrl,
    loaderFunctionName: 'fileLoader'
  })

  const loadOne = async (filename) => {
    const { ext, type } = validateExtensions(filename)
    const fullPath = path.resolve(process.cwd(), baseDir, filename)

    try {
      await fs.access(fullPath)
    } catch {
      throw new Error(`File not found: ${fullPath}`)
    }

    if (type === 'json') {
      return JSON.parse(await fs.readFile(fullPath, 'utf-8'))
    }

    const mod = await import(pathToFileURL(fullPath).href)

    if (selfImportHandler.shouldSkip(fullPath, mod)) {
      console.warn(`⚠️ Skipping self-import: ${filename}`)
      return null
    }

    return mod.default ?? mod
  }

  if (typeof filenames === 'string') {
    return await loadOne(filenames)
  }

  if (Array.isArray(filenames)) {
    const results = await Promise.all(filenames.map(loadOne))
    return results.filter(r => r !== null)
  }

  throw new Error('Invalid argument: "filenames" must be a string or an array of strings.')
}
