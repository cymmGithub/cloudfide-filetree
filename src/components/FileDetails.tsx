import styled from 'styled-components';
import { formatBytes } from '../lib/format';
import type { FileNode } from '../types/tree';

interface Props {
	node: FileNode;
}

export function FileDetails({ node }: Props) {
	const ext = node.name.includes('.') ? node.name.split('.').pop() : null;

	return (
		<Container>
			<HeadBlock>
				<Eyebrow>
					<EyebrowGlyph>·</EyebrowGlyph>
					<span>file</span>
				</Eyebrow>
				<Heading>{node.name}</Heading>
			</HeadBlock>

			<Record>
				<Row>
					<Key>type</Key>
					<Sep>│</Sep>
					<Val>file</Val>
				</Row>
				{ext && (
					<Row>
						<Key>ext</Key>
						<Sep>│</Sep>
						<Val>.{ext}</Val>
					</Row>
				)}
				<Row>
					<Key>bytes</Key>
					<Sep>│</Sep>
					<Val>
						<Strong>{formatBytes(node.size)}</Strong>
						<Dim>· {node.size.toLocaleString('en-US')} B</Dim>
					</Val>
				</Row>
			</Record>
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
	grid-template-columns: 7ch auto 1fr;
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
