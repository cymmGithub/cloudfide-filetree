import type { TreeNode } from '../../types/tree';
import { describe, it, expect } from 'vitest';
import { buildFlatIndex, calculateSize, findNode, searchIndex } from '../traverse';

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

describe('buildFlatIndex', () => {
	it('flattens descendants (excluding the root) with full segments', () => {
		const index = buildFlatIndex(tree);
		expect(index.map((e) => e.name)).toEqual([
			'src',
			'index.ts',
			'components',
			'Button.tsx',
			'package.json',
			'empty',
		]);
		const buttonEntry = index.find((e) => e.name === 'Button.tsx');
		expect(buttonEntry?.segments).toEqual(['src', 'components', 'Button.tsx']);
	});

	it('precomputes total size for folders and stores file size for files', () => {
		const index = buildFlatIndex(tree);
		expect(index.find((e) => e.name === 'src')?.size).toBe(300);
		expect(index.find((e) => e.name === 'Button.tsx')?.size).toBe(200);
	});
});

describe('searchIndex', () => {
	it('returns case-insensitive substring matches', () => {
		const index = buildFlatIndex(tree);
		const hits = searchIndex(index, 'BUTTON');
		expect(hits).toHaveLength(1);
		expect(hits[0]?.name).toBe('Button.tsx');
	});

	it('returns an empty array when nothing matches', () => {
		expect(searchIndex(buildFlatIndex(tree), 'xyz')).toEqual([]);
	});

	it('returns an empty array for a blank query', () => {
		expect(searchIndex(buildFlatIndex(tree), '   ')).toEqual([]);
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
