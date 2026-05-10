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

	function walk(node: TreeNode, segments: string[]): number {
		let placeholder: FlatEntry | null = null;
		let slot = -1;
		if (segments.length > 0) {
			placeholder = {
				name: node.name,
				segments: [...segments],
				type: node.type,
				size: 0,
			};
			slot = out.length;
			out.push(placeholder);
		}

		let size: number;
		if (node.type === 'file') {
			size = node.size;
		} else {
			size = 0;
			for (const child of node.children) {
				size += walk(child, [...segments, child.name]);
			}
		}

		if (placeholder !== null) {
			out[slot] = { ...placeholder, size };
		}
		return size;
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
