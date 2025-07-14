[![npm version](https://img.shields.io/npm/v/@velosjs/loaders)](https://www.npmjs.com/package/@velosjs/loaders)
[![Version](https://img.shields.io/badge/Version-v1.0.0-blue)](https://www.npmjs.com/package/@velosjs/loaders?activeTab=versions)
[![License](https://img.shields.io/badge/License-MIT-green)](https://github.com/fajardison/velosjs-loaders/blob/main/LICENSE)
[![ESM](https://img.shields.io/badge/javascript-ESM-orange)](https://nodejs.org/api/esm.html)

# @velosjs/loaders

A lightweight utility collection for dynamic loading in **VelosJS** — supports safe and flexible loading of modules, plugins, files, and wildcard patterns.

---

## ✨ Features

- 🔁 Recursive module loading  
- 🎯 Wildcard pattern file loading  
- ⚙️ Automatic plugin loader  
- ✅ File and directory validation  
- 🚫 Self-import skipping  

---

## 📦 Installation

```bash
npm install @velosjs/loaders
```

---

## 🚀 Usage

### Default import

```js
import loaders from '@velosjs/loaders'

await loaders.recursiveModuleLoader(app, ['./plugins'])
```

### Named import

```js
import {
  recursiveModuleLoader,
  fileLoader,
  patternFileLoader,
  pluginsLoader
} from '@velosjs/loaders'
```

---

## 📘 API Reference

### `recursiveModuleLoader(app, dirs, onLoad?)`

Recursively loads JavaScript modules from one or more directories.

```js
await recursiveModuleLoader(app, ['./plugins', './modules'])
```

- Calls `app.register(fn)` if available  
- Optional `onLoad(mod, fullPath, filename)` callback  

---

### `fileLoader(baseDir, filenames)`

Loads one or more files (.js, .json, etc.) from a specified directory.

```js
const config = await fileLoader('./config', 'settings.json')
```

---

### `patternFileLoader(baseDir, pattern)`

Loads all files that match a wildcard pattern (non-recursive).

```js
const modules = await patternFileLoader('./modules', '*.plugin.js')
```

---

### `pluginsLoader(config, server, baseDir, pathResolver)`

Dynamically loads plugins defined in `config.pluginSources`. Supports:

- `inline`: direct handler function  
- `file`: path to a single plugin file  
- `folder`: load all `.js` files from a directory  
- `url`: not supported yet (reserved for future)  

Example usage:

```js
await pluginsLoader(config, server, process.cwd(), (base, rel) => path.join(base, rel))
```

---

## 🛠️ Utilities

- `validateExtensions(filename)` — validate file extensions  
- `isAllowedLoader(entryName)` — check if a file/folder name is allowed  
- `notAllowedLoader` — list of disallowed filenames (e.g. `.git`, `node_modules`)  
- `SelfImportHandler` — utility to prevent loaders from importing themselves  

---

## 👤 Author

**Dimas Fajar**  
[GitHub @fajardison](https://github.com/fajardison)

---

## ⚖️ License

This project is licensed under the **MIT License**.
