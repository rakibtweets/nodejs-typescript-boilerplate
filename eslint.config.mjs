import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  {
    ignores: ['dist', 'build', 'node_modules']
  },
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          // parser: 'flow',
          semi: true,
          trailingComma: 'none',
          bracketSameLine: false,
          bracketSpacing: true,
          endOfLine: 'auto'
        }
      ]
    }
  }
];
