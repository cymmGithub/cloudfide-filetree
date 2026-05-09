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

	const label = status === 'copied' ? '✓ Copied' : status === 'error' ? '✗ Failed' : 'Copy path';

	return (
		<Button type="button" onClick={handleCopy} aria-live="polite" $status={status} title={fullPath}>
			{label}
		</Button>
	);
}

const Button = styled.button<{ $status: Status }>`
	display: inline-flex;
	align-items: center;
	gap: ${(props) => props.theme.spacing.xs};
	padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
	border: 1px solid ${(props) => props.theme.colors.border};
	border-radius: ${(props) => props.theme.radius.sm};
	background: ${(props) => props.theme.colors.bg};
	color: ${(props) =>
		props.$status === 'copied'
			? props.theme.colors.success
			: props.$status === 'error'
				? props.theme.colors.error
				: props.theme.colors.muted};
	font-size: ${(props) => props.theme.fontSize.sm};
	font-family: ${(props) => props.theme.fonts.mono};
	cursor: pointer;

	&:hover {
		background: ${(props) => props.theme.colors.surface};
		color: ${(props) => props.theme.colors.text};
	}
`;
