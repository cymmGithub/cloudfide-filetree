import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';

function App() {
	return (
		<ThemeProvider theme={theme}>
			<GlobalStyles />
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<div>Home (TODO)</div>} />
					<Route path="/tree/*" element={<div>Tree (TODO)</div>} />
					<Route path="*" element={<div>Not found</div>} />
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
