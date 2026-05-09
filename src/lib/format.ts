const KB = 1024;
const MB = KB * 1024;

export function formatBytes(bytes: number): string {
	if (bytes < KB) {
		return `${bytes} B`;
	}
	if (bytes < MB) {
		return `${trimDecimal(bytes / KB)} KB`;
	}
	return `${trimDecimal(bytes / MB)} MB`;
}

function trimDecimal(n: number): string {
	return Number(n.toFixed(1)).toString();
}
