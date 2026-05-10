import type { ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { theme } from '../styles/theme';
import { ThemeProvider } from 'styled-components';

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
