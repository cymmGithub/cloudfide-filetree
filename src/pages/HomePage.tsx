import { useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { formatBytes } from '../lib/format';
import { parseInput } from '../lib/parse';
import { saveTree } from '../lib/storage';
import styled from 'styled-components';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

type LoadedFile = { name: string; size: number };

export function HomePage() {
	const [inputValue, setInputValue] = useState('');
	const [loadedFile, setLoadedFile] = useState<LoadedFile | null>(null);
	const navigate = useNavigate();

	const parseResult = useMemo(() => {
		if (inputValue.trim().length === 0) return null;
		return parseInput(inputValue);
	}, [inputValue]);

	const handleDrop = useCallback((files: File[]) => {
		const file = files[0];
		if (!file) return;
		file
			.text()
			.then((text) => {
				setInputValue(text);
				setLoadedFile({ name: file.name, size: file.size });
			})
			.catch(console.error);
	}, []);

	const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInputValue(e.target.value);
		if (loadedFile) setLoadedFile(null);
	};

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
		<Page>
			<Stage>
				<Title>
					<TitleLine>filetree</TitleLine>
					<TitleLine $thin>inspector</TitleLine>
					<TitleRule />
				</Title>

				<Sources>
					<Section>
						<SectionLabel>
							<SectionNum>01</SectionNum>
							<span>/</span>
							<span>source</span>
						</SectionLabel>

						<Dropzone {...getRootProps()} $active={isDragActive} $loaded={loadedFile !== null}>
							<input {...getInputProps()} />
							{loadedFile ? (
								<>
									<DropMain>
										<LoadedCheck>✓</LoadedCheck> {loadedFile.name}
									</DropMain>
									<DropMeta>
										<span>{formatBytes(loadedFile.size)}</span>
										<DropMetaSep>·</DropMetaSep>
										<span>loaded</span>
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

						{parseResult && !parseResult.ok && (
							<>
								<StatusLine>
									<StatusPrompt>›</StatusPrompt>
									<StatusValue $tone="err">json invalid — see report below</StatusValue>
								</StatusLine>
								<ReportBox role="alert">
									<ReportHead>
										<ReportTag>error</ReportTag>
										<ReportPath>parse.report</ReportPath>
									</ReportHead>
									<ReportBody>{parseResult.error.message}</ReportBody>
								</ReportBox>
							</>
						)}
					</Section>

					<Section>
						<SectionLabel>
							<SectionNum>02</SectionNum>
							<span>/</span>
							<span>or paste below</span>
						</SectionLabel>

						<TextareaWrap>
							<TextareaPrompt>›</TextareaPrompt>
							<Textarea
								value={inputValue}
								onChange={handleTextareaChange}
								placeholder={`{
  "name": "root",
  "type": "folder",
  "children": [
    {
      "name": "src",
      "type": "folder",
      "children": [
        { "name": "index.ts", "type": "file", "size": 1024 },
        {
          "name": "components",
          "type": "folder",
          "children": [
            { "name": "Button.tsx", "type": "file", "size": 512 }
          ]
        }
      ]
    },
    { "name": "package.json", "type": "file", "size": 300 }
  ]
}`}
								rows={22}
								spellCheck={false}
							/>
						</TextareaWrap>

						<LoadRow>
							<LoadButton type="button" onClick={handleLoad} disabled={!canLoad} $ready={canLoad}>
								<LoadButtonInner>
									<span>load tree</span>
									<LoadArrow>→</LoadArrow>
								</LoadButtonInner>
							</LoadButton>
						</LoadRow>
					</Section>
				</Sources>
			</Stage>
		</Page>
	);
}

const Page = styled.div`
	max-width: 1080px;
	margin: 0 auto;
	padding: ${(props) => props.theme.spacing.xl} ${(props) => props.theme.spacing.lg}
		${(props) => props.theme.spacing.xxxl};
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	gap: ${(props) => props.theme.spacing.xl};
`;

const Stage = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${(props) => props.theme.spacing.xxl};
`;

const Sources = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: ${(props) => props.theme.spacing.xl};
	align-items: start;

	@media (max-width: 768px) {
		grid-template-columns: 1fr;
	}
`;

const Title = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 0;
`;

const TitleLine = styled.h1<{ $thin?: boolean }>`
	margin: 0;
	font-size: ${(props) => props.theme.fontSize.display};
	font-weight: ${(props) => (props.$thin ? 300 : 600)};
	letter-spacing: ${(props) => props.theme.tracking.tight};
	line-height: 1;
	color: ${(props) => (props.$thin ? props.theme.colors.muted : props.theme.colors.text)};

	&::first-letter {
		color: ${(props) => props.theme.colors.accent};
	}
`;

const TitleRule = styled.span`
	display: block;
	height: 1px;
	background: ${(props) => props.theme.colors.accent};
	margin-top: ${(props) => props.theme.spacing.md};
	width: 64px;
`;

const Section = styled.section`
	display: flex;
	flex-direction: column;
	gap: ${(props) => props.theme.spacing.md};
`;

const SectionLabel = styled.div`
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

const SectionNum = styled.span`
	color: ${(props) => props.theme.colors.accent};
	font-weight: 500;
`;

const Dropzone = styled.div<{ $active: boolean; $loaded: boolean }>`
	position: relative;
	padding: ${(props) => props.theme.spacing.xl};
	background: ${(props) => {
		if (props.$loaded) return props.theme.colors.successBg;
		if (props.$active) return props.theme.colors.accentSoft;
		return props.theme.colors.surface;
	}};
	border: 1px ${(props) => (props.$loaded ? 'solid' : 'dashed')}
		${(props) => {
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
		border-color: ${(props) =>
			props.$loaded ? props.theme.colors.success : props.theme.colors.accent};
	}

	&:hover::before,
	&:hover::after {
		border-color: ${(props) =>
			props.$loaded ? props.theme.colors.success : props.theme.colors.accent};
	}
`;

const LoadedCheck = styled.span`
	color: ${(props) => props.theme.colors.success};
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

const TextareaWrap = styled.div`
	position: relative;
	display: grid;
	grid-template-columns: auto 1fr;
	background: ${(props) => props.theme.colors.surface};
	border: ${(props) => props.theme.rule.hairline};
	transition: border-color 0.15s ease;

	&:focus-within {
		border-color: ${(props) => props.theme.colors.accent};
	}
`;

const TextareaPrompt = styled.span`
	padding: ${(props) => props.theme.spacing.md} 0 0 ${(props) => props.theme.spacing.md};
	color: ${(props) => props.theme.colors.accent};
	font-weight: 500;
	user-select: none;
`;

const Textarea = styled.textarea`
	width: 100%;
	padding: ${(props) => props.theme.spacing.md};
	padding-left: ${(props) => props.theme.spacing.sm};
	border: none;
	background: transparent;
	color: ${(props) => props.theme.colors.text};
	font-family: ${(props) => props.theme.fonts.mono};
	font-size: ${(props) => props.theme.fontSize.sm};
	resize: vertical;
	line-height: 1.6;

	&::placeholder {
		color: ${(props) => props.theme.colors.dim};
	}

	&:focus {
		outline: none;
	}
`;

type Tone = 'ok' | 'err';

const StatusLine = styled.div`
	display: flex;
	align-items: center;
	gap: 0.8ch;
	padding: ${(props) => props.theme.spacing.sm} 0;
	font-size: ${(props) => props.theme.fontSize.sm};
`;

const StatusPrompt = styled.span`
	color: ${(props) => props.theme.colors.accent};
`;

const StatusValue = styled.span<{ $tone: Tone }>`
	color: ${(props) =>
		props.$tone === 'ok' ? props.theme.colors.success : props.theme.colors.error};
`;

const ReportBox = styled.div`
	border: 1px solid ${(props) => props.theme.colors.errorBorder};
	background: ${(props) => props.theme.colors.errorBg};
	font-family: ${(props) => props.theme.fonts.mono};
	font-size: ${(props) => props.theme.fontSize.sm};
`;

const ReportHead = styled.div`
	display: flex;
	gap: 0.8ch;
	padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.md};
	border-bottom: 1px solid ${(props) => props.theme.colors.errorBorder};
	font-size: ${(props) => props.theme.fontSize.micro};
	letter-spacing: ${(props) => props.theme.tracking.wider};
	text-transform: uppercase;
