import { json } from '@codemirror/lang-json';
import { type Diagnostic, linter, lintGutter } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import CodeMirror from '@uiw/react-codemirror';
import { type ParseError, parse, printParseErrorCode } from 'jsonc-parser';
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { cmHighlight, cmTheme } from '../styles/cmTheme';
import { type EnrichedError } from './ErrorReport';
import styled from 'styled-components';

export type JsonEditorHandle = {
	goToRange: (from: number, to: number) => void;
};

type Props = {
	value: string;
	onChange: (value: string) => void;
	onErrorsChange: (errors: EnrichedError[]) => void;
	height?: string;
	placeholder?: string;
};

export const JsonEditor = forwardRef<JsonEditorHandle, Props>(function JsonEditor(
	{ value, onChange, onErrorsChange, height = '458px', placeholder },
	ref,
) {
	const viewRef = useRef<EditorView | null>(null);

	useImperativeHandle(ref, () => ({
		goToRange: (from, to) => {
			const view = viewRef.current;
			if (!view) return;
			const docLen = view.state.doc.length;
			view.dispatch({
				selection: { anchor: Math.min(from, docLen), head: Math.min(to, docLen) },
				scrollIntoView: true,
			});
			view.focus();
		},
	}));

	const extensions = useMemo(() => {
		const jsonLinter = linter(
			(view): Diagnostic[] => {
				const text = view.state.doc.toString();
				if (text.trim().length === 0) {
					onErrorsChange([]);
					return [];
				}
				const found: ParseError[] = [];
				parse(text, found, { allowTrailingComma: false });
				const docLen = view.state.doc.length;
				const enriched: EnrichedError[] = found.map((err) => {
					const offset = Math.min(err.offset, docLen);
					const line = view.state.doc.lineAt(offset);
					return {
						...err,
						line: line.number,
						col: offset - line.from + 1,
					};
				});
				onErrorsChange(enriched);
				return enriched.map((err) => ({
					from: Math.min(err.offset, docLen),
					to: Math.min(err.offset + err.length, docLen),
					severity: 'error',
					message: printParseErrorCode(err.error),
				}));
			},
			{ delay: 300 },
		);
		return [json(), cmHighlight, jsonLinter, lintGutter()];
	}, [onErrorsChange]);

	return (
		<EditorWrap>
			<CodeMirror
				value={value}
				onChange={onChange}
				height={height}
				theme={cmTheme}
				extensions={extensions}
				placeholder={placeholder}
				onCreateEditor={(view) => {
					viewRef.current = view;
				}}
				basicSetup={{
					lineNumbers: true,
					foldGutter: false,
					highlightActiveLine: false,
					highlightActiveLineGutter: false,
				}}
			/>
		</EditorWrap>
	);
});

const EditorWrap = styled.div`
	position: relative;
	border: ${(props) => props.theme.rule.hairline};
	transition: border-color 0.15s ease;
	overflow: hidden;

	&:focus-within {
		border-color: ${(props) => props.theme.colors.accent};
	}

	.cm-editor {
		font-family: ${(props) => props.theme.fonts.mono};
		font-size: ${(props) => props.theme.fontSize.sm};
	}

	.cm-editor.cm-focused {
		outline: none;
	}
`;
