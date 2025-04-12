import { build } from 'esbuild'
import path from 'path'
import fs from 'fs'
import { parse } from 'jsonc-parser'

const tsconfig = parse(fs.readFileSync('tsconfig.json', 'utf-8'));
const tsPaths = tsconfig.compilerOptions.paths || {};

const aliases = {};

for (const alias in tsPaths) {
    const cleanAlias = alias.replace('/*', '')
    const target = tsPaths[alias][0]
        .replace(/^src\//, '') // sacamos src/ para que empiece en app/...
        .replace('/*', '');
    aliases[cleanAlias] = path.resolve('src', target);
}

await build({
    entryPoints: [ 'src/app/server.ts' ],
    outfile: 'dist/server.js',
    bundle: true,
    platform: 'node',
    target: 'node20',
    sourcemap: true,
    tsconfig: 'tsconfig.json',
    alias: aliases,
    external: [ 'swagger-ui-express' ],
});
