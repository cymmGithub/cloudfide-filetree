import { describe, it, expect } from 'vitest';
import { decodePath, encodePath } from '../path';

describe('encodePath', () => {
	it.each([
		[[], ''],
		[['src'], 'src'],
		[['src', 'index.ts'], 'src/index.ts'],
		[['my folder', 'a b.ts'], 'my%20folder/a%20b.ts'],
		[['?test', '#hash'], '%3Ftest/%23hash'],
	])('encodes %j as "%s"', (segments, expected) => {
		expect(encodePath(segments)).toBe(expected);
	});
});

describe('decodePath', () => {
	it.each([
		['', []],
		['src/index.ts', ['src', 'index.ts']],
		['my%20folder/a%20b.ts', ['my folder', 'a b.ts']],
	])('decodes "%s" as %j', (splat, expected) => {
		expect(decodePath(splat)).toEqual(expected);
	});

	it('round-trips through encode → decode', () => {
		const segments = ['src', 'a b.ts', '#weird?'];
		expect(decodePath(encodePath(segments))).toEqual(segments);
	});
});
