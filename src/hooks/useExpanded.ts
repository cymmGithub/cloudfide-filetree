import { useState } from 'react';

const STORAGE_KEY = 'cloudfide-filetree:expanded-folders';

function loadFromSession(): Set<string> {
	try {
		const raw = sessionStorage.getItem(STORAGE_KEY);
		if (!raw) return new Set();
		const parsed: unknown = JSON.parse(raw);
		if (!Array.isArray(parsed)) return new Set();
		return new Set(parsed.filter((x): x is string => typeof x === 'string'));
	} catch {
		return new Set();
	}
}

function saveToSession(set: Set<string>): void {
	try {
		sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
	} catch {
		// ignore quota / disabled storage
	}
}

export function useExpanded(initialAutoExpandPath: string[]) {
	const [expanded, setExpanded] = useState<Set<string>>(() => {
		const set = loadFromSession();
		// Auto-expand ancestors of the current path on mount only.
		// User-collapsed folders during the session are preserved on subsequent navigations.
		for (let i = 1; i <= initialAutoExpandPath.length; i++) {
			set.add(initialAutoExpandPath.slice(0, i).join('/'));
		}
		return set;
	});

	const toggle = (key: string) => {
		setExpanded((prev) => {
			const next = new Set(prev);
			if (next.has(key)) {
				next.delete(key);
			} else {
				next.add(key);
			}
			saveToSession(next);
			return next;
		});
	};

	return { expanded, toggle };
}
