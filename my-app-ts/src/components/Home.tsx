import {auth} from '../firebase';
import { useNavigate} from 'react-router-dom'

const Home: React.FC =() => {
    const navigate = useNavigate();
    const handleLogout =() => {
        auth.signOut();
        navigate('/');
    };
return (
 <div>
    <h1>ホームページ</h1>
    <button onClick={handleLogout}>ログアウト</button>
    </div>
);
};

export default Home;