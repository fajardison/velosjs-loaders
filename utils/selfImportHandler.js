import { fileURLToPath } from 'url'
import path from 'path'

/**
 * SelfImportHandler prevents accidental self-imports during dynamic module loading.
 *
 * It detects whether:
 * - The file being loaded is the loader itself.
 * - The loaded module contains a function that references the loader function name.
 */
export class SelfImportHandler {
  /**
   * @param {object} options
   * @param {string} options.loaderUrl - Absolute `import.meta.url` of the loader file.
   * @param {string} options.loaderFunctionName - Name of the loader function to detect in source.
   */
  constructor({ loaderUrl, loaderFunctionName }) {
    this.loaderPath = fileURLToPath(loaderUrl)
    this.loaderFunctionName = loaderFunctionName
  }

  /**
   * Checks if the given path is the loader file itself.
   *
   * @param {string} fullPath - Absolute path to the current file being evaluated.
   * @returns {boolean} True if it's the loader file.
   */
  isSelfFile(fullPath) {
    return path.resolve(fullPath) === path.resolve(this.loaderPath)
  }

  /**
   * Checks whether a module exports a function that calls the loader.
   *
   * @param {Function} fn - The exported function from the module.
   * @returns {boolean} True if it calls the loader function.
   */
  isUsingLoaderItself(fn) {
    try {
      return typeof fn === 'function' && fn.toString().includes(this.loaderFunctionName)
    } catch {
      return false
    }
  }

  /**
   * Determines if the given module should be skipped to avoid self-import.
   *
   * @param {string} fullPath - Full file path to the imported module.
   * @param {*} mod - The imported module object.
   * @returns {boolean} True if the module should be skipped.
   */
  shouldSkip(fullPath, mod) {
    const exported = mod?.default ?? mod
    return this.isSelfFile(fullPath) || this.isUsingLoaderItself(exported)
  }
}
