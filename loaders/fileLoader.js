import fs from 'fs/promises'
import path from 'path'
import { pathToFileURL } from 'url'
import validateExtensions from '../validators/validateExtensions.js'
import { SelfImportHandler } from '../utils/selfImportHandler.js'

/**
 * Memuat satu atau beberapa file (.js, .mjs, .cjs, .json).
 * File loader ini sendiri akan dilewati secara otomatis.
 *
 * @param {string} baseDir - Direktori dasar tempat file berada.
 * @param {string|string[]} filenames - Nama file atau array file yang akan dimuat.
 * @returns {Promise<any|any[]>} - Isi file JSON atau modul default.
 * @throws {Error} - Jika file tidak ditemukan atau ekstensi tidak valid.
 */
export default async function fileLoader(baseDir, filenames) {
  const loaderUrl = import.meta.url
  // Buat instance SelfImportHandler untuk fileLoader ini
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
      throw new Error(`❌ File tidak ditemukan: ${fullPath}`)
    }

    if (type === 'json') {
      return JSON.parse(await fs.readFile(fullPath, 'utf-8'))
    }

    const mod = await import(pathToFileURL(fullPath).href)

    // Gunakan selfImportHandler untuk cek self-import
    if (selfImportHandler.shouldSkip(fullPath, mod)) {
      console.warn(`⚠️ Lewati self-import: ${filename}`)
      return null
    }

    return mod.default ?? mod
  }

  if (typeof filenames === 'string') {
    return await loadOne(filenames)
  }

  if (Array.isArray(filenames)) {
    const results = await Promise.all(filenames.map(loadOne))
    return results.filter((r) => r !== null)
  }

  throw new Error('❌ Parameter "filenames" harus berupa string atau array.')
}
