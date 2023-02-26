/**
 * アクセストークンを取得する
 * @return accessToken string
 */

export function getAccessToken(): string {
  // 定数
  const TOKEN_URL = 'https://accounts.spotify.com/api/token';

  // 環境変数の取得
  const props = PropertiesService.getScriptProperties().getProperties();
  const CLIENT_ID = props.CLIENT_ID;
  const CLIENT_SECRET = props.CLIENT_SECRET;
  const REFRESH_TOKEN = props.REFRESH_TOKEN;

  // 認証情報の生成
  const auth = Utilities.base64Encode(`${CLIENT_ID}:${CLIENT_SECRET}`);

  // リクエスト
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: 'post',
    headers: {
      Authorization: `Basic ${auth}`,
    },
    payload: {
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN,
    },
  };
  const response = UrlFetchApp.fetch(TOKEN_URL, options);
  const data = JSON.parse(response.getContentText());

  return data.access_token;
}
