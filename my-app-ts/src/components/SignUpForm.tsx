import { useState } from "react";
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from "react-router";
import { createUser } from "../api/user"; // バックエンドでユーザー作成する関数をインポート

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // usernameの状態を追加
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password || !username) {
      setErrorMessage("メールアドレス、パスワード、ユーザー名を入力してください。");
      return;
    }

    // Firebase Authでユーザーを作成
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        setErrorMessage("");
        console.log("Firebase auth user created");

        // Firebase Authenticationのuidを取得
        const userId = userCredential.user.uid;

        // バックエンドでユーザーを作成
        const newUser = { 
          user_id: userId,  // Firebase UIDをuser_idとして送信
          username, 
          email 
        };
        
        // バックエンドに送信
        const response = await createUser(newUser); 
        if (response.ok) {
          navigate("/home"); // 成功時にホームページへ移動
        } else {
          setErrorMessage("ユーザー登録に失敗しました");
        }
      })
      .catch((error) => {
        setErrorMessage(error.message); // エラーメッセージを表示
      });
  };

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  };

  const handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.currentTarget.value);
  };

  return (
    <div>
      <h1>ユーザー登録</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ユーザー名</label>
          <input
            name="username"
            type="text"
            placeholder="username"
            onChange={handleChangeUsername}
          />
        </div>
        <div>
          <label>メールアドレス</label>
          <input
            name="email"
            type="email"
            placeholder="email"
            onChange={handleChangeEmail}
          />
        </div>
        <div>
          <label>パスワード</label>
          <input
            name="password"
            type="password"
            placeholder="password"
            onChange={handleChangePassword}
          />
        </div>
        <div>
          <button type="submit">登録</button>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
