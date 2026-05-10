import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { tags as t } from '@lezer/highlight';
import { theme } from './theme';

const c = theme.colors;

const chrome = EditorView.theme(
	{
		'&': {
			color: c.text,
			backgroundColor: c.surface,
		},
		'.cm-content': {
			caretColor: c.accent,
			padding: theme.spacing.sm,
		},
		'.cm-cursor, .cm-dropCursor': {
			borderLeftColor: c.accent,
		},
		'&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': {
			backgroundColor: c.accentSoft,
		},
		'.cm-gutters': {
			backgroundColor: c.surface,
			color: c.dim,
			border: 'none',
			borderRight: `1px solid ${c.border}`,
		},
		'.cm-activeLine, .cm-activeLineGutter': {
			backgroundColor: 'transparent',
		},
		'.cm-lineNumbers .cm-gutterElement': {
			padding: '0 0.8ch',
		},
		'.cm-placeholder': {
			color: c.dim,
		},
		'.cm-scroller': {
			lineHeight: '1.6',
		},
		'.cm-lintRange-error': {
			backgroundImage: 'none',
			textDecoration: `underline wavy ${c.error}`,
			textDecorationSkipInk: 'none',
		},
		'.cm-gutter-lint .cm-gutterElement': {
			padding: '0 0.4ch',
		},
		'.cm-gutter-lint .cm-lint-marker-error': {
			content: '""',
			width: '6px',
			height: '6px',
			borderRadius: '50%',
			backgroundColor: c.error,
		},
		'.cm-tooltip.cm-tooltip-lint': {
			backgroundColor: c.surface2,
			border: `1px solid ${c.errorBorder}`,
			color: c.text,
			fontFamily: theme.fonts.mono,
			fontSize: theme.fontSize.sm,
			padding: '6px 8px',
		},
	},
	{ dark: true },
);

const syntax = HighlightStyle.define([
	{ tag: t.propertyName, color: c.accent },
	{ tag: t.string, color: c.success },
	{ tag: t.number, color: c.muted },
	{ tag: t.bool, color: c.accent },
	{ tag: t.null, color: c.dim },
	{
		tag: [t.brace, t.bracket, t.squareBracket, t.punctuation, t.separator],
		color: c.muted,
	},
	{ tag: t.invalid, color: c.error },
]);

export const cmTheme = chrome;
export const cmHighlight = syntaxHighlighting(syntax);
