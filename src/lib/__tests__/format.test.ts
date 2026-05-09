import { describe, it, expect } from 'vitest';
import { formatBytes } from '../format';

describe('formatBytes', () => {
	it.each([
		[0, '0 B'],
		[512, '512 B'],
		[1023, '1023 B'],
		[1024, '1 KB'],
		[1536, '1.5 KB'],
		[1024 * 1024, '1 MB'],
		[1024 * 1024 * 2.5, '2.5 MB'],
	])('formats %i bytes as "%s"', (bytes, expected) => {
		expect(formatBytes(bytes)).toBe(expected);
	});
});
