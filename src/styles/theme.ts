export const theme = {
	colors: {
		bg: '#ffffff',
		surface: '#f9fafb',
		text: '#1a1a1a',
		muted: '#6b7280',
		border: '#e5e7eb',
		accent: '#3b82f6',
		accentHover: '#2563eb',
		error: '#dc2626',
		errorBg: '#fef2f2',
		errorBorder: '#fecaca',
		success: '#16a34a',
	},
	fonts: {
		body: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
		mono: 'ui-monospace, "SF Mono", Menlo, Monaco, Consolas, monospace',
	},
	fontSize: {
		xs: '0.75rem',
		sm: '0.875rem',
		md: '1rem',
		lg: '1.25rem',
		xl: '1.5rem',
		xxl: '2rem',
	},
	spacing: {
		xs: '0.25rem',
		sm: '0.5rem',
		md: '1rem',
		lg: '1.5rem',
		xl: '2rem',
		xxl: '3rem',
	},
	radius: {
		sm: '4px',
		md: '8px',
		lg: '12px',
	},
} as const;

export type Theme = typeof theme;
