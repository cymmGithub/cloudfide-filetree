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
	const dirCount = node.children.filter((c) => c.type === 'folder').length;
	const fileCount = node.children.length - dirCount;

	return (
		<Container>
			<HeadBlock>
				<Eyebrow>
					<EyebrowGlyph>▾</EyebrowGlyph>
					<span>folder</span>
				</Eyebrow>
				<Heading>{node.name || '/'}</Heading>
			</HeadBlock>

			<Record>
				<Row>
					<Key>type</Key>
					<Sep>│</Sep>
					<Val>folder</Val>
				</Row>
				<Row>
					<Key>contents</Key>
					<Sep>│</Sep>
					<Val>
						<Strong>{node.children.length}</Strong>
						<Dim>
							· {dirCount} dir{dirCount === 1 ? '' : 's'}, {fileCount} file
							{fileCount === 1 ? '' : 's'}
						</Dim>
					</Val>
				</Row>
				<Row>
					<Key>bytes</Key>
					<Sep>│</Sep>
					<Val>
						<Strong>{formatBytes(totalSize)}</Strong>
						<Dim>· {totalSize.toLocaleString('en-US')} B total</Dim>
					</Val>
				</Row>
			</Record>

			<ContentsHead>
				<ContentsLabel>
					<ContentsNum>·</ContentsNum>
					<span>contents</span>
				</ContentsLabel>
				<ContentsCount>{node.children.length}</ContentsCount>
			</ContentsHead>

			{node.children.length === 0 ? (
				<Empty>
					<EmptyGlyph>—</EmptyGlyph>
					<span>this folder is empty</span>
				</Empty>
			) : (
				<List>
					{node.children.map((child) => (
						<li key={child.name}>
							<ChildLink to={`/tree/${encodePath([...path, child.name])}`}>
								<ChildGlyph $type={child.type}>{child.type === 'file' ? '·' : '▸'}</ChildGlyph>
								<ChildName>{child.name}</ChildName>
								{child.type === 'file' ? (
									<ChildSize>{formatBytes(child.size)}</ChildSize>
								) : (
									<ChildSize $dim>—</ChildSize>
								)}
								<ChildArrow>→</ChildArrow>
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
	gap: ${(props) => props.theme.spacing.lg};
	max-width: 720px;
`;

const HeadBlock = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${(props) => props.theme.spacing.xs};
	padding-bottom: ${(props) => props.theme.spacing.md};
	border-bottom: ${(props) => props.theme.rule.hairline};
`;

const Eyebrow = styled.div`
	display: inline-flex;
	gap: 0.6ch;
	align-items: center;
	font-size: ${(props) => props.theme.fontSize.micro};
	letter-spacing: ${(props) => props.theme.tracking.widest};
	text-transform: uppercase;
	color: ${(props) => props.theme.colors.muted};
`;

const EyebrowGlyph = styled.span`
	color: ${(props) => props.theme.colors.accent};
`;

const Heading = styled.h2`
	margin: 0;
	font-size: ${(props) => props.theme.fontSize.xl};
	font-weight: 500;
	letter-spacing: ${(props) => props.theme.tracking.tight};
	color: ${(props) => props.theme.colors.text};
	word-break: break-all;
`;

const Record = styled.div`
	display: grid;
	gap: ${(props) => props.theme.spacing.xs};
`;

const Row = styled.div`
	display: grid;
	grid-template-columns: 9ch auto 1fr;
	align-items: center;
	gap: 0.8ch;
	font-size: ${(props) => props.theme.fontSize.sm};
	padding: ${(props) => props.theme.spacing.xs} 0;
`;

const Key = styled.span`
	color: ${(props) => props.theme.colors.dim};
	letter-spacing: ${(props) => props.theme.tracking.wider};
	text-transform: uppercase;
	font-size: ${(props) => props.theme.fontSize.micro};
`;

const Sep = styled.span`
	color: ${(props) => props.theme.colors.border};
`;

const Val = styled.span`
	color: ${(props) => props.theme.colors.text};
	word-break: break-all;
`;

const Strong = styled.span`
	color: ${(props) => props.theme.colors.text};
	font-weight: 500;
`;

const Dim = styled.span`
	color: ${(props) => props.theme.colors.dim};
	margin-left: 0.6ch;
`;

const ContentsHead = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: ${(props) => props.theme.spacing.md};
	padding-bottom: ${(props) => props.theme.spacing.xs};
	border-bottom: ${(props) => props.theme.rule.hairline};
`;

const ContentsLabel = styled.div`
	display: inline-flex;
	gap: 0.6ch;
	align-items: center;
	font-size: ${(props) => props.theme.fontSize.micro};
	letter-spacing: ${(props) => props.theme.tracking.widest};
	text-transform: uppercase;
	color: ${(props) => props.theme.colors.muted};
`;

const ContentsNum = styled.span`
	color: ${(props) => props.theme.colors.accent};
`;

const ContentsCount = styled.span`
	font-size: ${(props) => props.theme.fontSize.micro};
	letter-spacing: ${(props) => props.theme.tracking.wider};
	text-transform: uppercase;
	color: ${(props) => props.theme.colors.dim};
`;

const Empty = styled.p`
	margin: 0;
	display: inline-flex;
	gap: 0.6ch;
	color: ${(props) => props.theme.colors.dim};
	font-size: ${(props) => props.theme.fontSize.sm};
`;

const EmptyGlyph = styled.span`
	color: ${(props) => props.theme.colors.border};
`;

const List = styled.ul`
	list-style: none;
	margin: 0;
	padding: 0;
`;

const ChildLink = styled(Link)`
	display: grid;
	grid-template-columns: 1.5ch 1fr auto auto;
	align-items: center;
	gap: 0.8ch;
	padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
	color: ${(props) => props.theme.colors.text};
	text-decoration: none;
	border-bottom: 1px solid transparent;
	border-top: 1px solid transparent;
	transition: background 0.12s ease;

	&:hover {
		background: ${(props) => props.theme.colors.surface};
		box-shadow: none;
	}
`;

const ChildGlyph = styled.span<{ $type: 'file' | 'folder' }>`
	color: ${(props) =>
		props.$type === 'folder' ? props.theme.colors.accent : props.theme.colors.dim};
	font-weight: ${(props) => (props.$type === 'folder' ? 500 : 400)};
	width: 1.5ch;
	text-align: center;
`;

const ChildName = styled.span`
	font-size: ${(props) => props.theme.fontSize.sm};
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const ChildSize = styled.span<{ $dim?: boolean }>`
	color: ${(props) => (props.$dim ? props.theme.colors.border : props.theme.colors.muted)};
	font-size: ${(props) => props.theme.fontSize.micro};
	font-family: ${(props) => props.theme.fonts.mono};
	letter-spacing: ${(props) => props.theme.tracking.wider};
	text-transform: uppercase;
	font-variant-numeric: tabular-nums;
	min-width: 8ch;
	text-align: right;
`;

const ChildArrow = styled.span`
	color: ${(props) => props.theme.colors.dim};
	font-size: ${(props) => props.theme.fontSize.sm};
	opacity: 0;
	transition:
		opacity 0.15s ease,
		transform 0.15s ease;

	${ChildLink}:hover & {
		opacity: 1;
		color: ${(props) => props.theme.colors.accent};
		transform: translateX(2px);
	}
`;
