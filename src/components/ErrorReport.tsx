import { type ParseError, printParseErrorCode } from 'jsonc-parser';
import styled from 'styled-components';

export type EnrichedError = ParseError & { line: number; col: number };

type Props = {
	errors: EnrichedError[];
	currentIdx: number;
	onNavigate: (idx: number) => void;
};

export function ErrorReport({ errors, currentIdx, onNavigate }: Props) {
	if (errors.length === 0) return null;
	const current = errors[currentIdx];

	return (
		<>
			<StatusLine>
				<StatusPrompt>›</StatusPrompt>
				<StatusValue>
					json invalid — {errors.length} {errors.length === 1 ? 'error' : 'errors'}
				</StatusValue>
			</StatusLine>
			<ReportBox role="alert">
				<ReportHead>
					<ReportTag>error</ReportTag>
					<NavGroup>
						<NavButton
							type="button"
							onClick={() => onNavigate(currentIdx - 1)}
							disabled={currentIdx <= 0}
							aria-label="Previous error"
						>
							‹
						</NavButton>
						<NavCounter>
							{currentIdx + 1}/{errors.length}
						</NavCounter>
						<NavButton
							type="button"
							onClick={() => onNavigate(currentIdx + 1)}
							disabled={currentIdx >= errors.length - 1}
							aria-label="Next error"
						>
							›
						</NavButton>
					</NavGroup>
					<ReportPath>
						line {current?.line} col {current?.col}
					</ReportPath>
				</ReportHead>
				<ReportBody>{current ? printParseErrorCode(current.error) : ''}</ReportBody>
			</ReportBox>
		</>
	);
}

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

const StatusValue = styled.span`
	color: ${(props) => props.theme.colors.error};
`;

const ReportBox = styled.div`
	border: 1px solid ${(props) => props.theme.colors.errorBorder};
	background: ${(props) => props.theme.colors.errorBg};
	font-family: ${(props) => props.theme.fonts.mono};
	font-size: ${(props) => props.theme.fontSize.sm};
`;

const ReportHead = styled.div`
	display: flex;
	align-items: center;
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
	margin-left: auto;
`;

const NavGroup = styled.span`
	display: inline-flex;
	align-items: center;
	gap: 0.4ch;
`;

const NavButton = styled.button`
	background: transparent;
	color: ${(props) => props.theme.colors.muted};
	border: 1px solid ${(props) => props.theme.colors.errorBorder};
	padding: 0 0.5ch;
	font-family: ${(props) => props.theme.fonts.mono};
	font-size: ${(props) => props.theme.fontSize.sm};
	line-height: 1.2;
	cursor: pointer;
	transition:
		color 0.12s ease,
		border-color 0.12s ease;

	&:hover:not(:disabled) {
		color: ${(props) => props.theme.colors.text};
		border-color: ${(props) => props.theme.colors.error};
	}

	&:disabled {
		color: ${(props) => props.theme.colors.dim};
		cursor: not-allowed;
		opacity: 0.5;
	}
`;

const NavCounter = styled.span`
	color: ${(props) => props.theme.colors.muted};
	min-width: 4ch;
	text-align: center;
`;

const ReportBody = styled.pre`
	margin: 0;
	padding: ${(props) => props.theme.spacing.md};
	color: ${(props) => props.theme.colors.text};
	white-space: pre-wrap;
	word-break: break-word;
`;
