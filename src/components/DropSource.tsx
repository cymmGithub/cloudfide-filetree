import { useCallback, useState } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';
import { formatBytes } from '../lib/format';
import { JsonFileIcon } from './JsonFileIcon';
import styled from 'styled-components';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export type LoadedFile = { name: string; size: number };

type Props = {
	loadedFile: LoadedFile | null;
	hasErrors?: boolean;
	onFileLoaded: (text: string, file: LoadedFile) => void;
};

function formatRejection(rejection: FileRejection): string {
	const error = rejection.errors[0];
	if (!error) return 'could not load file';
	switch (error.code) {
		case 'file-too-large':
			return `file too large — max ${formatBytes(MAX_FILE_SIZE)}, got ${formatBytes(rejection.file.size)}`;
		case 'file-invalid-type':
			return 'wrong type — must be a .json file';
		case 'too-many-files':
			return 'drop only one file';
		default:
			return error.message;
	}
}

export function DropSource({ loadedFile, hasErrors = false, onFileLoaded }: Props) {
	const [rejection, setRejection] = useState<string | null>(null);

	const handleDrop = useCallback(
		(files: File[]) => {
			const file = files[0];
			if (!file) return;
			setRejection(null);
			file
				.text()
				.then((text) => onFileLoaded(text, { name: file.name, size: file.size }))
				.catch(console.error);
		},
		[onFileLoaded],
	);

	const handleDropRejected = useCallback((rejections: FileRejection[]) => {
		const rejected = rejections[0];
		if (!rejected) return;
		setRejection(formatRejection(rejected));
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop: handleDrop,
		onDropRejected: handleDropRejected,
		accept: { 'application/json': ['.json'] },
		maxFiles: 1,
		maxSize: MAX_FILE_SIZE,
	});

	const isInvalid = rejection !== null || (loadedFile !== null && hasErrors);

	return (
		<Dropzone
			{...getRootProps()}
			$active={isDragActive}
			$loaded={loadedFile !== null}
			$invalid={isInvalid}
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
					<IconBox $active={isDragActive}>
						<JsonFileIcon size={52} />
					</IconBox>
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
			{rejection && <RejectionLine role="alert">{rejection}</RejectionLine>}
		</Dropzone>
	);
}

const Dropzone = styled.div<{ $active: boolean; $loaded: boolean; $invalid: boolean }>`
	position: relative;
	padding: ${(props) => props.theme.spacing.xxl} ${(props) => props.theme.spacing.xl};
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
	gap: ${(props) => props.theme.spacing.md};
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

const IconBox = styled.div<{ $active: boolean }>`
	display: flex;
	color: ${(props) =>
		props.$active ? props.theme.colors.accent : props.theme.colors.borderStrong};
	transition: color 0.2s ease;
`;

const LoadedMark = styled.span<{ $invalid: boolean }>`
	color: ${(props) => (props.$invalid ? props.theme.colors.error : props.theme.colors.success)};
	font-weight: 600;
	margin-right: 0.4ch;
`;

const DropMain = styled.div`
	color: ${(props) => props.theme.colors.text};
	font-size: ${(props) => props.theme.fontSize.lg};
`;

const DropMeta = styled.div`
	color: ${(props) => props.theme.colors.dim};
	font-size: ${(props) => props.theme.fontSize.xs};
	letter-spacing: ${(props) => props.theme.tracking.wider};
	text-transform: uppercase;
	display: inline-flex;
	gap: 0.6ch;
`;

const DropMetaSep = styled.span`
	color: ${(props) => props.theme.colors.border};
`;

const RejectionLine = styled.div`
	color: ${(props) => props.theme.colors.error};
	font-size: ${(props) => props.theme.fontSize.xs};
	letter-spacing: ${(props) => props.theme.tracking.wider};
	text-transform: uppercase;
`;
