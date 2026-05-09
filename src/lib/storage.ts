import type { TreeNode } from '../types/tree';
import { TreeNodeSchema } from './schema';

const TREE_KEY = 'cloudfide-filetree:current-tree';

export function saveTree(tree: TreeNode): void {
	try {
		localStorage.setItem(TREE_KEY, JSON.stringify(tree));
	} catch {
		// localStorage unavailable (private mode, quota exceeded, disabled)
		// caller will detect via subsequent loadTree() returning null
	}
}

export function loadTree(): TreeNode | null {
	try {
		const raw = localStorage.getItem(TREE_KEY);
		if (!raw) return null;

		const parsed: unknown = JSON.parse(raw);
		const result = TreeNodeSchema.safeParse(parsed);
		return result.success ? result.data : null;
	} catch {
		return null;
	}
}

export function clearTree(): void {
	try {
		localStorage.removeItem(TREE_KEY);
	} catch {
		// ignore — nothing meaningful to do if storage is unavailable
	}
}
