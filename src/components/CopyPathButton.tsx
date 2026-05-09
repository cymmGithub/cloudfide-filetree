import { useEffect, useState } from 'react';
import styled from 'styled-components';

type Status = 'idle' | 'copied' | 'error';

interface Props {
	path: readonly string[];
}

export function CopyPathButton({ path }: Props) {
	const [status, setStatus] = useState<Status>('idle');
	const fullPath = '/' + path.join('/');

	useEffect(() => {
		if (status === 'idle') return;
		const id = setTimeout(() => setStatus('idle'), 1500);
		return () => clearTimeout(id);
	}, [status]);

	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(fullPath);
			setStatus('copied');
		} catch {
			setStatus('error');
		}
	}

	const glyph = status === 'copied' ? '✓' : status === 'error' ? '✗' : '⎘';
	const label = status === 'copied' ? 'copied' : status === 'error' ? 'failed' : 'copy path';

	return (
		<Button type="button" onClick={handleCopy} aria-live="polite" $status={status} title={fullPath}>
			<Glyph $status={status}>{glyph}</Glyph>
			<span>{label}</span>
		</Button>
	);
}

const Button = styled.button<{ $status: Status }>`
	display: inline-flex;
	align-items: center;
	gap: 0.6ch;
	padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
	border: 1px solid
		${(props) =>
			props.$status === 'copied'
				? props.theme.colors.success
				: props.$status === 'error'
					? props.theme.colors.error
					: props.theme.colors.border};
	background: transparent;
	color: ${(props) =>
		props.$status === 'copied'
			? props.theme.colors.success
			: props.$status === 'error'
				? props.theme.colors.error
				: props.theme.colors.muted};
	font-family: ${(props) => props.theme.fonts.mono};
	font-size: ${(props) => props.theme.fontSize.micro};
	letter-spacing: ${(props) => props.theme.tracking.wider};
	text-transform: uppercase;
	cursor: pointer;
	transition:
		border-color 0.15s ease,
		color 0.15s ease,
		background 0.15s ease;

	&:hover {
		border-color: ${(props) => props.theme.colors.accent};
		color: ${(props) => props.theme.colors.accent};
	}
`;

const Glyph = styled.span<{ $status: Status }>`
	font-size: ${(props) => props.theme.fontSize.sm};
	color: ${(props) =>
		props.$status === 'copied'
			? props.theme.colors.success
			: props.$status === 'error'
				? props.theme.colors.error
				: props.theme.colors.muted};
`;
