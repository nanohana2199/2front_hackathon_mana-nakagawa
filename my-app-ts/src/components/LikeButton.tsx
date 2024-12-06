import React, { useState, useEffect } from 'react';
import { likePost, getLikeCount, checkIfLiked } from '../api/like'; // checkIfLiked関数をインポート
import FavoriteIcon from '@mui/icons-material/Favorite'; // ハートアイコンをインポート
import { IconButton } from '@mui/material'; // アイコンボタンを利用

interface LikeButtonProps {
  post_id: number; // 投稿IDを受け取る（いいねをつける対象）
  user_id: string; // ユーザーIDを受け取る（いいねをつけるユーザー）
}

const LikeButton: React.FC<LikeButtonProps> = ({ post_id, user_id }) => {
  const [liked, setLiked] = useState<boolean>(false); // いいねの状態を管理
  const [likeCount, setLikeCount] = useState<number>(0); // いいねされた回数を管理

  // 初回レンダリング時にいいね数とユーザーのいいね状態を取得
  useEffect(() => {
    const fetchData = async () => {
      if (!user_id) return;

      try {
        // いいね数を取得
        const count = await getLikeCount(post_id);
        setLikeCount(count);

        // ユーザーがいいねしているかどうかを取得
        const isLiked = await checkIfLiked(post_id, user_id);
        setLiked(isLiked);
      } catch (error) {
        console.error('データ取得でエラーが発生しました:', error);
      }
    };

    fetchData();
  }, [post_id, user_id]);

  const handleLike = async () => {
    if (!user_id) {
      alert("ユーザーがログインしていません");
      return;
    }

    try {
      const response = await likePost(post_id, user_id); // likePost関数を使ってバックエンドにPOSTリクエスト
      if (response.ok) {
        setLiked(true); // いいねが成功したら状態を更新
        setLikeCount(likeCount + 1); // いいね数を増やす
      } else {
        alert('いいねに失敗しました');
      }
    } catch (error) {
      console.error('いいねのリクエストでエラーが発生:', error);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <IconButton onClick={handleLike} disabled={liked}>
        <FavoriteIcon style={{ color: liked ? 'red' : 'gray' }} />
      </IconButton>
      <span>{likeCount}</span> {/* いいね数を表示 */}
    </div>
  );
};

export default LikeButton;
