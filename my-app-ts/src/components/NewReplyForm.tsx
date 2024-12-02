// src/components/NewReplyForm.tsx
import React, { useState } from 'react';
import { createReply } from '../api/reply'; // api/reply.tsからインポート

interface NewReplyFormProps {
  postId: number; // リプライ先の投稿ID
  user_id: string;
}

const NewReplyForm: React.FC<NewReplyFormProps> = ({ postId, user_id }) => {
  const [content, setContent] = useState<string>(''); // リプライ内容
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 空のリプライ内容は送信しない
    if (!content.trim()) {
      setErrorMessage('リプライ内容を入力してください');
      return;
    }

    setIsSubmitting(true);

    const replyData = { content, postId, user_id };

    try {
      const response = await createReply(replyData); // API呼び出し
      if (response.success) {
        setContent(''); // フォームリセット
        setErrorMessage('');
        console.log('リプライが送信されました');
      } else {
        setErrorMessage(response.message); // エラーメッセージ表示
      }
    } catch (error) {
      setErrorMessage('リプライの送信に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="リプライを入力..."
        required
        disabled={isSubmitting}
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '送信中...' : '送信'}
      </button>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </form>
  );
};

export default NewReplyForm;
