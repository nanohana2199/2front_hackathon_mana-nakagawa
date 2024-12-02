// src/components/PostItem.tsx
import React, { useState } from 'react';
import { Post } from '../types';
import LikeButton from './LikeButton';
import NewReplyForm from './NewReplyForm';
import useCurrentUser from '../hooks/useCurrentUser';

interface PostItemProps {
  post: Post;
  replies: any[]; // リプライのデータ
}

const PostItem: React.FC<PostItemProps> = ({ post, replies }) => {
  const user_id = useCurrentUser();
  const [isReplying, setIsReplying] = useState<boolean>(false);

  if (user_id === null) {
    return <p>ユーザーがログインしていません</p>;
  }

  const handleReplyClick = () => {
    setIsReplying(!isReplying);
  };

  return (
    <div>
      <p>{post.content}</p>
      <div>
        <LikeButton post_id={Number(post.id)} user_id={user_id} />
      </div>

      <button onClick={handleReplyClick}>
        {isReplying ? 'キャンセル' : 'リプライ'}
      </button>

      {isReplying && <NewReplyForm postId={Number(post.id)} user_id={user_id} />}

      {/* リプライの表示 */}
      <div>
        {replies.length > 0 ? (
          replies.map((reply, index) => (
            <div key={index}>
              <p>{reply.content}</p>
            </div>
          ))
        ) : (
          <p>リプライはありません</p>
        )}
      </div>
    </div>
  );
};

export default PostItem;
