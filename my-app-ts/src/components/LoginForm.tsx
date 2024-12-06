import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { Button, Box, TextField, Typography, Alert } from '@mui/material';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const trimmedEmail = email.trim();
      if (!trimmedEmail || !password) {
        throw new Error("メールアドレスとパスワードを入力してください。");
      }
      await signInWithEmailAndPassword(auth, trimmedEmail, password);

  const currentTime = new Date().getTime(); // 現在時刻のタイムスタンプを取得
  localStorage.setItem("loginTime", currentTime.toString()); // localStorageに保存
  
      navigate("/home");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message || "ログインに失敗しました。");
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundImage: `url('/images/bg.jpg')`, // publicフォルダの画像を参照
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: 3,
      }}
    >
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        bgcolor="white" 
        p={4} 
        borderRadius={2} 
        boxShadow={3}
        width="100%"
        maxWidth="400px"
      >
        <Typography variant="h4" align="center" gutterBottom>
          ログイン
        </Typography>
        <TextField
          label="メールアドレス"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="パスワード"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessage && (
          <Alert severity="error" style={{ margin: "10px 0" }}>
            {errorMessage}
          </Alert>
        )}
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth
          size="large"
        >
          ログイン
        </Button>
        <Typography 
          variant="body2" 
          align="center" 
          style={{ marginTop: "16px" }}
        >
          ユーザー登録は{" "}
          <Link to="/signup" style={{ textDecoration: "none", color: "#1976d2" }}>
            こちら
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginForm;
