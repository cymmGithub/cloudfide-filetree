import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '../styles/theme';

export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
	return render(ui, {
		wrapper: ({ children }) => (
			<ThemeProvider theme={theme}>
				<BrowserRouter>{children}</BrowserRouter>
			</ThemeProvider>
		),
		...options,
	});
}
