import { User } from "../types/user";

// ユーザーを作成する関数
export async function createUser(user: User) {
  const apiBaseURL = process.env.REACT_APP_BASE_URL;
  console.log(apiBaseURL);

  try {
    const response = await fetch(apiBaseURL + '/users', {
      method: 'POST', // HTTPメソッドをPOSTに設定
      headers: {
        'Content-Type': 'application/json', // Content-TypeをJSONに設定
      },
      body: JSON.stringify(user), // リクエストボディにユーザーデータをJSONとして送信
    });

    if (!response.ok) {
      throw new Error('Failed to create user');
    }

    const createdUser = await response.json(); // レスポンスとして返されたユーザー情報を取得
    console.log('Created user:', createdUser);
    return { ok: true, user: createdUser }; // 成功時に結果を返す
  } catch (error: any) {
    console.error('Error:', error);
    return { ok: false, error: error.message }; // 失敗時にエラーメッセージを返す
  }
}
