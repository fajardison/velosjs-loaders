import kali from '../modules/test.module.js'

export default async function kalkulasiPlugin(app) {
  const color = app.color || { green: (x) => x }

  const A = 5
  const B = 10
  const hasil = kali(A, B)

  console.log(color.green(`[PLUGIN] Hasil perkalian ${A} x ${B} = ${hasil}`))

  return 'plugin-kalkulasi'
}
