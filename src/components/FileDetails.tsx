import styled from 'styled-components';
import { formatBytes } from '../lib/format';
import type { FileNode } from '../types/tree';

interface Props {
	node: FileNode;
	path: string[];
}

export function FileDetails({ node, path }: Props) {
	return (
		<Container>
			<Heading>{node.name}</Heading>
			<Field>
				<Label>Type</Label>
				<Value>File</Value>
			</Field>
			<Field>
				<Label>Size</Label>
				<Value>{formatBytes(node.size)}</Value>
			</Field>
			<Field>
				<Label>Path</Label>
				<Value>/{path.join('/')}</Value>
			</Field>
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
