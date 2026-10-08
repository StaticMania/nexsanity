import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import unicorn from 'eslint-plugin-unicorn'

const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'next-env.d.ts',
      'sanity/sanity.types.ts',
      'sanity/schema.json',
      'seed/images/**',
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    plugins: { unicorn },
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [
            { pattern: '@/lib/**', group: 'internal', position: 'before' },
            { pattern: '@/components/**', group: 'internal' },
            { pattern: '@/hooks/**', group: 'internal', position: 'after' },
            { pattern: '@/types/**', group: 'internal', position: 'after' },
            { pattern: '@/sanity/**', group: 'internal', position: 'after' },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc' },
        },
      ],
      'no-restricted-imports': ['error', { patterns: ['../*'] }],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-nested-ternary': 'error',
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
    },
  },
]

export default eslintConfig
