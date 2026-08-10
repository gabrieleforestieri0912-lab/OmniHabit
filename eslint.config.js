import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, globalIgnores } from 'eslint/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// eslint-config-next 15.x ships legacy configs (extends-based).
// FlatCompat is the official bridge to the flat config used by ESLint 9.
const compat = new FlatCompat({ baseDirectory: __dirname });

export default defineConfig([
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  globalIgnores(['.next', 'node_modules', 'server/dist', 'next-env.d.ts']),
  {
    rules: {
      // React Compiler-era rules: noisy false positives on this codebase.
      // 'off' is safe even if the bundled react-hooks plugin doesn't define them.
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/immutability': 'off',
      // Italian copy is full of apostrophes/quotes in JSX text: this rule
      // adds noise without value for non-English content.
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ]
    }
  }
]);
