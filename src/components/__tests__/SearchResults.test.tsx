import type { FlatEntry } from '../../lib/traverse';
import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../test/render-utils';
import { SearchResults } from '../SearchResults';

const sampleResults: FlatEntry[] = [
	{
		name: 'Button.tsx',
		segments: ['src', 'components', 'Button.tsx'],
		type: 'file',
		size: 200,
	},
];

describe('SearchResults', () => {
	it('shows empty state when nothing matches the query', () => {
		renderWithProviders(<SearchResults results={[]} query="xyz" />);
		expect(screen.getByText(/No results/i)).toBeInTheDocument();
	});

	it('renders matching results with their parent paths and clickable links', () => {
		renderWithProviders(<SearchResults results={sampleResults} query="button" />);
		const link = screen.getByRole('link');
		expect(link).toHaveAttribute('href', '/tree/src/components/Button.tsx');
		expect(screen.getByText(/in \/src\/components/)).toBeInTheDocument();
	});

	it('highlights the matching fragment in result names', () => {
		const { container } = renderWithProviders(
			<SearchResults results={sampleResults} query="but" />,
		);
		const mark = container.querySelector('mark');
		expect(mark?.textContent).toBe('But');
	});

	it('truncates results above the visible limit and shows a refinement note', () => {
		const many: FlatEntry[] = Array.from({ length: 250 }, (_, i) => ({
			name: `file-${i}.ts`,
			segments: [`file-${i}.ts`],
			type: 'file',
			size: 0,
		}));
		const { container } = renderWithProviders(<SearchResults results={many} query="file" />);
		expect(screen.getByRole('status').textContent).toMatch(/200/);
		expect(screen.getByRole('status').textContent).toMatch(/250/);
		expect(container.querySelectorAll('li')).toHaveLength(200);
	});
});
