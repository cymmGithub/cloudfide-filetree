import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { encodePath } from '../lib/path';
import type { TreeNode as TreeNodeType } from '../types/tree';

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
				<NodeLink to={`/tree/${encodePath(urlPath)}`} $current={isCurrent}>
					<Icon>📄</Icon>
					{node.name}
				</NodeLink>
			</Item>
		);
	}

	const isExpanded = expanded.has(pathKey);

	return (
		<Item>
			<FolderRow>
				<Toggle
					onClick={() => onToggle(pathKey)}
					aria-label={isExpanded ? 'Collapse' : 'Expand'}
					aria-expanded={isExpanded}
				>
					{isExpanded ? '▼' : '▶'}
				</Toggle>
				<NodeLink to={`/tree/${encodePath(urlPath)}`} $current={isCurrent}>
					<Icon>📁</Icon>
					{node.name}
				</NodeLink>
			</FolderRow>
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

const FolderRow = styled.div`
	display: flex;
	align-items: center;
	gap: ${(props) => props.theme.spacing.xs};
`;

const Toggle = styled.button`
	background: none;
	border: none;
	padding: ${(props) => props.theme.spacing.xs};
	color: ${(props) => props.theme.colors.muted};
	font-size: ${(props) => props.theme.fontSize.xs};
	width: 1.5rem;
	flex-shrink: 0;
`;

const NodeLink = styled(Link)<{ $current: boolean }>`
	display: flex;
	align-items: center;
	gap: ${(props) => props.theme.spacing.xs};
	padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
	border-radius: ${(props) => props.theme.radius.sm};
	color: ${(props) => props.theme.colors.text};
	text-decoration: none;
	flex: 1;
	min-width: 0;
	background: ${(props) => (props.$current ? props.theme.colors.surface : 'transparent')};
	font-weight: ${(props) => (props.$current ? '600' : 'normal')};

	&:hover {
		background: ${(props) => props.theme.colors.surface};
		text-decoration: none;
	}
`;

const Icon = styled.span`
	flex-shrink: 0;
`;

const ChildList = styled.ul`
	list-style: none;
	margin: 0;
	padding-left: ${(props) => props.theme.spacing.lg};
`;
