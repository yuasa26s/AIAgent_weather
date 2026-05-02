# アプリ名

その日の天気によって、服装をAIが提案してくれる

## 概要

## 使用技術

クライアント先：WEBフロント
<br>フロントエンド：React/Next.js
<br>バックエンド：FastAPI/Python
<br>RAG:OpenWeatherMap
<br>今後拡張予定（仮）：Serper.dev、Google Places API、Eventbrite
<br>openAI API：gpt-4o-mini
<br>DB：MySQL

## MVPでやること（仮）

天気API
<br>OpenAIで服提案
<br>ユーザー好み入力
<br>履歴保存

## API定義
### エンドポイント（MVP）

POST  /outfit-recommendation
(説明：現在地の天気情報をもとにAIが服装を提案する。1ページ目から2ページ目へ移行する時に行われていること。)

### Request(フロント→バック)
リクエスト例
{
"uuid": "123e4567-e89b-12d3-a456-426614174000",  // ユーザー識別
"latitude": 34.69,   // GPSから取得
"longitude": 135.5,  // GPSから取得
"date": "2026-02-24" // 端末から取得
}

### Response(バック→フロント)
レスポンス例
{
"temperature": 8, // 気温
"humidity": 80, // 湿度
"weather": "Rain",
"wind_speed": 5,
"outfit-recommendation": "厚手のコートと防水ブーツがおすすめです"
}

### エンドポイント（余裕があれば）

POST /outfit-recommendation/chat
(説明：希望に沿った服装を提案する。)

### Request

(フロント→バック：FastAPI(APIサーバー)がDBから直前のコーデ提案を取得する→FastAPIが取得した情報をOpenAI APIに渡す)
リクエスト例
{
"uuid": "123e4567-e89b-12d3-a456-426614174000",
"message": "もう少しカジュアル寄りにしてほしい",
}

### Response

(バック：OpenAI APIが新しい提案を生成→FastAPIが受け取る→DBに保存?→フロントに返す)
レスポンス例

{
"recommendation": "厚手のコートとデニムジャケットを組み合わせたカジュアルコーデがおすすめです",
"previous_recommendation": "厚手のコートと防水ブーツがおすすめです"
}

##### エンドポイント（対話履歴の取得）

GET /api/chats/{user_id}

(説明：チャット画面を開いた時に、これまでの会話を表示するためのAPIです。)
役割: DBの chat_histories テーブルから過去の会話を取得します。

[
{"role": "user", "content": "昨日の服、ちょっと寒かったな"},
{"role": "assistant", "content": "すみませんでした！昨日は風が強かったですね。今日はそれを踏まえて...",
"created_at": "2026-02-23T10:00:00Z"}
]

これも余裕があれば

GET /history


## 環境変数一覧

## 開発ルール
