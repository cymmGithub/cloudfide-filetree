import type { TreeNode } from '../types/tree';

export type SearchResult = { node: TreeNode; path: string[] };

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

export function searchTree(tree: TreeNode, query: string): SearchResult[] {
	const normalized = query.toLowerCase();
	const results: SearchResult[] = [];

	function visit(node: TreeNode, pathToHere: string[]) {
		if (node.name.toLowerCase().includes(normalized)) {
			results.push({ node, path: pathToHere });
		}
		if (node.type === 'folder') {
			for (const child of node.children) {
				visit(child, [...pathToHere, child.name]);
			}
		}
	}

	visit(tree, []);
	return results;
}

export function calculateSize(tree: TreeNode): number {
	if (tree.type === 'file') {
		return tree.size;
	}
	return tree.children.reduce((sum, child) => sum + calculateSize(child), 0);
}
