export function encodePath(segments: string[]): string {
	return segments.map(encodeURIComponent).join('/');
}

export function decodePath(splat: string): string[] {
	if (!splat) return [];
	return splat.split('/').map(decodeURIComponent);
}
