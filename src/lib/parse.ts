import { z } from 'zod';
import type { TreeNode } from '../types/tree';
import { TreeNodeSchema } from './schema';

export type ParseError = { kind: 'syntax'; message: string } | { kind: 'schema'; message: string };

export type ParseResult = { ok: true; tree: TreeNode } | { ok: false; error: ParseError };

export function parseInput(raw: string): ParseResult {
	let parsed: unknown;
	try {
		parsed = JSON.parse(raw);
	} catch (e) {
		return {
			ok: false,
			error: {
				kind: 'syntax',
				message: e instanceof Error ? e.message : 'Invalid JSON',
			},
		};
	}

	const result = TreeNodeSchema.safeParse(parsed);
	if (!result.success) {
		return {
			ok: false,
			error: {
				kind: 'schema',
				message: z.prettifyError(result.error),
			},
		};
	}

	return { ok: true, tree: result.data };
}
