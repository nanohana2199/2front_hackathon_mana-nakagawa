import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter, Route ,Routes} from 'react-router-dom';

function App() {
  return (
    <AuthProvider>
      <div style={{ margin: '2em' }}>
        <BrowserRouter>
        <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
         <Route path="/home" element={<Home />} />

        </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;