import { NuqsAdapter } from 'nuqs/adapters/react-router/v6';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { TreePage } from './pages/TreePage';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';
import { ThemeProvider } from 'styled-components';

function App() {
	return (
		<ThemeProvider theme={theme}>
			<GlobalStyles />
			<BrowserRouter>
				<NuqsAdapter>
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/tree/*" element={<TreePage />} />
						<Route path="*" element={<div>Not found</div>} />
					</Routes>
				</NuqsAdapter>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
