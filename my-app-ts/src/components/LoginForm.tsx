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
  console.log("現在時刻（タイムスタンプ）:", currentTime);
  localStorage.setItem("loginTime", currentTime.toString()); // localStorageに保存
  console.log("localStorageに保存した値:", localStorage.getItem("loginTime"));
  
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
        position: 'relative',
        height: '100vh',
        backgroundColor: '#5FA7EF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // 上下を均等配置
        alignItems: 'center',
        p: 2,
        overflow: 'hidden', // スクロール防止
        gap:'5px',
      }}
    >
      {/* 世界と出会おう */}
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          color: 'white',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          mt: 30, 
        }}
      >
        世界と出会おう！
      </Typography>

      {/* ログインフォーム */}
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        bgcolor="white" 
        p={4}
        borderRadius={2} 
        boxShadow={3}
        width="100%"
        maxWidth="350px"
        sx={{
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
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
          <Alert severity="error" sx={{ my: 1 }}>
            {errorMessage}
          </Alert>
        )}
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth
          size="large"
          sx={{ mt: 1 }}
        >
          ログイン
        </Button>
        <Typography 
          variant="body2" 
          align="center" 
          sx={{ mt: 1 }}
        >
          ユーザー登録は{" "}
          <Link to="/signup" style={{ textDecoration: "none", color: "#1976d2" }}>
            こちら
          </Link>
        </Typography>
      </Box>

      {/* 下部の画像 */}
      <Box
        component="img"
        src="/images/dag.png"
        alt="背景画像"
        sx={{
          
          height: 'auto',
          maxWidth: '100%',
          mb: 10,
        }}
      />
    </Box>
  );
};

export default LoginForm;
