import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { encodePath } from '../lib/path';

interface Props {
	path: readonly string[];
}

export function Breadcrumbs({ path }: Props) {
	if (path.length === 0) return null;

	return (
		<Nav aria-label="Breadcrumb">
			<Crumb to="/tree">Home</Crumb>
			{path.map((segment, i) => {
				const isLast = i === path.length - 1;
				const partial = path.slice(0, i + 1);
				return (
					<Fragment key={partial.join('/')}>
						<Separator>/</Separator>
						{isLast ? (
							<Current aria-current="page">{segment}</Current>
						) : (
							<Crumb to={`/tree/${encodePath([...partial])}`}>{segment}</Crumb>
						)}
					</Fragment>
				);
			})}
		</Nav>
	);
}

const Nav = styled.nav`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: ${(props) => props.theme.spacing.xs};
	margin-bottom: ${(props) => props.theme.spacing.md};
	font-family: ${(props) => props.theme.fonts.mono};
	font-size: ${(props) => props.theme.fontSize.sm};
`;

const Crumb = styled(Link)`
	color: ${(props) => props.theme.colors.muted};
	text-decoration: none;

	&:hover {
		color: ${(props) => props.theme.colors.accent};
		text-decoration: underline;
	}
`;

const Current = styled.span`
	color: ${(props) => props.theme.colors.text};
	font-weight: 500;
`;

const Separator = styled.span`
	color: ${(props) => props.theme.colors.muted};
`;
