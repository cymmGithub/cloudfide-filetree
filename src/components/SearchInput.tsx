import { getRouteApi, useNavigate } from '@tanstack/react-router';
import styled from 'styled-components';

const treeRoute = getRouteApi('/tree/$');

export function SearchInput() {
	const { q } = treeRoute.useSearch();
	const navigate = useNavigate();

	return (
		<Wrap $active={q.length > 0}>
			<Input
				type="search"
				placeholder="search for files || folders..."
				value={q}
				onChange={(e) =>
					navigate({ to: '.', search: (prev) => ({ ...prev, q: e.target.value }), replace: true })
				}
				spellCheck={false}
			/>
		</Wrap>
	);
}

const Wrap = styled.div<{ $active: boolean }>`
	display: flex;
	align-items: center;
	gap: 0.6ch;
	padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
	background: ${(props) => props.theme.colors.surface};
	border: 1px solid
		${(props) => (props.$active ? props.theme.colors.accent : props.theme.colors.border)};
	transition: border-color 0.15s ease;

	&:focus-within {
		border-color: ${(props) => props.theme.colors.accent};
	}
`;

const Input = styled.input`
	flex: 1;
	min-width: 0;
	padding: 0;
	border: none;
	background: transparent;
	color: ${(props) => props.theme.colors.text};
	font-family: ${(props) => props.theme.fonts.mono};
	font-size: ${(props) => props.theme.fontSize.sm};
	letter-spacing: 0;
	text-transform: none;

	&::placeholder {
		color: ${(props) => props.theme.colors.dim};
	}

	&:focus {
		outline: none;
	}

	&::-webkit-search-cancel-button {
		appearance: none;
	}
`;