`;

const ReportTag = styled.span`
	color: ${(props) => props.theme.colors.error};
	font-weight: 600;
`;

const ReportPath = styled.span`
	color: ${(props) => props.theme.colors.muted};
`;

const ReportBody = styled.pre`
	margin: 0;
	padding: ${(props) => props.theme.spacing.md};
	color: ${(props) => props.theme.colors.text};
	white-space: pre-wrap;
	word-break: break-word;
`;

const LoadRow = styled.div`
	display: flex;
	align-items: center;
	gap: ${(props) => props.theme.spacing.md};
	margin-top: ${(props) => props.theme.spacing.sm};
`;

const LoadButton = styled.button<{ $ready: boolean }>`
	position: relative;
	padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.lg};
	background: ${(props) => (props.$ready ? props.theme.colors.accent : 'transparent')};
	color: ${(props) => (props.$ready ? props.theme.colors.accentInk : props.theme.colors.dim)};
	border: 1px solid
		${(props) => (props.$ready ? props.theme.colors.accent : props.theme.colors.border)};
	border-radius: 0;
	font-family: ${(props) => props.theme.fonts.mono};
	font-size: ${(props) => props.theme.fontSize.sm};
	font-weight: 600;
	letter-spacing: ${(props) => props.theme.tracking.wider};
	text-transform: uppercase;
	cursor: ${(props) => (props.$ready ? 'pointer' : 'not-allowed')};
	transition:
		background 0.15s ease,
		color 0.15s ease,
		transform 0.15s ease;

	&:hover:not(:disabled) {
		background: ${(props) => props.theme.colors.text};
		color: ${(props) => props.theme.colors.bg};
		border-color: ${(props) => props.theme.colors.text};
	}

	&:active:not(:disabled) {
		transform: translateY(1px);
	}
`;

const LoadButtonInner = styled.span`
	display: inline-flex;
	align-items: center;
	gap: 0.8ch;
`;

const LoadArrow = styled.span`
	display: inline-block;
	transition: transform 0.15s ease;

	${LoadButton}:hover:not(:disabled) & {
		transform: translateX(3px);
	}
`;
