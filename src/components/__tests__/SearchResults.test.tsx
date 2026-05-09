import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import type { FlatEntry } from '../../lib/traverse';
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
		expect(screen.getByText(/Brak wyników/i)).toBeInTheDocument();
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
});
