import { describe, it, expect } from 'vitest';
import { parseInput } from '../parse';

describe('parseInput', () => {
	describe('when given valid JSON matching the tree schema', () => {
		it('returns ok with the parsed tree', () => {
			const input = {
				name: 'root',
				type: 'folder',
				children: [{ name: 'index.ts', type: 'file', size: 100 }],
			};
			const result = parseInput(JSON.stringify(input));

			expect(result.ok).toBe(true);
			if (result.ok) {
				expect(result.tree).toEqual(input);
			}
		});
	});

	describe('when given malformed JSON', () => {
		it('returns a syntax error', () => {
			const result = parseInput('{ name: "foo"');

			expect(result.ok).toBe(false);
			if (!result.ok) {
				expect(result.error.kind).toBe('syntax');
			}
		});
	});

	describe('when given valid JSON with wrong root structure', () => {
		it('returns a schema error', () => {
			const result = parseInput('[1,2,3]');

			expect(result.ok).toBe(false);
			if (!result.ok) {
				expect(result.error.kind).toBe('schema');
			}
		});
	});

	describe('when given an object missing required fields', () => {
		it('returns a schema error', () => {
			const result = parseInput('{"name":"x","type":"file"}');

			expect(result.ok).toBe(false);
			if (!result.ok) {
				expect(result.error.kind).toBe('schema');
			}
		});
	});
});
