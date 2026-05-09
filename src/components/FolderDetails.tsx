import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { formatBytes } from '../lib/format';
import { encodePath } from '../lib/path';
import { calculateSize } from '../lib/traverse';
import type { FolderNode } from '../types/tree';

interface Props {
	node: FolderNode;
	path: string[];
}

export function FolderDetails({ node, path }: Props) {
	const totalSize = calculateSize(node);
	const displayPath = path.length === 0 ? '/' : `/${path.join('/')}`;

	return (
		<Container>
			<Heading>{node.name}</Heading>
			<Field>
				<Label>Type</Label>
				<Value>Folder</Value>
			</Field>
			<Field>
				<Label>Children</Label>
				<Value>{node.children.length}</Value>
			</Field>
			<Field>
				<Label>Total size</Label>
				<Value>{formatBytes(totalSize)}</Value>
			</Field>
			<Field>
				<Label>Path</Label>
				<Value>{displayPath}</Value>
			</Field>

			<SubHeading>Contents</SubHeading>
			{node.children.length === 0 ? (
				<Empty>(empty folder)</Empty>
			) : (
				<List>
					{node.children.map((child) => (
						<li key={child.name}>
							<ChildLink to={`/tree/${encodePath([...path, child.name])}`}>
								<Icon>{child.type === 'file' ? '📄' : '📁'}</Icon>
								<ChildName>{child.name}</ChildName>
								{child.type === 'file' && <ChildSize>{formatBytes(child.size)}</ChildSize>}
							</ChildLink>
						</li>
					))}
				</List>
			)}
		</Container>
	);
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${(props) => props.theme.spacing.sm};
`;

const Heading = styled.h2`
	margin: 0 0 ${(props) => props.theme.spacing.md} 0;
	font-size: ${(props) => props.theme.fontSize.xl};
`;

const Field = styled.div`
	display: flex;
	gap: ${(props) => props.theme.spacing.md};
	font-size: ${(props) => props.theme.fontSize.sm};
`;

const Label = styled.span`
	color: ${(props) => props.theme.colors.muted};
	min-width: 100px;
	font-weight: 500;
`;

const Value = styled.span`
	font-family: ${(props) => props.theme.fonts.mono};
	color: ${(props) => props.theme.colors.text};
	word-break: break-all;
`;

const SubHeading = styled.h3`
	margin: ${(props) => props.theme.spacing.lg} 0 ${(props) => props.theme.spacing.sm} 0;
	font-size: ${(props) => props.theme.fontSize.md};
	color: ${(props) => props.theme.colors.muted};
	font-weight: 500;
	text-transform: uppercase;
	letter-spacing: 0.05em;
`;

const List = styled.ul`
	list-style: none;
	margin: 0;
	padding: 0;
`;

const ChildLink = styled(Link)`
	display: flex;
	align-items: center;
	gap: ${(props) => props.theme.spacing.sm};
	padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
	border-radius: ${(props) => props.theme.radius.sm};
	color: ${(props) => props.theme.colors.text};
	text-decoration: none;

	&:hover {
		background: ${(props) => props.theme.colors.surface};
		text-decoration: none;
	}
`;

const Icon = styled.span`
	flex-shrink: 0;
`;

const ChildName = styled.span`
	flex: 1;
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const ChildSize = styled.span`
	color: ${(props) => props.theme.colors.muted};
	font-size: ${(props) => props.theme.fontSize.sm};
	font-family: ${(props) => props.theme.fonts.mono};
	flex-shrink: 0;
`;

const Empty = styled.p`
	color: ${(props) => props.theme.colors.muted};
	font-style: italic;
	margin: 0;
`;
