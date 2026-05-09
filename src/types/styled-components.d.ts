import 'styled-components';
import type { Theme } from '../styles/theme';

declare module 'styled-components' {
	// Module augmentation requires interface (declaration merging); empty body is intentional.
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	export interface DefaultTheme extends Theme {}
}
