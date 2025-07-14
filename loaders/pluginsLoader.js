import fs from 'fs/promises'
import path from 'path'
import { pathToFileURL } from 'url'
import { SelfImportHandler } from '../utils/selfImportHandler.js'

/**
 * Dynamically loads plugins from multiple configurable sources.
 * Supports inline handlers, local files, or folders.
 *
 * Plugin sources should be defined in `config.pluginSources` with one of the following types:
 * - `inline`: Directly executes a handler function.
 * - `file`: Imports and registers a plugin module from a file.
 * - `folder`: Loads and registers all `.js` files within a folder.
 * - `url`: Currently not supported (warning only).
 *
 * @param {object} config - Application config object containing `pluginSources`.
 * @param {object} server - Server instance (e.g., Fastify).
 * @param {string} baseDir - Root directory of the project.
 * @param {(baseDir: string, filePath: string) => string} pathResolver - Resolves relative plugin paths to absolute paths.
 */
export default async function pluginsLoader(config, server, baseDir, pathResolver) {
  const selfImportHandler = new SelfImportHandler({
    loaderUrl: import.meta.url,
    loaderFunctionName: 'pluginsLoader',
  })

  const sources = config.pluginSources || []

  for (const source of sources) {
    try {
      switch (source.type) {
        case 'inline':
          if (typeof source.handler === 'function') {
            await source.handler(server, config)
          }
          break

        case 'file': {
          const fullPath = pathResolver(baseDir, source.path)
          await registerPluginFromFile(server, fullPath, source.path, selfImportHandler)
          break
        }

        case 'folder': {
          const folderPath = pathResolver(baseDir, source.path)
          const entries = await fs.readdir(folderPath, { withFileTypes: true })

          for (const entry of entries) {
            if (entry.isFile() && entry.name.endsWith('.js')) {
              const filePath = path.join(folderPath, entry.name)
              await registerPluginFromFile(
                server,
                filePath,
                path.join(source.path, entry.name),
                selfImportHandler
              )
            }
          }
          break
        }

        case 'url':
          console.warn(`[pluginsLoader] Plugin loading from URL is not supported: ${source.path}`)
          break

        default:
          console.warn(`[pluginsLoader] Unknown plugin type: ${source.type}`)
      }
    } catch (err) {
      console.error(`[pluginsLoader] Failed to load plugin (${source.type}): ${source.path || 'inline'}`, err)
    }
  }
}

/**
 * Registers a plugin module from a file using `server.instance.register`.
 * Skips the module if it is the loader itself (self-import).
 *
 * @param {object} server - Server instance (e.g., Fastify).
 * @param {string} fullPath - Absolute file path to the plugin module.
 * @param {string} [nameHint] - Optional name for logging and debugging.
 * @param {SelfImportHandler} [selfImportHandler] - Instance to check and skip self-imports.
 */
async function registerPluginFromFile(server, fullPath, nameHint = '', selfImportHandler) {
  try {
    const { default: mod } = await import(pathToFileURL(fullPath).href)

    if (selfImportHandler?.shouldSkip(fullPath, mod)) {
      console.warn(`[pluginsLoader] Skipped self-import: ${nameHint}`)
      return
    }

    if (typeof mod === 'function') {
      await server.instance.register(mod)
    }
  } catch (err) {
    console.error(`[pluginsLoader] Failed to import plugin "${nameHint}":`, err)
  }
}
