import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import HomePage from './pages/HomePage';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// テーマを作成
const theme = createTheme({
  palette: {
    mode: 'light', // 'dark' にも切り替え可能
    primary: {
      main: '#1976d2', // プライマリカラー
    },
    secondary: {
      main: '#dc004e', // セカンダリカラー
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <div style={{ margin: '2em' }}>
            <Routes>
              <Route path="/" element={<LoginForm />} />
              <Route path="/signup" element={<SignUpForm />} />
              <Route path="/home" element={<HomePage />} />
              
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
