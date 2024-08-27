import { defineConfig } from 'vite'
import Userscript from 'vite-userscript-plugin'

import { homepage, license, name, version } from './package.json'

export default defineConfig((config) => {
  return {
    plugins: [
      Userscript({
        fileName: name,
        entry: 'src/index.ts',
        header: {
          name,
          version,
          license,
          homepage,
          icon: 'https://cdn.steamgifts.com/img/favicon.ico',
          match: ['https://www.steamgifts.com/*']
        },
        server: {
          port: 3000
        }
      })

    ]
  }
})
