import type { TreeNode as TreeNodeType } from '../types/tree';
import { Link } from 'react-router-dom';
import { encodePath } from '../lib/path';
import { FolderIcon } from './FolderIcon';
import styled from 'styled-components';

interface Props {
	node: TreeNodeType;
	urlPath: string[];
	expanded: Set<string>;
	onToggle: (key: string) => void;
	currentPath: string[];
}

export function TreeNode({ node, urlPath, expanded, onToggle, currentPath }: Props) {
	const pathKey = urlPath.join('/');
	const isCurrent = pathKey === currentPath.join('/');

	if (node.type === 'file') {
		return (
			<Item>
				<Row>
					<LeadSpacer />
					<NodeLink to={`/tree/${encodePath(urlPath)}`} $current={isCurrent}>
						<Tick $current={isCurrent} />
						<FileGlyph $current={isCurrent}>·</FileGlyph>
						<Name $current={isCurrent}>{node.name}</Name>
					</NodeLink>
				</Row>
			</Item>
		);
	}

	const isExpanded = expanded.has(pathKey);

	return (
		<Item>
			<Row>
				<Toggle
					onClick={() => onToggle(pathKey)}
					aria-label={isExpanded ? 'Collapse' : 'Expand'}
					aria-expanded={isExpanded}
					$expanded={isExpanded}
				>
					{isExpanded ? '▾' : '▸'}
				</Toggle>
				<NodeLink to={`/tree/${encodePath(urlPath)}`} $current={isCurrent}>
					<Tick $current={isCurrent} />
					<FolderGlyph $current={isCurrent} $expanded={isExpanded}>
						<FolderIcon />
					</FolderGlyph>
					<FolderName $current={isCurrent} $expanded={isExpanded}>
						{node.name}
					</FolderName>
				</NodeLink>
			</Row>
			{isExpanded && node.children.length > 0 && (
				<ChildList>
					{node.children.map((child) => (
						<TreeNode
							key={child.name}
							node={child}
							urlPath={[...urlPath, child.name]}
							expanded={expanded}
							onToggle={onToggle}
							currentPath={currentPath}
						/>
					))}
				</ChildList>
			)}
		</Item>
	);
}

const Item = styled.li`
	list-style: none;
	margin: 0;
`;

const Row = styled.div`
	display: flex;
	align-items: stretch;
	min-height: 1.6rem;
`;

const LeadSpacer = styled.span`
	width: 1.6rem;
	flex-shrink: 0;
`;

const Toggle = styled.button<{ $expanded: boolean }>`
	background: none;
	border: none;
	padding: 0;
	width: 1.6rem;
	height: 1.6rem;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	color: ${(props) => (props.$expanded ? props.theme.colors.accent : props.theme.colors.muted)};
	font-size: ${(props) => props.theme.fontSize.xs};
	flex-shrink: 0;
	transition: color 0.12s ease;

	&:hover {
		color: ${(props) => props.theme.colors.accent};
	}
`;

const NodeLink = styled(Link)<{ $current: boolean }>`
	display: flex;
	align-items: center;
	gap: 0;
	padding: 0;
	color: ${(props) => (props.$current ? props.theme.colors.text : props.theme.colors.muted)};
	text-decoration: none;
	flex: 1;
	min-width: 0;
	font-size: ${(props) => props.theme.fontSize.sm};
	transition: color 0.12s ease;

	&:hover {
		color: ${(props) => props.theme.colors.text};
		text-decoration: none;
		box-shadow: none;
	}
`;

const Tick = styled.span<{ $current: boolean }>`
	display: block;
	width: 2px;
	flex-shrink: 0;
	background: ${(props) => (props.$current ? props.theme.colors.accent : 'transparent')};
	margin-right: 0.6ch;
	align-self: stretch;
	transition: background 0.12s ease;
`;

const FileGlyph = styled.span<{ $current: boolean }>`
	color: ${(props) => (props.$current ? props.theme.colors.accent : props.theme.colors.dim)};
	width: 1ch;
	margin-right: 0.6ch;
	flex-shrink: 0;
`;

const Name = styled.span<{ $current: boolean }>`
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-weight: ${(props) => (props.$current ? 500 : 400)};
`;

const FolderGlyph = styled.span<{ $current: boolean; $expanded: boolean }>`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 1.4ch;
	margin-right: 0.7ch;
	flex-shrink: 0;
	color: ${(props) =>
		props.$current
			? props.theme.colors.accent
			: props.$expanded
				? props.theme.colors.muted
				: props.theme.colors.dim};
	transition: color 0.12s ease;

	a:hover & {
		color: ${(props) => (props.$current ? props.theme.colors.accent : props.theme.colors.muted)};
	}
`;

const FolderName = styled.span<{ $current: boolean; $expanded: boolean }>`
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-weight: ${(props) => (props.$current ? 600 : 500)};
	color: ${(props) =>
		props.$current
			? props.theme.colors.text
			: props.$expanded
				? props.theme.colors.text
				: props.theme.colors.muted};
`;

const ChildList = styled.ul`
	list-style: none;
	margin: 0 0 0 0.7rem;
	padding-left: 1rem;
	border-left: 1px solid ${(props) => props.theme.colors.border};
`;
