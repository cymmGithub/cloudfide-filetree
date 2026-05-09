import { debounce, parseAsString, useQueryState } from 'nuqs';
import styled from 'styled-components';

const DEBOUNCE_MS = 200;

export function SearchInput() {
	const [value, setValue] = useQueryState(
		'q',
		parseAsString.withDefault('').withOptions({ limitUrlUpdates: debounce(DEBOUNCE_MS) }),
	);

	return (
		<Input
			type="search"
			placeholder="Szukaj plików i folderów..."
			value={value}
			onChange={(e) => setValue(e.target.value)}
		/>
	);
}

const Input = styled.input`
	width: 100%;
	padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
	border: 1px solid ${(props) => props.theme.colors.border};
	border-radius: ${(props) => props.theme.radius.md};
	background: ${(props) => props.theme.colors.bg};

	&:focus {
		outline: none;
		border-color: ${(props) => props.theme.colors.accent};
	}
`;
