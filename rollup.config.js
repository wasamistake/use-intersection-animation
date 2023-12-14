import { readFileSync } from 'fs'
import { defineConfig } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'

const pkg = JSON.parse(readFileSync(new URL('package.json', import.meta.url)))

const exclude = [
  '**/*.test.{ts,tsx}',
  'vitest.config.ts',
  'vitest.setup.ts',
  '**/*.stories.{ts,tsx}',
]

export default defineConfig([
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    external: ['react', 'react-dom'],
    plugins: [nodeResolve(), typescript({ exclude }), terser()],
  },
  {
    input: 'src/effects.ts',
    output: {
      file: 'dist/effects.js',
      format: 'esm',
    },
    plugins: [typescript({ exclude }), terser()],
  },
])
