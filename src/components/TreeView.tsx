import styled from 'styled-components';
import { useExpanded } from '../hooks/useExpanded';
import type { TreeNode as TreeNodeType } from '../types/tree';
import { TreeNode } from './TreeNode';

interface Props {
	tree: TreeNodeType;
	currentPath: string[];
}

export function TreeView({ tree, currentPath }: Props) {
	const { expanded, toggle } = useExpanded(currentPath);

	if (tree.type === 'file') {
		return (
			<RootList>
				<TreeNode
					node={tree}
					urlPath={[]}
					expanded={expanded}
					onToggle={toggle}
					currentPath={currentPath}
				/>
			</RootList>
		);
	}

	return (
		<RootList>
			{tree.children.map((child) => (
				<TreeNode
					key={child.name}
					node={child}
					urlPath={[child.name]}
					expanded={expanded}
					onToggle={toggle}
					currentPath={currentPath}
				/>
			))}
		</RootList>
	);
}

const RootList = styled.ul`
	list-style: none;
	margin: 0;
	padding: 0;
`;
