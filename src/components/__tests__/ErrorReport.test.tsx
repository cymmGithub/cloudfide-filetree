import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { printParseErrorCode } from 'jsonc-parser';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../test/render-utils';
import { type EnrichedError, ErrorReport } from '../ErrorReport';

const VALUE_EXPECTED = 4;

const makeError = (overrides: Partial<EnrichedError> = {}): EnrichedError => ({
	error: VALUE_EXPECTED,
	offset: 0,
	length: 1,
	line: 1,
	col: 1,
	...overrides,
});

describe('ErrorReport', () => {
	it('renders nothing when there are no errors', () => {
		const { container } = renderWithProviders(
			<ErrorReport errors={[]} currentIdx={0} onNavigate={vi.fn()} />,
		);
		expect(container).toBeEmptyDOMElement();
	});

	it('renders status, location, and message for a single error with both nav buttons disabled', () => {
		const errors = [makeError({ line: 2, col: 7 })];
		renderWithProviders(<ErrorReport errors={errors} currentIdx={0} onNavigate={vi.fn()} />);

		expect(screen.getByText(/json invalid — 1 error$/i)).toBeInTheDocument();
		expect(screen.getByRole('alert')).toBeInTheDocument();
		expect(screen.getByText(/line 2 col 7/i)).toBeInTheDocument();
		expect(screen.getByText(printParseErrorCode(VALUE_EXPECTED))).toBeInTheDocument();
		expect(screen.getByText('1/1')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /previous error/i })).toBeDisabled();
		expect(screen.getByRole('button', { name: /next error/i })).toBeDisabled();
	});

	it('navigates between errors and disables the edge button at boundaries', async () => {
		const user = userEvent.setup();
		const onNavigate = vi.fn();
		const errors = [makeError(), makeError({ line: 4, col: 2 }), makeError({ line: 9, col: 5 })];

		const { rerender } = renderWithProviders(
			<ErrorReport errors={errors} currentIdx={0} onNavigate={onNavigate} />,
		);
		expect(screen.getByText(/json invalid — 3 errors$/i)).toBeInTheDocument();
		expect(screen.getByText('1/3')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /previous error/i })).toBeDisabled();

		await user.click(screen.getByRole('button', { name: /next error/i }));
		expect(onNavigate).toHaveBeenLastCalledWith(1);

		rerender(<ErrorReport errors={errors} currentIdx={2} onNavigate={onNavigate} />);
		expect(screen.getByText('3/3')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /next error/i })).toBeDisabled();

		await user.click(screen.getByRole('button', { name: /previous error/i }));
		expect(onNavigate).toHaveBeenLastCalledWith(1);
	});
});
