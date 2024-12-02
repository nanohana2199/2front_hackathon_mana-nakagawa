export async function createReply(replyData: { content: string; postId: number; user_id:string}): Promise<{ success: boolean; message: string }> {
    const apiBaseURL = process.env.REACT_APP_BASE_URL;
  
    try {
      const response = await fetch(`${apiBaseURL}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(replyData),
      });

      // レスポンスがJSONかどうかを確認
      const contentType = response.headers.get('content-type');
      let errorMessage = 'リプライの送信に失敗しました';

      if (!response.ok) {
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          const text = await response.text();
          errorMessage = text || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return { success: true, message: data.message };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('エラーが発生しました:', error.message);
        return { success: false, message: error.message };
      } else {
        return { success: false, message: '予期しないエラーが発生しました' };
      }
    }
}

// src/api/reply.ts

export async function getReplies(postId: number): Promise<any[]> {
    const apiBaseURL = process.env.REACT_APP_BASE_URL;
  
    try {
      const response = await fetch(`${apiBaseURL}/posts/${postId}/replies`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('リプライの取得に失敗しました');
      }
  
      const data = await response.json();
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('エラーが発生しました:', error.message);
        return [];
      } else {
        return [];
      }
    }
  }
  