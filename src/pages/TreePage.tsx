import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FileDetails } from '../components/FileDetails';
import { FolderDetails } from '../components/FolderDetails';
import { TreeView } from '../components/TreeView';
import { decodePath } from '../lib/path';
import { loadTree } from '../lib/storage';
import { findNode } from '../lib/traverse';

export function TreePage() {
	const tree = useMemo(() => loadTree(), []);
	const params = useParams();
	const splat = params['*'] ?? '';
	const currentPath = decodePath(splat);

	if (!tree) {
		return (
			<Empty>
				<p>Brak wgranego drzewa.</p>
				<Link to="/">Wgraj JSON</Link>
			</Empty>
		);
	}

	const selectedNode = findNode(tree, currentPath);

	return (
		<Layout>
			<Sidebar>
				<TreeView tree={tree} currentPath={currentPath} />
			</Sidebar>
			<Main>
				{selectedNode === null ? (
					<NotFound>Nie znaleziono węzła: /{currentPath.join('/')}</NotFound>
				) : selectedNode.type === 'file' ? (
					<FileDetails node={selectedNode} path={currentPath} />
				) : (
					<FolderDetails node={selectedNode} path={currentPath} />
				)}
			</Main>
		</Layout>
	);
}

const Layout = styled.div`
	display: grid;
	grid-template-columns: 320px 1fr;
	min-height: 100vh;
`;

const Sidebar = styled.aside`
	border-right: 1px solid ${(props) => props.theme.colors.border};
	overflow-y: auto;
	padding: ${(props) => props.theme.spacing.md};
	background: ${(props) => props.theme.colors.surface};
`;

const Main = styled.main`
	padding: ${(props) => props.theme.spacing.lg};
	overflow-y: auto;
`;

const Empty = styled.div`
	max-width: 480px;
	margin: ${(props) => props.theme.spacing.xxl} auto;
	text-align: center;
	color: ${(props) => props.theme.colors.muted};
`;

const NotFound = styled.p`
	color: ${(props) => props.theme.colors.error};
	font-family: ${(props) => props.theme.fonts.mono};
`;
