import { useState } from "react";
import { auth, storage } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { extractBirthDate } from '../utils/ocr';
import { calculateAge, isUnder16 } from '../utils/ageValidation';
import { createUser } from "../api/user";
import { useNavigate } from "react-router";
import {
  TextField,
  Button,
  Typography,
  Box,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // ローディング状態を追加
  const navigate = useNavigate();

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password || !username || !file) {
      setErrorMessage("すべての項目を入力してください。");
      return;
    }

    setIsLoading(true); // ローディング開始
    setErrorMessage(""); // エラーメッセージのリセット

    try {
      const storageRef = ref(storage, `images/${file.name}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);

      const birthDate = await extractBirthDate(photoURL);
      if (!birthDate) {
        setErrorMessage("画像から生年月日を検出できませんでした。");
        return;
      }

      if (isUnder16(birthDate)) {
        setErrorMessage("16歳以下のため、サインアップできません。");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

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
    }finally {
      setIsLoading(false); // ローディング終了
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 5,
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Typography variant="h5" textAlign="center" gutterBottom>
        サインアップ
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="ユーザー名"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="メールアドレス"
            type="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="パスワード"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Typography variant="body1" textAlign="center">
            年齢確認の書類をアップロードしてください。
          </Typography>
          <div
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            style={{
              border: dragOver ? "2px dashed #007bff" : "2px dashed #ccc",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
              backgroundColor: dragOver ? "#f0f8ff" : "#fff",
              cursor: "pointer",
            }}
          >
            <Typography>
              {file ? `選択済みファイル: ${file.name}` : "ファイルをここにドロップしてください"}
            </Typography>
            <Button variant="contained" component="label" sx={{ mt: 1 }}>
              ファイルを選択
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) =>
                  setFile(e.target.files ? e.target.files[0] : null)
                }
              />
            </Button>
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading} // ローディング中は無効化
            startIcon={isLoading && <CircularProgress size={20} />} // スピナーを追加
          >
            {isLoading ? "登録中..." : "登録"}
          </Button>
        </Stack>
      </form>
      {errorMessage && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Alert>
      )}
    </Box>
  );
};

export default SignUpForm;
