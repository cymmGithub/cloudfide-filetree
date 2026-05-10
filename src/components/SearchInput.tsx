import { parseAsString, useQueryState } from 'nuqs';
import styled from 'styled-components';

const THROTTLE_MS = 200;

export function SearchInput() {
	const [value, setValue] = useQueryState(
		'q',
		parseAsString.withDefault('').withOptions({ throttleMs: THROTTLE_MS }),
	);

	return (
		<Wrap $active={value.length > 0}>
			<Input
				type="search"
				placeholder="search for files || folders..."
				value={value}
				onChange={(e) => setValue(e.target.value)}
				spellCheck={false}
			/>
		</Wrap>
	);
}

const Wrap = styled.div<{ $active: boolean }>`
	display: grid;
	grid-template-columns: auto 1fr auto;
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
	width: 100%;
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
