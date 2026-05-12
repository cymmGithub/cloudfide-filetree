import type { FlatEntry } from '../lib/traverse';
import { Link } from 'react-router-dom';
import { encodePath } from '../lib/path';
import { FolderIcon } from './FolderIcon';
import { HighlightedText } from './HighlightedText';
import styled from 'styled-components';

const VISIBLE_LIMIT = 200;

interface Props {
	results: readonly FlatEntry[];
	query: string;
}

export function SearchResults({ results, query }: Props) {
	if (results.length === 0) {
		return (
			<Empty>
				<EmptyGlyph>—</EmptyGlyph>
				<span>No results for &quot;{query}&quot;</span>
			</Empty>
		);
	}

	const truncated = results.length > VISIBLE_LIMIT;
	const visible = truncated ? results.slice(0, VISIBLE_LIMIT) : results;

	return (
		<Container>
			{truncated ? (
				<TruncationNote role="status">
					<NoteTag>note</NoteTag>
					<NoteSep>│</NoteSep>
					<span>
						Showing first <strong>{VISIBLE_LIMIT}</strong> of{' '}
						<strong>{results.length.toLocaleString('en-US')}</strong> matches — refine your query.
					</span>
				</TruncationNote>
			) : (
				<Count>
					<CountTag>matches</CountTag>
					<CountSep>│</CountSep>
					<CountVal>
						<strong>{results.length}</strong> {results.length === 1 ? 'result' : 'results'} for
						&quot;{query}&quot;
					</CountVal>
				</Count>
			)}
			<List>
				{visible.map((entry) => {
					const parentPath =
						entry.segments.length > 1 ? `/${entry.segments.slice(0, -1).join('/')}` : '/';
					return (
						<li key={entry.segments.join('/')}>
							<ResultLink to={`/tree/${encodePath([...entry.segments])}`}>
								<Glyph $type={entry.type}>
									{entry.type === 'file' ? '·' : <FolderIcon size={12} />}
								</Glyph>
								<NameAndPath>
									<Name>
										<HighlightedText text={entry.name} query={query} />
									</Name>
									<ParentPath>in {parentPath}</ParentPath>
								</NameAndPath>
								<ResultArrow>→</ResultArrow>
							</ResultLink>
						</li>
					);
				})}
			</List>
		</Container>
	);
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${(props) => props.theme.spacing.md};
`;

const Count = styled.p`
	margin: 0;
	display: inline-flex;
	gap: 0.8ch;
	align-items: center;
	color: ${(props) => props.theme.colors.muted};
	font-size: ${(props) => props.theme.fontSize.sm};
`;

const CountTag = styled.span`
	color: ${(props) => props.theme.colors.dim};
	letter-spacing: ${(props) => props.theme.tracking.wider};
	text-transform: uppercase;
	font-size: ${(props) => props.theme.fontSize.micro};
`;

const CountSep = styled.span`
	color: ${(props) => props.theme.colors.border};
`;

const CountVal = styled.span`
	color: ${(props) => props.theme.colors.muted};

	strong {
		color: ${(props) => props.theme.colors.text};
		font-weight: 600;
	}
`;

const TruncationNote = styled.p`
	margin: 0;
	display: flex;
	gap: 0.8ch;
	align-items: baseline;
	padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
	background: ${(props) => props.theme.colors.accentSoft};
	border-left: 2px solid ${(props) => props.theme.colors.accent};
	color: ${(props) => props.theme.colors.muted};
	font-size: ${(props) => props.theme.fontSize.sm};

	strong {
		color: ${(props) => props.theme.colors.text};
		font-weight: 600;
	}
`;

const NoteTag = styled.span`
	color: ${(props) => props.theme.colors.accent};
	letter-spacing: ${(props) => props.theme.tracking.wider};
	text-transform: uppercase;
	font-size: ${(props) => props.theme.fontSize.micro};
	font-weight: 500;
`;

const NoteSep = styled.span`
	color: ${(props) => props.theme.colors.border};
`;

const Empty = styled.p`
	display: inline-flex;
	gap: 0.6ch;
	align-items: center;
	color: ${(props) => props.theme.colors.dim};
	font-size: ${(props) => props.theme.fontSize.sm};
	margin: 0;
`;

const EmptyGlyph = styled.span`
	color: ${(props) => props.theme.colors.border};
`;

const List = styled.ul`
	list-style: none;
	margin: 0;
	padding: 0;
	display: flex;
	flex-direction: column;
`;

const ResultLink = styled(Link)`
	display: grid;
	grid-template-columns: 1.5ch 1fr auto;
	align-items: center;
	gap: 0.8ch;
	padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
	color: ${(props) => props.theme.colors.text};
	text-decoration: none;
	border-top: ${(props) => props.theme.rule.hairline};
	transition: background 0.12s ease;

	li:last-child & {
		border-bottom: ${(props) => props.theme.rule.hairline};
	}

	&:hover {
		background: ${(props) => props.theme.colors.surface};
		text-decoration: none;
		box-shadow: none;
	}
`;

const Glyph = styled.span<{ $type: 'file' | 'folder' }>`
	color: ${(props) =>
		props.$type === 'folder' ? props.theme.colors.muted : props.theme.colors.dim};
	font-weight: ${(props) => (props.$type === 'folder' ? 500 : 400)};
	width: 1.5ch;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	transition: color 0.12s ease;

	a:hover & {
		color: ${(props) =>
			props.$type === 'folder' ? props.theme.colors.accent : props.theme.colors.muted};
	}
`;

const NameAndPath = styled.div`
	display: flex;
	flex-direction: column;
	min-width: 0;
	gap: 0.1rem;
`;

const Name = styled.span`
	font-weight: 500;
	font-size: ${(props) => props.theme.fontSize.sm};
	color: ${(props) => props.theme.colors.text};
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const ParentPath = styled.span`
	color: ${(props) => props.theme.colors.dim};
	font-size: ${(props) => props.theme.fontSize.micro};
	font-family: ${(props) => props.theme.fonts.mono};
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const ResultArrow = styled.span`
	color: ${(props) => props.theme.colors.dim};
	font-size: ${(props) => props.theme.fontSize.sm};
	opacity: 0;
	transition:
		opacity 0.15s ease,
		transform 0.15s ease;

	${ResultLink}:hover & {
		opacity: 1;
		color: ${(props) => props.theme.colors.accent};
		transform: translateX(2px);
	}
`;
