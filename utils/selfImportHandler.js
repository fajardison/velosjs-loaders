import { fileURLToPath } from 'url'
import path from 'path'

export class SelfImportHandler {
  constructor({ loaderUrl, loaderFunctionName }) {
    this.loaderPath = fileURLToPath(loaderUrl)
    this.loaderFunctionName = loaderFunctionName
  }

  isSelfFile(fullPath) {
    return path.resolve(fullPath) === path.resolve(this.loaderPath)
  }

  isUsingLoaderItself(fn) {
    try {
      return typeof fn === 'function' && fn.toString().includes(this.loaderFunctionName)
    } catch {
      return false
    }
  }

  shouldSkip(fullPath, mod) {
    const exported = mod?.default ?? mod
    return this.isSelfFile(fullPath) || this.isUsingLoaderItself(exported)
  }
}
