import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import HomePage from './pages/HomePage';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter, Route ,Routes} from 'react-router-dom';


function App() {
  return (
    <AuthProvider>
      <div style={{ margin: '2em' }}>
        <BrowserRouter>
        <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
         <Route path="/home" element={<HomePage />} />

        </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;