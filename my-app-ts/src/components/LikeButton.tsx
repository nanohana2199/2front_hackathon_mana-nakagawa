import React, { useState, useEffect } from 'react';
import { likePost } from '../api/like';  // likePost関数をインポート

interface LikeButtonProps {
  post_id: number;  // 投稿IDを受け取る（いいねをつける対象）
  user_id: string;  // ユーザーIDを受け取る（いいねをつけるユーザー）
}

const LikeButton: React.FC<LikeButtonProps> = ({ post_id, user_id }) => {
  const [liked, setLiked] = useState<boolean>(false);  // いいねの状態を管理
  const [likeCount, setLikeCount] = useState<number>(0);  // いいねされた回数を管理

  // 初回レンダリング時に現在のいいね数を取得
  useEffect(() => {
    const fetchLikeCount = async () => {
      const apiBaseURL = process.env.REACT_APP_BASE_URL;
      try {
        // APIからいいね数を取得する処理を追加
        const response = await fetch(`${apiBaseURL}/posts/${post_id}/like/count`);
        if (response.ok) {
          const data = await response.json();
          setLikeCount(data.count);  // 取得したいいね数をステートにセット
        } else {
          console.error('いいね数の取得に失敗しました');
        }
      } catch (error) {
        console.error('いいね数の取得でエラーが発生しました:', error);
      }
    };

    fetchLikeCount();
  }, [post_id]);

  const handleLike = async () => {
    if (!user_id) {
      alert("ユーザーがログインしていません");
      return;
    }

    try {
      const response = await likePost(post_id, user_id);  // likePost関数を使ってバックエンドにPOSTリクエスト
      if (response.ok) {
        setLiked(true);  // いいねが成功したら状態を更新
        setLikeCount(likeCount + 1);  // いいね数を増やす
      } else {
        alert('いいねに失敗しました');
      }
    } catch (error) {
      console.error('いいねのリクエストでエラーが発生:', error);
    }
  };

  return (
    <div>
      <button onClick={handleLike} disabled={liked}>
        {liked ? 'いいね済み' : 'いいね'}
      </button>
      <span>{likeCount} 回</span> {/* いいね数を表示 */}
    </div>
  );
};

export default LikeButton;
