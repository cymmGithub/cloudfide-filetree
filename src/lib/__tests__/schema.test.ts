import { describe, it, expect } from 'vitest';
import { FileNodeSchema, FolderNodeSchema, TreeNodeSchema } from '../schema';

describe('FileNodeSchema', () => {
	describe('when given a valid file node', () => {
		it('returns success with the parsed data', () => {
			const input = { name: 'index.ts', type: 'file', size: 1024 };
			const result = FileNodeSchema.safeParse(input);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual(input);
			}
		});
	});

	describe('when size is negative', () => {
		it('rejects', () => {
			const result = FileNodeSchema.safeParse({ name: 'x', type: 'file', size: -1 });
			expect(result.success).toBe(false);
		});
	});

	describe('when extra fields are present', () => {
		it('rejects under strict mode', () => {
			const result = FileNodeSchema.safeParse({
				name: 'x',
				type: 'file',
				size: 1,
				permissions: 'rwx',
			});
			expect(result.success).toBe(false);
		});
	});
});

describe('FolderNodeSchema', () => {
	describe('when given a valid empty folder', () => {
		it('returns success', () => {
			const input = { name: 'src', type: 'folder', children: [] };
			const result = FolderNodeSchema.safeParse(input);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual(input);
			}
		});
	});

	describe('when given a valid folder with mixed children', () => {
		it('returns success and preserves the structure', () => {
			const input = {
				name: 'src',
				type: 'folder',
				children: [
					{ name: 'index.ts', type: 'file', size: 100 },
					{ name: 'lib', type: 'folder', children: [] },
				],
			};
			const result = FolderNodeSchema.safeParse(input);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual(input);
			}
		});
	});

	describe('when children is missing', () => {
		it('rejects', () => {
			const result = FolderNodeSchema.safeParse({ name: 'src', type: 'folder' });
			expect(result.success).toBe(false);
		});
	});

	describe('when extra fields are present', () => {
		it('rejects under strict mode', () => {
			const result = FolderNodeSchema.safeParse({
				name: 'src',
				type: 'folder',
				children: [],
				readme: 'foo',
			});
			expect(result.success).toBe(false);
		});
	});
});

describe('TreeNodeSchema', () => {
	describe('when given a deeply nested valid tree', () => {
		it('returns success', () => {
			const input = {
				name: 'root',
				type: 'folder',
				children: [
					{
						name: 'src',
						type: 'folder',
						children: [
							{
								name: 'components',
								type: 'folder',
								children: [{ name: 'Button.tsx', type: 'file', size: 512 }],
							},
						],
					},
				],
			};
			const result = TreeNodeSchema.safeParse(input);
			expect(result.success).toBe(true);
		});
	});

	describe('when type literal is unknown', () => {
		it('rejects', () => {
			const result = TreeNodeSchema.safeParse({ name: 'x', type: 'symlink', size: 1 });
			expect(result.success).toBe(false);
		});
	});
});
