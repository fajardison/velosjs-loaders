/**
 * Daftar ekstensi file yang diperbolehkan untuk dimuat oleh loader.
 *
 * - jsModule: ekstensi untuk modul JavaScript.
 * - json: ekstensi untuk file JSON.
 */
const allowedExtensions = {
  jsModule: ['.js', '.mjs', '.cjs'],
  json: ['.json'],
}

export default allowedExtensions
