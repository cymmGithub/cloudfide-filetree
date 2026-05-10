import type { TreeNode } from '../types/tree';
import { z } from 'zod';

export const FileNodeSchema = z.strictObject({
	name: z.string().min(1, 'Name cannot be empty'),
	type: z.literal('file'),
	size: z.number().int('Size must be an integer').nonnegative('Size cannot be negative'),
});

export const FolderNodeSchema = z.strictObject({
	name: z.string().min(1, 'Name cannot be empty'),
	type: z.literal('folder'),
	children: z.array(z.lazy((): z.ZodType<TreeNode> => TreeNodeSchema)),
});

export const TreeNodeSchema = z.discriminatedUnion('type', [FileNodeSchema, FolderNodeSchema]);
