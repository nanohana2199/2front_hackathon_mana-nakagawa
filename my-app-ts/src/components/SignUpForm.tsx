import { useState } from "react";
import { auth, storage } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { extractBirthDate } from '../utils/ocr'; // 画像から生年月日を抽出するユーティリティ
import { calculateAge, isUnder16 } from '../utils/ageValidation'; // 年齢計算ユーティリティ
import { createUser } from "../api/user"; // API呼び出し
import { useNavigate } from "react-router";

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password || !username || !file) {
      setErrorMessage("すべての項目を入力してください。");
      return;
    }

    try {
      // Firebase Storageに画像をアップロード
      const storageRef = ref(storage, `images/${file.name}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      console.log("photoURL:", photoURL);


      // 画像から生年月日を抽出
      const birthDate = await extractBirthDate(photoURL);
      if (!birthDate) {
        setErrorMessage("画像から生年月日を検出できませんでした。");
        return;
      }
      // 年齢を計算して16歳以下か判定
      if (isUnder16(birthDate)) {
        setErrorMessage("16歳以下のため、サインアップできません。");
        return;
      }

      // Firebase Authenticationでアカウント作成
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // 新規ユーザーをバックエンドに登録
      const newUser = { user_id: userId, username, email, photo_url: photoURL };
      const response = await createUser(newUser);

      if (response.ok) {
        navigate("/home");
      } else {
        setErrorMessage("ユーザー登録に失敗しました。");
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      setErrorMessage("サインアップに失敗しました。");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="ユーザー名" onChange={(e) => setUsername(e.target.value)} />
      <input type="email" placeholder="メールアドレス" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="パスワード" onChange={(e) => setPassword(e.target.value)} />
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
      <button type="submit">登録</button>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </form>
  );
};

export default SignUpForm;
