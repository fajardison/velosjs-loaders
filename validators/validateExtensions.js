// validators/validateExtensions.js

import allowedExtensions from '../constants/allowedExtensions.js'

/**
 * Validasi ekstensi file dan kembalikan jenisnya (type).
 *
 * @param {string} filename - Nama file yang akan divalidasi.
 * @returns {{ ext: string, type: string }} - Ekstensi dan tipe file.
 * @throws {Error} Jika filename bukan string, tidak memiliki ekstensi,
 *         atau ekstensi tidak termasuk yang diizinkan.
 */
export default function validateExtensions(filename) {
  if (typeof filename !== 'string') {
    throw new Error('❌ Parameter "filename" harus berupa string.')
  }

  const dotIndex = filename.lastIndexOf('.')
  if (dotIndex === -1) {
    throw new Error(`❌ File "${filename}" tidak memiliki ekstensi.`)
  }

  const ext = filename.slice(dotIndex)

  for (const [type, extensions] of Object.entries(allowedExtensions)) {
    if (extensions.includes(ext)) {
      return { ext, type }
    }
  }

  const allowedList = Object.values(allowedExtensions).flat().join(', ')
  throw new Error(`❌ Ekstensi "${ext}" tidak didukung. Gunakan: ${allowedList}`)
}
