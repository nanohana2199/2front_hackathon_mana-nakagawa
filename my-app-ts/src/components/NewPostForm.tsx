// src/components/NewPostForm.tsx
import React, { useState } from 'react';
import { createPost } from '../api/post'; // api.tsからインポート

interface NewPostFormProps {
  onPostSubmit?: () => void; // 投稿完了時のコールバック
}

const NewPostForm: React.FC <NewPostFormProps> = ({ onPostSubmit }) => {
  const [content, setContent] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // 空の投稿は送信しない
    if (!content.trim()) {
      setErrorMessage('投稿内容を入力してください');
      return;
    }
  
    setIsSubmitting(true);  // 投稿処理中の状態にする
  
    // 新規投稿データ
    const postData = { content };
  
    try {
      const createdPost = await createPost(postData); // createPost関数を呼び出す
  
      setContent('');  // フォームをリセット
      setErrorMessage('');  // エラーメッセージをクリア
  
      // 投稿送信後の処理（UI更新やリダイレクトなど）
      console.log('投稿が成功しました:', createdPost);

      // 投稿完了時に親コンポーネントに通知
      if (onPostSubmit) {
        onPostSubmit();
      }

    } catch (error: unknown) {
      if (error instanceof Error) {
        // エラーメッセージ（誹謗中傷エラーを含む）を表示
        setErrorMessage(error.message);
      }  else {
        setErrorMessage('予期しないエラーが発生しました'); // 型が異なる場合のエラーハンドリング
      }
    } finally {
      setIsSubmitting(false);  // 投稿処理終了
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a post..."
        required
        disabled={isSubmitting}  // 投稿中は編集不可
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '投稿中...' : 'Post'}
      </button>

      {/* エラーメッセージの表示 */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </form>
  );
};

export default NewPostForm;
