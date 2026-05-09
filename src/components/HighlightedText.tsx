import { Fragment } from 'react';
import styled from 'styled-components';

interface Props {
	text: string;
	query: string;
}

export function HighlightedText({ text, query }: Props) {
	if (!query) {
		return <>{text}</>;
	}

	const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
	const lowerQuery = query.toLowerCase();

	return (
		<>
			{parts.map((part, i) =>
				part.toLowerCase() === lowerQuery ? (
					<Mark key={i}>{part}</Mark>
				) : (
					<Fragment key={i}>{part}</Fragment>
				),
			)}
		</>
	);
}

const Mark = styled.mark`
	background: ${(props) => props.theme.colors.accentSoft};
	color: ${(props) => props.theme.colors.accent};
	padding: 0 0.15ch;
	border-radius: 0;
	font-weight: 600;
	box-shadow: inset 0 -1px 0 ${(props) => props.theme.colors.accent};
`;
