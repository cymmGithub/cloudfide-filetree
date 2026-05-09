import { describe, it, expect } from 'vitest';
import type { TreeNode } from '../../types/tree';
import { calculateSize, findNode, searchTree } from '../traverse';

const tree: TreeNode = {
	name: 'root',
	type: 'folder',
	children: [
		{
			name: 'src',
			type: 'folder',
			children: [
				{ name: 'index.ts', type: 'file', size: 100 },
				{
					name: 'components',
					type: 'folder',
					children: [{ name: 'Button.tsx', type: 'file', size: 200 }],
				},
			],
		},
		{ name: 'package.json', type: 'file', size: 300 },
		{ name: 'empty', type: 'folder', children: [] },
	],
};

describe('findNode', () => {
	it('returns the root for an empty path', () => {
		expect(findNode(tree, [])).toBe(tree);
	});

	it('finds a deeply nested file', () => {
		const result = findNode(tree, ['src', 'components', 'Button.tsx']);
		expect(result?.name).toBe('Button.tsx');
	});

	it('returns null for a missing segment', () => {
		expect(findNode(tree, ['src', 'nonexistent'])).toBeNull();
	});

	it('returns null when path tries to descend into a file', () => {
		expect(findNode(tree, ['package.json', 'something'])).toBeNull();
	});
});

describe('searchTree', () => {
	it('returns matches with their full paths from root', () => {
		const results = searchTree(tree, 'button');

		expect(results).toHaveLength(1);
		expect(results[0]?.node.name).toBe('Button.tsx');
		expect(results[0]?.path).toEqual(['src', 'components', 'Button.tsx']);
	});

	it('is case-insensitive', () => {
		expect(searchTree(tree, 'BUTTON')).toHaveLength(1);
	});

	it('returns an empty array when nothing matches', () => {
		expect(searchTree(tree, 'xyz')).toEqual([]);
	});
});

describe('calculateSize', () => {
	it('returns the size of a single file', () => {
		const file: TreeNode = { name: 'x', type: 'file', size: 42 };
		expect(calculateSize(file)).toBe(42);
	});

	it('sums all files recursively across nested folders', () => {
		expect(calculateSize(tree)).toBe(600);
	});

	it('returns 0 for an empty folder', () => {
		const empty: TreeNode = { name: 'empty', type: 'folder', children: [] };
		expect(calculateSize(empty)).toBe(0);
	});
});
