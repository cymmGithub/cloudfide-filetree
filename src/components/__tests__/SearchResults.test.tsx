import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../test/render-utils';
import type { TreeNode } from '../../types/tree';
import { SearchResults } from '../SearchResults';

const tree: TreeNode = {
	name: 'root',
	type: 'folder',
	children: [
		{
			name: 'src',
			type: 'folder',
			children: [
				{ name: 'index.ts', type: 'file', size: 100 },
				{
					name: 'components',
					type: 'folder',
					children: [{ name: 'Button.tsx', type: 'file', size: 200 }],
				},
			],
		},
	],
};

describe('SearchResults', () => {
	it('shows empty state when nothing matches the query', () => {
		renderWithProviders(<SearchResults tree={tree} query="xyz" />);
		expect(screen.getByText(/Brak wyników/i)).toBeInTheDocument();
	});

	it('renders matching results with their parent paths and clickable links', () => {
		renderWithProviders(<SearchResults tree={tree} query="button" />);
		const link = screen.getByRole('link');
		expect(link).toHaveAttribute('href', '/tree/src/components/Button.tsx');
		expect(screen.getByText(/in \/src\/components/)).toBeInTheDocument();
	});

	it('highlights the matching fragment in result names', () => {
		const { container } = renderWithProviders(<SearchResults tree={tree} query="but" />);
		const mark = container.querySelector('mark');
		expect(mark?.textContent).toBe('But');
	});
});
