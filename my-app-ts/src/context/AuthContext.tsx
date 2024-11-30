import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { auth } from '../firebase';
import { User as FirebaseUser } from 'firebase/auth';

// AuthContextType型の定義
type AuthContextType = {
  user: FirebaseUser | null; // ユーザーがnullかFirebaseのユーザーオブジェクト
};

// AuthContextの作成（デフォルト値としてundefinedを指定）
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// useAuthContextカスタムフック
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

// AuthProviderコンポーネント
type AuthProviderProps = {
  children: ReactNode; // childrenの型指定
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null); // userの型を`firebase.User | null`に変更

  // `onAuthStateChanged`でのユーザー情報取得
  useEffect(() => {
    const unsubscribed = auth.onAuthStateChanged((user) => {
      console.log(user); // 受け取ったユーザーをログに出力
      setUser(user); // ユーザー情報をstateにセット
    });

    return () => {
      unsubscribed(); // コンポーネントがアンマウントされたときにリスナーを解除
    };
  }, []);

  const value = {
    user, // コンテキストで提供する値
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
