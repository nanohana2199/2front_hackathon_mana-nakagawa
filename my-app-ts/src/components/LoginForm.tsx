import { signInWithEmailAndPassword } from 'firebase/auth';
import {auth} from '../firebase';
import { Link } from 'react-router-dom';
import {useNavigate} from  'react-router';
import { useState } from 'react';




const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
      try{
        const trimmedEmail = email.trim();
            if (!trimmedEmail || !password) {
                throw new Error("メールアドレスとパスワードを入力してください。");
            }
        await signInWithEmailAndPassword(auth, trimmedEmail, password);
        navigate("/home");
      }catch (error) {
        // errorがErrorオブジェクトである場合のみmessageを取得
        if (error instanceof Error) {
          setErrorMessage(error.message || "ログインに失敗しました。");
        } };

      };

    return(
        <div>
          <h1>ログイン画面</h1>
          <form onSubmit={handleSubmit}>
            <div>
                <label>メールアドレス</label>
                <input name="email" type="email" placeholder="email" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
                <label>パスワード</label>
                <input name="password" type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div>
            
                <button>ログイン</button>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            </div>
            <div>
                ユーザー登録は<Link to ={'/signup'}>こちら</Link>
            </div>
         </form>
        </div>
    );
};

export default LoginForm;