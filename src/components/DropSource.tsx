import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { formatBytes } from '../lib/format';
import styled from 'styled-components';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export type LoadedFile = { name: string; size: number };

type Props = {
	loadedFile: LoadedFile | null;
	hasErrors?: boolean;
	onFileLoaded: (text: string, file: LoadedFile) => void;
};

export function DropSource({ loadedFile, hasErrors = false, onFileLoaded }: Props) {
	const handleDrop = useCallback(
		(files: File[]) => {
			const file = files[0];
			if (!file) return;
			file
				.text()
				.then((text) => onFileLoaded(text, { name: file.name, size: file.size }))
				.catch(console.error);
		},
		[onFileLoaded],
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop: handleDrop,
		accept: { 'application/json': ['.json'] },
		maxFiles: 1,
		maxSize: MAX_FILE_SIZE,
	});

	return (
		<Dropzone
			{...getRootProps()}
			$active={isDragActive}
			$loaded={loadedFile !== null}
			$invalid={loadedFile !== null && hasErrors}
		>
			<input {...getInputProps()} />
			{loadedFile ? (
				<>
					<DropMain>
						<LoadedMark $invalid={hasErrors}>{hasErrors ? '✗' : '✓'}</LoadedMark> {loadedFile.name}
					</DropMain>
					<DropMeta>
						<span>{formatBytes(loadedFile.size)}</span>
						<DropMetaSep>·</DropMetaSep>
						<span>{hasErrors ? 'invalid' : 'loaded'}</span>
						<DropMetaSep>·</DropMetaSep>
						<span>click to replace</span>
					</DropMeta>
				</>
			) : (
				<>
					<DropMain>
						{isDragActive ? 'release to read' : 'drop a json file here, or click to choose'}
					</DropMain>
					<DropMeta>
						<span>application/json</span>
						<DropMetaSep>·</DropMetaSep>
						<span>≤ 5 MB</span>
						<DropMetaSep>·</DropMetaSep>
						<span>single file</span>
					</DropMeta>
				</>
			)}
		</Dropzone>
	);
}

const Dropzone = styled.div<{ $active: boolean; $loaded: boolean; $invalid: boolean }>`
	position: relative;
	padding: ${(props) => props.theme.spacing.xl};
	background: ${(props) => {
		if (props.$invalid) return props.theme.colors.errorBg;
		if (props.$loaded) return props.theme.colors.successBg;
		if (props.$active) return props.theme.colors.accentSoft;
		return props.theme.colors.surface;
	}};
	border: 1px ${(props) => (props.$loaded ? 'solid' : 'dashed')}
		${(props) => {
			if (props.$invalid) return props.theme.colors.error;
			if (props.$loaded) return props.theme.colors.success;
			if (props.$active) return props.theme.colors.accent;
			return props.theme.colors.borderStrong;
		}};
	cursor: pointer;
	transition:
		border-color 0.2s ease,
		background 0.2s ease,
		transform 0.2s ease;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: ${(props) => props.theme.spacing.sm};
	text-align: center;

	&::before,
	&::after {
		content: '';
		position: absolute;
		width: 12px;
		height: 12px;
		border-color: ${(props) => {
			if (props.$invalid) return props.theme.colors.error;
			if (props.$loaded) return props.theme.colors.success;
			if (props.$active) return props.theme.colors.accent;
			return props.theme.colors.borderStrong;
		}};
		border-style: solid;
		transition: border-color 0.2s ease;
	}

	&::before {
		top: -1px;
		left: -1px;
		border-width: 1px 0 0 1px;
	}

	&::after {
		bottom: -1px;
		right: -1px;
		border-width: 0 1px 1px 0;
	}

	&:hover {
		border-color: ${(props) => {
			if (props.$invalid) return props.theme.colors.error;
			if (props.$loaded) return props.theme.colors.success;
			return props.theme.colors.accent;
		}};
	}

	&:hover::before,
	&:hover::after {
		border-color: ${(props) => {
			if (props.$invalid) return props.theme.colors.error;
			if (props.$loaded) return props.theme.colors.success;
			return props.theme.colors.accent;
		}};
	}
`;

const LoadedMark = styled.span<{ $invalid: boolean }>`
	color: ${(props) => (props.$invalid ? props.theme.colors.error : props.theme.colors.success)};
	font-weight: 600;
	margin-right: 0.4ch;
`;

const DropMain = styled.div`
	color: ${(props) => props.theme.colors.text};
	font-size: ${(props) => props.theme.fontSize.md};
`;

const DropMeta = styled.div`
	color: ${(props) => props.theme.colors.dim};
	font-size: ${(props) => props.theme.fontSize.micro};
	letter-spacing: ${(props) => props.theme.tracking.wider};
	text-transform: uppercase;
	display: inline-flex;
	gap: 0.6ch;
`;

const DropMetaSep = styled.span`
	color: ${(props) => props.theme.colors.border};
`;
