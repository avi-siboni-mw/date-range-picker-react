import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const esmRoot = path.resolve('dist/esm')
const relativeImportPattern = /((?:import|export)\s.+?\sfrom\s+['"])(\.\.?\/[^'".]+)(['"])/g

const rewriteImports = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true })

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      await rewriteImports(entryPath)
      continue
    }

    if (!entry.name.endsWith('.js')) {
      continue
    }

    const content = await readFile(entryPath, 'utf8')
    const updatedContent = content.replace(relativeImportPattern, '$1$2.js$3')

    if (updatedContent !== content) {
      await writeFile(entryPath, updatedContent)
    }
  }
}

await rewriteImports(esmRoot)
await writeFile(
  path.join(esmRoot, 'package.json'),
  `${JSON.stringify({ type: 'module' }, null, 2)}\n`
)
