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
	background: #fef08a;
	color: ${(props) => props.theme.colors.text};
	padding: 0 1px;
	border-radius: 2px;
	font-weight: 600;
`;
