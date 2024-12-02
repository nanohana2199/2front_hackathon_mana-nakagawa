import { getAuth } from "firebase/auth";
import { useState, useEffect } from "react";

const useCurrentUser = (): string | null => {
  const [userId, setUserId] = useState<string| null>(null);

  useEffect(() => {
    const auth = getAuth(); // Firebaseの認証インスタンスを取得
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid); // ユーザーがログインしていればそのUIDをセット
      } else {
        setUserId(null); // ユーザーがログインしていなければnullをセット
      }
    });

    // クリーンアップ
    return () => unsubscribe();
  }, []); // コンポーネントがマウントされたときに実行

  return userId;
};

export default useCurrentUser;
