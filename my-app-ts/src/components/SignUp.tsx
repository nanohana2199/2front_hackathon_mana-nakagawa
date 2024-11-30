import { useState } from "react";
import {auth} from '../firebase';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import { useNavigate } from "react-router";

const SignUp = () => {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [errorMessage, setErrorMessage] = useState("");
 const navigate = useNavigate();

 const handleSubmit = (event:React.FormEvent<HTMLFormElement>) =>{
    event.preventDefault();
      if (!email || !password) {
        setErrorMessage("メールアドレスとパスワードを入力してください。");
        return;
      }


   createUserWithEmailAndPassword(auth, email, password)
     .then(() => {
    setErrorMessage("");
    navigate("/"); // 成功時にホームページへ移動
    console.log(email, password);
  })
    .catch((error) => {
    setErrorMessage(error.message); // エラーメッセージを表示
  });

};

const handleChangeEmail = (event:React.ChangeEvent<HTMLInputElement>) =>{
    setEmail(event.currentTarget.value);
};
const handleChangePassword =(event:React.ChangeEvent<HTMLInputElement>) =>{
    setPassword(event.currentTarget.value);
};



return (
<div>
  <h1>ユーザー登録</h1>
  <form onSubmit={handleSubmit}>
    <div>
        <label>メールアドレス</label>
        <input
          name="email"
          type="email"
          placeholder="email"
          onChange={(event)=> handleChangeEmail(event)}
          />
    </div>
    <div>
        <label>パスワード</label>
        <input 
         name="password" 
         type="password"
         placeholder="password" 
         onChange={(event)=> handleChangePassword(event)}/>
    </div>
    <div>
        <button>登録</button>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  </form>
</div>
);
};



export default SignUp;