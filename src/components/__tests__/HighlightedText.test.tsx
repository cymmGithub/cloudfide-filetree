import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../test/render-utils';
import { HighlightedText } from '../HighlightedText';

describe('HighlightedText', () => {
	it('renders plain text when query is empty', () => {
		const { container } = renderWithProviders(<HighlightedText text="Button.tsx" query="" />);
		expect(container.querySelector('mark')).toBeNull();
		expect(container.textContent).toBe('Button.tsx');
	});

	it('wraps the matching fragment in a mark element (case-insensitive)', () => {
		const { container } = renderWithProviders(<HighlightedText text="Button.tsx" query="BUT" />);
		const mark = container.querySelector('mark');
		expect(mark?.textContent).toBe('But');
		expect(container.textContent).toBe('Button.tsx');
	});

	it('wraps every occurrence when the query matches multiple times', () => {
		const { container } = renderWithProviders(<HighlightedText text="abcabc" query="abc" />);
		expect(container.querySelectorAll('mark')).toHaveLength(2);
	});
});
