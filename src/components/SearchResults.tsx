import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { encodePath } from '../lib/path';
import type { FlatEntry } from '../lib/traverse';
import { HighlightedText } from './HighlightedText';

interface Props {
	results: readonly FlatEntry[];
	query: string;
}

export function SearchResults({ results, query }: Props) {
	if (results.length === 0) {
		return <Empty>Brak wyników dla &quot;{query}&quot;</Empty>;
	}

	return (
		<Container>
			<Count>
				{results.length} {results.length === 1 ? 'wynik' : 'wyników'} dla &quot;{query}&quot;
			</Count>
			<List>
				{results.map((entry) => {
					const parentPath =
						entry.segments.length > 1 ? `/${entry.segments.slice(0, -1).join('/')}` : '/';
					return (
						<li key={entry.segments.join('/')}>
							<ResultLink to={`/tree/${encodePath([...entry.segments])}`}>
								<Icon>{entry.type === 'file' ? '📄' : '📁'}</Icon>
								<NameAndPath>
									<Name>
										<HighlightedText text={entry.name} query={query} />
									</Name>
									<ParentPath>in {parentPath}</ParentPath>
								</NameAndPath>
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
	color: ${(props) => props.theme.colors.muted};
	font-size: ${(props) => props.theme.fontSize.sm};
`;

const Empty = styled.p`
	color: ${(props) => props.theme.colors.muted};
	font-style: italic;
`;

const List = styled.ul`
	list-style: none;
	margin: 0;
	padding: 0;
	display: flex;
	flex-direction: column;
	gap: ${(props) => props.theme.spacing.xs};
`;

const ResultLink = styled(Link)`
	display: flex;
	align-items: center;
	gap: ${(props) => props.theme.spacing.sm};
	padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
	border: 1px solid ${(props) => props.theme.colors.border};
	border-radius: ${(props) => props.theme.radius.md};
	color: ${(props) => props.theme.colors.text};
	text-decoration: none;
	background: ${(props) => props.theme.colors.bg};

	&:hover {
		background: ${(props) => props.theme.colors.surface};
		border-color: ${(props) => props.theme.colors.accent};
		text-decoration: none;
	}
`;

const Icon = styled.span`
	flex-shrink: 0;
	font-size: ${(props) => props.theme.fontSize.lg};
`;

const NameAndPath = styled.div`
	display: flex;
	flex-direction: column;
	min-width: 0;
	flex: 1;
`;

const Name = styled.span`
	font-weight: 500;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const ParentPath = styled.span`
	color: ${(props) => props.theme.colors.muted};
	font-size: ${(props) => props.theme.fontSize.sm};
	font-family: ${(props) => props.theme.fonts.mono};
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;
