import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { TreePage } from '../pages/TreePage';

export const Route = createFileRoute('/tree/$')({
	validateSearch: z.object({ q: z.string().default('') }),
	component: TreePage,
});
