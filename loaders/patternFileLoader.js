import fs from 'fs/promises'
import path from 'path'
import { pathToFileURL } from 'url'
import validateExtensions from '../validators/validateExtensions.js'
import isAllowedLoader from '../validators/validateAllowedLoader.js'
import { SelfImportHandler } from '../utils/selfImportHandler.js'

function wildcardToRegex(pattern) {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*')
  return new RegExp(`^${escaped}$`)
}

export default async function patternFileLoader(baseDir, pattern) {
  const results = []
  const regex = wildcardToRegex(pattern)

  const selfImportHandler = new SelfImportHandler({
    loaderUrl: import.meta.url,
    loaderFunctionName: 'patternFileLoader'
  })

  async function scan(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        if (!isAllowedLoader(entry.name)) continue
        await scan(fullPath)
        continue
      }

      if (!entry.isFile()) continue
      if (!regex.test(entry.name)) continue

      try {
        validateExtensions(entry.name)
        const mod = await import(pathToFileURL(fullPath).href)

        if (selfImportHandler.shouldSkip(fullPath, mod)) continue

        results.push({ name: entry.name, module: mod.default ?? mod })
      } catch (err) {
        console.warn(`⚠️ Gagal import ${entry.name}:`, err.message)
      }
    }
  }

  await scan(baseDir)
  return results
}
