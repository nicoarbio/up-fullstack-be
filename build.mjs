import { build } from 'esbuild'
import path from 'path'

await build({
  entryPoints: ['src/app/server.ts'],
  outfile: 'dist/server.js',
  bundle: true,
  platform: 'node',
  target: 'node20',
  sourcemap: true,
  tsconfig: 'tsconfig.json',
  alias: {
  '@app': path.resolve('src', 'app/app.ts'),
  '@model': path.resolve('src', 'app/model'),
  '@enum': path.resolve('src', 'app/model/enum'),
  '@service': path.resolve('src', 'app/service'),
  '@controller': path.resolve('src', 'app/controller'),
  '@route': path.resolve('src', 'app/route'),
  '@config': path.resolve('src', 'app/config')
  }
})
