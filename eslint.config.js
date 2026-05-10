import js from '@eslint/js';
import globals from 'globals';
import perfectionist from 'eslint-plugin-perfectionist';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
	globalIgnores(['dist']),
	{
		files: ['**/*.{ts,tsx}'],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs.flat.recommended,
			reactRefresh.configs.vite,
			eslintConfigPrettier,
		],
		plugins: {
			perfectionist,
		},
		languageOptions: {
			globals: globals.browser,
		},
		rules: {
			'perfectionist/sort-imports': [
				'error',
				{
					type: 'natural',
					order: 'asc',
					ignoreCase: true,
					newlinesBetween: 'ignore',
					groups: [
						['type-import', 'type-internal', 'type-parent', 'type-sibling', 'type-index'],
						['value-builtin', 'value-external'],
						'value-internal',
						['value-parent', 'value-sibling', 'value-index'],
						'styled-components',
						'unknown',
					],
					customGroups: [
						{
							groupName: 'styled-components',
							elementNamePattern: '^styled-components$',
						},
					],
				},
			],
		},
	},
]);
