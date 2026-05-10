import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../test/render-utils';
import { DropSource } from '../DropSource';

describe('DropSource', () => {
	it('shows the empty prompt and the file icon when no file is loaded', () => {
		const { container } = renderWithProviders(
			<DropSource loadedFile={null} onFileLoaded={vi.fn()} />,
		);
		expect(screen.getByText(/drop a json file here/i)).toBeInTheDocument();
		expect(container.querySelector('svg')).toBeInTheDocument();
	});

	it('shows ✓ + filename + "loaded" when a valid file is loaded', () => {
		renderWithProviders(
			<DropSource loadedFile={{ name: 'tree.json', size: 1024 }} onFileLoaded={vi.fn()} />,
		);
		expect(screen.getByText('tree.json')).toBeInTheDocument();
		expect(screen.getByText('✓')).toBeInTheDocument();
		expect(screen.getByText(/^loaded$/i)).toBeInTheDocument();
	});

	it('shows ✗ + filename + "invalid" when the loaded file has parse errors', () => {
		renderWithProviders(
			<DropSource
				loadedFile={{ name: 'broken.json', size: 200 }}
				hasErrors
				onFileLoaded={vi.fn()}
			/>,
		);
		expect(screen.getByText('broken.json')).toBeInTheDocument();
		expect(screen.getByText('✗')).toBeInTheDocument();
		expect(screen.getByText(/^invalid$/i)).toBeInTheDocument();
	});
});
