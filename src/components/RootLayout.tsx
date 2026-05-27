import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import * as React from 'react';
import { GlobalStyles } from '../styles/GlobalStyles';
import { theme } from '../styles/theme';
import { ThemeProvider } from 'styled-components';

export function RootLayout() {
	return (
		<React.Fragment>
			<ThemeProvider theme={theme}>
				<GlobalStyles />
				<Outlet />
			</ThemeProvider>
			<TanStackRouterDevtools />
		</React.Fragment>
	);
}
