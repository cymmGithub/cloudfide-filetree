import { useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { parseInput } from '../lib/parse';
import { saveTree } from '../lib/storage';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function HomePage() {
	const [inputValue, setInputValue] = useState('');
	const navigate = useNavigate();

	const parseResult = useMemo(() => {
		if (inputValue.trim().length === 0) return null;
		return parseInput(inputValue);
	}, [inputValue]);

	const handleDrop = useCallback((files: File[]) => {
		const file = files[0];
		if (!file) return;
		file.text().then(setInputValue).catch(console.error);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop: handleDrop,
		accept: { 'application/json': ['.json'] },
		maxFiles: 1,
		maxSize: MAX_FILE_SIZE,
	});

	const handleLoad = () => {
		if (!parseResult?.ok) return;
		saveTree(parseResult.tree);
		navigate('/tree');
	};

	const canLoad = parseResult?.ok === true;

	return (
		<Container>
			<Heading>FileTree Explorer</Heading>
			<Subheading>Wklej, wybierz lub przeciągnij JSON ze strukturą drzewa</Subheading>

			<Dropzone {...getRootProps()} $active={isDragActive}>
				<input {...getInputProps()} />
				{isDragActive ? 'Upuść plik tutaj' : 'Przeciągnij plik JSON tutaj lub kliknij aby wybrać'}
			</Dropzone>

			<Or>lub wklej JSON poniżej</Or>

			<Textarea
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				placeholder='{"name":"root","type":"folder","children":[...]}'
				rows={10}
			/>

			{parseResult && !parseResult.ok && <ErrorBox>{parseResult.error.message}</ErrorBox>}
			{parseResult?.ok && <SuccessBox>JSON poprawny — gotowy do wczytania</SuccessBox>}

			<LoadButton disabled={!canLoad} onClick={handleLoad}>
				Wczytaj drzewo
			</LoadButton>
		</Container>
	);
}

const Container = styled.div`
	max-width: 720px;
	margin: 0 auto;
	padding: ${(props) => props.theme.spacing.xl};
	display: flex;
	flex-direction: column;
	gap: ${(props) => props.theme.spacing.lg};
`;

const Heading = styled.h1`
	font-size: ${(props) => props.theme.fontSize.xxl};
	margin: 0;
`;

const Subheading = styled.p`
	color: ${(props) => props.theme.colors.muted};
	margin: 0;
`;

const Dropzone = styled.div<{ $active: boolean }>`
	border: 2px dashed
		${(props) => (props.$active ? props.theme.colors.accent : props.theme.colors.border)};
	border-radius: ${(props) => props.theme.radius.lg};
	padding: ${(props) => props.theme.spacing.xl};
	text-align: center;
	background: ${(props) => (props.$active ? props.theme.colors.surface : 'transparent')};
	color: ${(props) => props.theme.colors.muted};
	cursor: pointer;
	transition:
		border-color 0.15s ease,
		background 0.15s ease;

	&:hover {
		border-color: ${(props) => props.theme.colors.accent};
	}
`;

const Or = styled.div`
	text-align: center;
	color: ${(props) => props.theme.colors.muted};
	font-size: ${(props) => props.theme.fontSize.sm};
`;

const Textarea = styled.textarea`
	width: 100%;
	padding: ${(props) => props.theme.spacing.md};
	border: 1px solid ${(props) => props.theme.colors.border};
	border-radius: ${(props) => props.theme.radius.md};
	font-family: ${(props) => props.theme.fonts.mono};
	font-size: ${(props) => props.theme.fontSize.sm};
	resize: vertical;

	&:focus {
		outline: none;
		border-color: ${(props) => props.theme.colors.accent};
	}
`;

const ErrorBox = styled.pre`
	background: ${(props) => props.theme.colors.errorBg};
	border: 1px solid ${(props) => props.theme.colors.errorBorder};
	color: ${(props) => props.theme.colors.error};
	padding: ${(props) => props.theme.spacing.md};
	border-radius: ${(props) => props.theme.radius.md};
	font-family: ${(props) => props.theme.fonts.mono};
	font-size: ${(props) => props.theme.fontSize.sm};
	white-space: pre-wrap;
	margin: 0;
`;

const SuccessBox = styled.div`
	background: #f0fdf4;
	border: 1px solid #bbf7d0;
	color: ${(props) => props.theme.colors.success};
	padding: ${(props) => props.theme.spacing.md};
	border-radius: ${(props) => props.theme.radius.md};
`;

const LoadButton = styled.button`
	padding: ${(props) => props.theme.spacing.md} ${(props) => props.theme.spacing.lg};
	background: ${(props) => props.theme.colors.accent};
	color: white;
	border: none;
	border-radius: ${(props) => props.theme.radius.md};
	font-weight: 600;

	&:hover:not(:disabled) {
		background: ${(props) => props.theme.colors.accentHover};
	}

	&:disabled {
		background: ${(props) => props.theme.colors.muted};
		cursor: not-allowed;
		opacity: 0.6;
	}
`;
