import { parseAsString, useQueryState } from 'nuqs';
import { useDeferredValue, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { CopyPathButton } from '../components/CopyPathButton';
import { FileDetails } from '../components/FileDetails';
import { FolderDetails } from '../components/FolderDetails';
import { SearchInput } from '../components/SearchInput';
import { SearchResults } from '../components/SearchResults';
import { TreeView } from '../components/TreeView';
import { decodePath } from '../lib/path';
import { loadTree } from '../lib/storage';
import { buildFlatIndex, findNode, searchIndex } from '../lib/traverse';

export function TreePage() {
	const tree = useMemo(() => loadTree(), []);
	const params = useParams();
	const [rawQuery] = useQueryState('q', parseAsString.withDefault(''));
	const splat = params['*'] ?? '';
	const currentPath = decodePath(splat);
	const query = rawQuery.trim();

	const deferredQuery = useDeferredValue(query);

	const flatIndex = useMemo(() => (tree ? buildFlatIndex(tree) : []), [tree]);
	const searchResults = useMemo(
		() => searchIndex(flatIndex, deferredQuery),
		[flatIndex, deferredQuery],
	);

	if (!tree) {
		return (
			<EmptyShell>
				<EmptyMark>~/filetree · empty session</EmptyMark>
				<EmptyTitle>no tree loaded.</EmptyTitle>
				<EmptyHint>
					<EmptyGlyph>›</EmptyGlyph> the inspector has nothing to read. start a session by uploading
					a json payload.
				</EmptyHint>
				<EmptyLink to="/">
					<span>upload json</span>
					<EmptyArrow>→</EmptyArrow>
				</EmptyLink>
			</EmptyShell>
		);
	}

	const selectedNode = findNode(tree, currentPath);
	const totalEntries = flatIndex.length;
	const dirCount = flatIndex.filter((e) => e.type === 'folder').length;
	const fileCount = totalEntries - dirCount;

	return (
		<Layout>
			<TopBar>
				<TopBarLeft to="/" aria-label="Back to home">
					<Brand>~/filetree</Brand>
					<TopSep>·</TopSep>
					<BrandDim>inspector</BrandDim>
				</TopBarLeft>
				<TopBarMid>
					<SearchInput />
				</TopBarMid>
				<TopBarRight>
					<TopMeta>
						<TopMetaKey>idx</TopMetaKey>
						<TopMetaSep>│</TopMetaSep>
						<TopMetaVal>{totalEntries.toLocaleString('en-US')}</TopMetaVal>
					</TopMeta>
					<TopCursor>▍</TopCursor>
				</TopBarRight>
			</TopBar>

			{query ? (
				<SearchBody>
					<SearchHeading>
						<SearchHeadLabel>
							<SearchHeadNum>02</SearchHeadNum>
							<span>/</span>
							<span>search</span>
						</SearchHeadLabel>
						<SearchHeadEcho>
							<EchoPrompt>›</EchoPrompt> grep <EchoQuote>&quot;{deferredQuery}&quot;</EchoQuote>
						</SearchHeadEcho>
					</SearchHeading>
					<SearchResults results={searchResults} query={deferredQuery} />
				</SearchBody>
			) : (
				<SplitBody>
					<Sidebar>
						<SidebarHead>
							<SidebarHeadLabel>
								<SidebarHeadNum>01</SidebarHeadNum>
								<span>/</span>
								<span>tree</span>
							</SidebarHeadLabel>
							<SidebarMeta>
								<SidebarMetaItem>
									<SidebarMetaKey>dirs</SidebarMetaKey>
									<SidebarMetaSep>│</SidebarMetaSep>
									<SidebarMetaVal>{dirCount}</SidebarMetaVal>
								</SidebarMetaItem>
								<SidebarMetaItem>
									<SidebarMetaKey>files</SidebarMetaKey>
									<SidebarMetaSep>│</SidebarMetaSep>
									<SidebarMetaVal>{fileCount}</SidebarMetaVal>
								</SidebarMetaItem>
							</SidebarMeta>
						</SidebarHead>
						<SidebarBody>
							<TreeView tree={tree} currentPath={currentPath} />
						</SidebarBody>
					</Sidebar>
					<Main>
						<PathBar>
							<PathBarLeft>
								<PathLabel>path</PathLabel>
								<PathBarSep>│</PathBarSep>
								{currentPath.length > 0 ? (
									<Breadcrumbs path={currentPath} />
								) : (
									<PathRoot>/</PathRoot>
								)}
							</PathBarLeft>
							{currentPath.length > 0 && <CopyPathButton path={currentPath} />}
						</PathBar>
						<MainBody>
							{selectedNode === null ? (
								<NotFound role="alert">
									<NotFoundTag>404</NotFoundTag>
									<NotFoundSep>│</NotFoundSep>
									<NotFoundMsg>node not found at /{currentPath.join('/')}</NotFoundMsg>
								</NotFound>
							) : selectedNode.type === 'file' ? (
								<FileDetails node={selectedNode} />
							) : (
								<FolderDetails node={selectedNode} path={currentPath} />
							)}
						</MainBody>
					</Main>
				</SplitBody>
			)}
		</Layout>
	);
}

const blink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

const Layout = styled.div`
	display: grid;
	grid-template-rows: auto 1fr auto;
	min-height: 100vh;
`;

const TopBar = styled.div`
	display: grid;
	grid-template-columns: auto 1fr auto;
	align-items: center;
	gap: ${(props) => props.theme.spacing.lg};
	padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.lg};
	border-bottom: ${(props) => props.theme.rule.hairline};
	background: ${(props) => props.theme.colors.bg};
	font-size: ${(props) => props.theme.fontSize.micro};
	letter-spacing: ${(props) => props.theme.tracking.wider};
	text-transform: uppercase;
`;

const TopBarLeft = styled(Link)`
	display: inline-flex;
	align-items: center;
	gap: 0.8ch;
	color: inherit;
	text-decoration: none;
	cursor: pointer;

	&:hover {
		text-decoration: none;
		box-shadow: none;
	}
`;

const TopBarMid = styled.div`
	min-width: 0;
`;

const TopBarRight = styled.div`
	display: inline-flex;
	align-items: center;
	gap: 0.8ch;
	color: ${(props) => props.theme.colors.muted};
`;

const Brand = styled.span`
	color: ${(props) => props.theme.colors.text};
	font-weight: 600;
	transition: color 0.12s ease;

	${TopBarLeft}:hover & {
		color: ${(props) => props.theme.colors.accent};
	}
`;

const BrandDim = styled.span`
	color: ${(props) => props.theme.colors.muted};
`;

const TopSep = styled.span`
	color: ${(props) => props.theme.colors.dim};
`;

const TopMeta = styled.span`
	display: inline-flex;
	gap: 0.6ch;
	align-items: center;
`;

const TopMetaKey = styled.span`
	color: ${(props) => props.theme.colors.dim};
`;

const TopMetaSep = styled.span`
	color: ${(props) => props.theme.colors.border};
`;

const TopMetaVal = styled.span`
	color: ${(props) => props.theme.colors.muted};
`;

const TopCursor = styled.span`
	color: ${(props) => props.theme.colors.accent};
	animation: ${blink} 1.06s step-end infinite;
`;

const SplitBody = styled.div`
	display: grid;
	grid-template-columns: 320px 1fr;
	min-height: 0;
	overflow: hidden;
`;

const SearchBody = styled.div`
	padding: ${(props) => props.theme.spacing.lg} ${(props) => props.theme.spacing.lg}
		${(props) => props.theme.spacing.xxl};
	overflow-y: auto;
	max-width: 880px;
	width: 100%;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	gap: ${(props) => props.theme.spacing.lg};
`;

const SearchHeading = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${(props) => props.theme.spacing.xs};
`;

const SearchHeadLabel = styled.div`
	display: flex;
	align-items: center;
	gap: 0.6ch;
	font-size: ${(props) => props.theme.fontSize.micro};
	letter-spacing: ${(props) => props.theme.tracking.widest};
	text-transform: uppercase;
	color: ${(props) => props.theme.colors.muted};
	padding-bottom: ${(props) => props.theme.spacing.xs};
	border-bottom: ${(props) => props.theme.rule.hairline};
`;

const SearchHeadNum = styled.span`
	color: ${(props) => props.theme.colors.accent};
	font-weight: 500;
`;

const SearchHeadEcho = styled.div`
	font-size: ${(props) => props.theme.fontSize.sm};
	color: ${(props) => props.theme.colors.muted};
`;

const EchoPrompt = styled.span`
	color: ${(props) => props.theme.colors.accent};
	margin-right: 0.6ch;
`;

const EchoQuote = styled.span`
	color: ${(props) => props.theme.colors.text};
`;

const Sidebar = styled.aside`
	border-right: ${(props) => props.theme.rule.hairline};
	background: ${(props) => props.theme.colors.surface};
	overflow: hidden;
	display: flex;
	flex-direction: column;
`;

const SidebarHead = styled.div`
	padding: ${(props) => props.theme.spacing.md} ${(props) => props.theme.spacing.md}
		${(props) => props.theme.spacing.sm};
	border-bottom: ${(props) => props.theme.rule.hairline};
	display: flex;
	flex-direction: column;
	gap: ${(props) => props.theme.spacing.sm};
`;

const SidebarHeadLabel = styled.div`
	display: flex;
	align-items: center;
	gap: 0.6ch;
	font-size: ${(props) => props.theme.fontSize.micro};
	letter-spacing: ${(props) => props.theme.tracking.widest};
	text-transform: uppercase;
	color: ${(props) => props.theme.colors.muted};
`;

const SidebarHeadNum = styled.span`
	color: ${(props) => props.theme.colors.accent};
	font-weight: 500;
`;

const SidebarMeta = styled.div`
	display: inline-flex;
	gap: ${(props) => props.theme.spacing.md};
	font-size: ${(props) => props.theme.fontSize.micro};
	letter-spacing: ${(props) => props.theme.tracking.wider};
	text-transform: uppercase;
`;

const SidebarMetaItem = styled.span`
	display: inline-flex;
	gap: 0.6ch;
	align-items: center;
`;

const SidebarMetaKey = styled.span`
	color: ${(props) => props.theme.colors.dim};
`;

const SidebarMetaSep = styled.span`
	color: ${(props) => props.theme.colors.border};
`;

const SidebarMetaVal = styled.span`
	color: ${(props) => props.theme.colors.text};
`;

const SidebarBody = styled.div`
	flex: 1;
	overflow-y: auto;
	padding: ${(props) => props.theme.spacing.sm};
`;

const Main = styled.main`
	overflow: hidden;
	display: flex;
	flex-direction: column;
`;

const PathBar = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${(props) => props.theme.spacing.md};
	padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.lg};
	border-bottom: ${(props) => props.theme.rule.hairline};
	background: ${(props) => props.theme.colors.bg};
	min-height: 44px;
`;

const PathBarLeft = styled.div`
	display: flex;
	align-items: center;
	gap: 0.8ch;
	min-width: 0;
	flex: 1;
`;

const PathLabel = styled.span`
	font-size: ${(props) => props.theme.fontSize.micro};
	letter-spacing: ${(props) => props.theme.tracking.wider};
	text-transform: uppercase;
	color: ${(props) => props.theme.colors.dim};
`;

const PathBarSep = styled.span`
	color: ${(props) => props.theme.colors.border};
`;

const PathRoot = styled.span`
	color: ${(props) => props.theme.colors.muted};
	font-family: ${(props) => props.theme.fonts.mono};
`;

const MainBody = styled.div`
	flex: 1;
	overflow-y: auto;
	padding: ${(props) => props.theme.spacing.lg};
`;

const NotFound = styled.div`
	display: inline-flex;
	align-items: center;
	gap: 0.8ch;
	padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
	border: 1px solid ${(props) => props.theme.colors.errorBorder};
	background: ${(props) => props.theme.colors.errorBg};
	font-family: ${(props) => props.theme.fonts.mono};
	font-size: ${(props) => props.theme.fontSize.sm};
`;

const NotFoundTag = styled.span`
	color: ${(props) => props.theme.colors.error};
	font-weight: 600;
	letter-spacing: ${(props) => props.theme.tracking.wider};
`;

const NotFoundSep = styled.span`
	color: ${(props) => props.theme.colors.errorBorder};
`;

const NotFoundMsg = styled.span`
	color: ${(props) => props.theme.colors.text};
`;

const EmptyShell = styled.div`
	max-width: 480px;
	margin: 8rem auto 0;
	padding: 0 ${(props) => props.theme.spacing.lg};
	text-align: left;
	display: flex;
	flex-direction: column;
	gap: ${(props) => props.theme.spacing.md};
	animation: rise-in 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) backwards;
`;

const EmptyMark = styled.div`
	font-size: ${(props) => props.theme.fontSize.micro};
	letter-spacing: ${(props) => props.theme.tracking.wider};
	text-transform: uppercase;
	color: ${(props) => props.theme.colors.dim};
	border-bottom: ${(props) => props.theme.rule.hairline};
	padding-bottom: ${(props) => props.theme.spacing.xs};
`;

const EmptyTitle = styled.h1`
	margin: 0;
	font-size: ${(props) => props.theme.fontSize.xxl};
	font-weight: 500;
	letter-spacing: ${(props) => props.theme.tracking.tight};

	&::first-letter {
		color: ${(props) => props.theme.colors.accent};
	}
`;

const EmptyHint = styled.p`
	margin: 0;
	color: ${(props) => props.theme.colors.muted};
	font-size: ${(props) => props.theme.fontSize.sm};
`;

const EmptyGlyph = styled.span`
	color: ${(props) => props.theme.colors.accent};
	margin-right: 0.6ch;
`;

const EmptyLink = styled(Link)`
	display: inline-flex;
	gap: 0.8ch;
	align-items: center;
	margin-top: ${(props) => props.theme.spacing.md};
	padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
	border: 1px solid ${(props) => props.theme.colors.accent};
	color: ${(props) => props.theme.colors.accent};
	font-size: ${(props) => props.theme.fontSize.sm};
	letter-spacing: ${(props) => props.theme.tracking.wider};
	text-transform: uppercase;
	width: fit-content;
	transition:
		background 0.15s ease,
		color 0.15s ease;

	&:hover {
		background: ${(props) => props.theme.colors.accent};
		color: ${(props) => props.theme.colors.accentInk};
		box-shadow: none;
	}
`;

const EmptyArrow = styled.span`
	transition: transform 0.15s ease;

	${EmptyLink}:hover & {
		transform: translateX(3px);
	}
`;
