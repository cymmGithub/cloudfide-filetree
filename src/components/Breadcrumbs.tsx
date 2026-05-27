import { createLink } from '@tanstack/react-router';
import { Fragment } from 'react';
import styled from 'styled-components';

interface Props {
	path: readonly string[];
}

export function Breadcrumbs({ path }: Props) {
	if (path.length === 0) return null;

	return (
		<Nav aria-label="Breadcrumb">
			<Crumb to="/tree/$" params={{ _splat: '' }}>
				Home
			</Crumb>
			{path.map((segment, i) => {
				const isLast = i === path.length - 1;
				const partial = path.slice(0, i + 1);
				return (
					<Fragment key={partial.join('/')}>
						<Separator>/</Separator>
						{isLast ? (
							<Current aria-current="page">{segment}</Current>
						) : (
							<Crumb to="/tree/$" params={{ _splat: partial.join('/') }}>
								{segment}
							</Crumb>
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
	gap: 0.4ch;
	font-family: ${(props) => props.theme.fonts.mono};
	font-size: ${(props) => props.theme.fontSize.sm};
	min-width: 0;
`;

const Crumb = createLink(styled.a`
	color: ${(props) => props.theme.colors.muted};
	text-decoration: none;
	padding: 0;
	transition: color 0.12s ease;

	&:hover {
		color: ${(props) => props.theme.colors.accent};
		box-shadow: inset 0 -1px 0 ${(props) => props.theme.colors.accent};
		text-decoration: none;
	}
`);

const Current = styled.span`
	color: ${(props) => props.theme.colors.text};
	font-weight: 500;
`;

const Separator = styled.span`
	color: ${(props) => props.theme.colors.dim};
`;
