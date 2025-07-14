# @velosjs/loaders

💡 Koleksi utilitas loader dinamis untuk VelosJS — mendukung pemuatan modul, plugin, file, dan pola wildcard dengan aman dan fleksibel.

---

## ✨ Fitur

- 🔁 Loader modul secara **rekursif**
- 🎯 Loader file berdasarkan **pattern wildcard**
- ⚙️ Loader plugin otomatis
- 📦 Validasi ekstensi file & entri
- 🚫 Lewati self-import secara otomatis

---

## 📦 Instalasi

```bash
npm install @velosjs/loaders
```

---

🔰 Penggunaan
Default Import

```js
import loaders from '@velosjs/loaders'

await loaders.recursiveModuleLoader(app, ['./plugins'])
```

Named Import

```js
import { recursiveModuleLoader } from '@velosjs/loaders'

await recursiveModuleLoader(app, ['./plugins'])
```

---

🧩 API
**_`recursiveModuleLoader(app, dirs, onLoad?)`_**
Memuat semua modul JS dari direktori secara rekursif.

```js
await recursiveModuleLoader(app, ['./plugins', './modules'])
```

**_`app.register(fn)`_** akan dipanggil jika tersedia
**_`onLoad(fn, fullPath, filename)`_** bisa digunakan sebagai alternatif

**_`fileLoader(baseDir, filenames)`_**
Memuat satu atau beberapa file .js, .json, dan lainnya.
```js
const config = await fileLoader('./configs', 'settings.json')
```

**_`patternFileLoader(baseDir, pattern)`_**
Memuat semua file yang cocok dengan pola wildcard (**_`*.plugin.js`_**, dsb).

```js
const modules = await patternFileLoader('./modules', '*.plugin.js')
```

**_`pluginsLoader(app, pluginPath)`_**
Loader khusus untuk satu file plugin utama (biasanya **_`plugins.js`_**).

---

## 🔧 Komponen Lain
**_`validateExtensions(entryName)`_**

**_`shouldLoadEntry(entryName)`_**

**_`notAllowedLoader`_** – daftar entri yang tidak boleh dimuat

**_`SelfImportHandler`_** – untuk deteksi self-import modul loader

---

## 👤 Author
* Nama: Dimas Fajar

* GitHub: @fajardison

---

## ⚖️ Lisensi
* MIT
