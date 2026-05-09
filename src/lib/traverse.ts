import type { TreeNode } from '../types/tree';

export type FlatEntry = {
	readonly name: string;
	readonly segments: readonly string[];
	readonly type: 'file' | 'folder';
	readonly size: number;
};

export function findNode(tree: TreeNode, path: string[]): TreeNode | null {
	let current: TreeNode = tree;
	for (const segment of path) {
		if (current.type === 'file') {
			return null;
		}
		const next = current.children.find((child) => child.name === segment);
		if (!next) {
			return null;
		}
		current = next;
	}
	return current;
}

export function calculateSize(tree: TreeNode): number {
	if (tree.type === 'file') {
		return tree.size;
	}
	return tree.children.reduce((sum, child) => sum + calculateSize(child), 0);
}

/**
 * Flattens the tree into a search-friendly array of descendants (root excluded).
 * Computed once per tree; memoize at the call site.
 */
export function buildFlatIndex(root: TreeNode): FlatEntry[] {
	const out: FlatEntry[] = [];

	function walk(node: TreeNode, segments: string[]) {
		if (segments.length > 0) {
			out.push({
				name: node.name,
				segments: [...segments],
				type: node.type,
				size: calculateSize(node),
			});
		}
		if (node.type === 'folder') {
			for (const child of node.children) {
				walk(child, [...segments, child.name]);
			}
		}
	}

	walk(root, []);
	return out;
}

/** Case-insensitive substring search over the flat index. */
export function searchIndex(index: readonly FlatEntry[], query: string): FlatEntry[] {
	const normalized = query.trim().toLowerCase();
	if (normalized.length === 0) return [];
	return index.filter((entry) => entry.name.toLowerCase().includes(normalized));
}
