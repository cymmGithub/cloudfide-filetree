import type { ReactElement } from 'react';
import {
	RouterProvider,
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
} from '@tanstack/react-router';
import { render, type RenderOptions } from '@testing-library/react';
import { z } from 'zod';
import { theme } from '../styles/theme';
import { ThemeProvider } from 'styled-components';

/** For components that don't touch the router — just the theme. */
export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
	return render(ui, {
		wrapper: ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>,
		...options,
	});
}

/**
 * For components that render <Link>. Builds a minimal in-memory router whose
 * route tree includes `/tree/$` so links resolve, and awaits the initial load
 * so content renders synchronously to queries.
 */
export async function renderWithRouter(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
	const rootRoute = createRootRoute({
		component: () => <ThemeProvider theme={theme}>{ui}</ThemeProvider>,
	});
	const indexRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: '/',
		component: () => null,
	});
	const treeRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: '/tree/$',
		validateSearch: z.object({ q: z.string().default('') }),
		component: () => null,
	});
	const router = createRouter({
		routeTree: rootRoute.addChildren([indexRoute, treeRoute]),
		history: createMemoryHistory({ initialEntries: ['/'] }),
	});
	await router.load();
	return render(<RouterProvider router={router as never} />, options);
}
