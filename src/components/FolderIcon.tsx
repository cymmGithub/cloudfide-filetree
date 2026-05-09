interface Props {
	size?: number;
}

export function FolderIcon({ size = 13 }: Props) {
	const h = (size * 11) / 14;
	return (
		<svg
			width={size}
			height={h}
			viewBox="0 0 14 11"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.1}
			strokeLinejoin="miter"
			aria-hidden="true"
			focusable="false"
		>
			<path d="M0.6 1.2 L4.4 1.2 L5.6 2.4 L13.4 2.4 L13.4 9.8 L0.6 9.8 Z" />
		</svg>
	);
}
