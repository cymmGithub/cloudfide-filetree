import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { HomePage } from './pages/HomePage';
import { TreePage } from './pages/TreePage';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';

function App() {
	return (
		<ThemeProvider theme={theme}>
			<GlobalStyles />
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/tree/*" element={<TreePage />} />
					<Route path="*" element={<div>Not found</div>} />
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
