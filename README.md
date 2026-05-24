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

### フロントエンド (frontend/.env.local)
変数名,説明,設定例
NEXT_PUBLIC_API_URL,バックエンド API のベース URL。末尾に / を入れないよう注意。,[http://127.0.0.1:8000](http://127.0.0.1:8000)

### バックエンド (backend/.env)
変数名,説明,設定例
OPENAI_API_KEY,OpenAI API を利用するための秘密鍵。,sk-proj-...
DATABASE_URL,MySQL 等のデータベース接続文字列。,mysql://user:pass@127.0.0.1:3306/db
OPENWEATHER_API_KEY,天気予報データを取得するための API キー。,(取得したキー)

## 開発ルール
1. 環境変数の管理
.env ファイルは Git 管理しない: 秘密鍵が含まれるため、.gitignore に必ず含めてください。

.env.example の更新: 新しい環境変数を追加した際は、値を空にした .example ファイルを更新し、チームに共有してください。

2. 接続先ホストの指定
ローカル実行時は 127.0.0.1 を優先: localhost による名前解決のトラブルを避けるため、接続先は IP 直打ちを推奨します。

URL の末尾スラッシュ: フロントエンド側で API パスを結合する際、二重スラッシュ (//) にならないよう、.env には末尾スラッシュを含めない形式で統一してください。

3. ディレクトリと実行権限
正しい階層でコマンドを実行:

フロントエンド：teamC_Section8/frontend ディレクトリで npm run dev を実行。

バックエンド：teamC_Section8/backend ディレクトリで仮想環境を有効化して uvicorn を実行。

Permission Error の回避: ファイル作成時に sudo を多用すると権限エラーが発生しやすくなります。自分のユーザー権限で操作することを心がけてください。

4. 依存関係の同期
プル後のパッケージ更新: 他のメンバーがライブラリを追加している可能性があるため、git pull 後は以下のコマンドを推奨します。

フロント：npm install

バック：pip install -r requirements.txt

## アプリのフロントエンドとバックエンドをつなげた状態
<img width="1918" height="978" alt="image" src="https://github.com/user-attachments/assets/baf93940-2a01-47d9-9ef0-920429ee0247" />

## 現在の状態。
#### 導通確認: フロントエンドからバックエンド API へのリクエストが正常に通り、200 OK が返ってきています。
#### AI 統合: OpenAI API キーが正しく読み込まれ、RAG ロジックが機能して適切な回答（厚手のコートと防水ブーツの提案）が生成されています。
#### 環境構築: 権限エラーやディレクトリ構造の混乱を克服し、チーム開発プロジェクトとしてのベースラインが整いました。

## 改訂版
<img width="1813" height="1009" alt="image" src="https://github.com/user-attachments/assets/f0295149-780d-45cd-a602-889076084ee9" />

### [ユーザーの入力: 居酒屋に行きたい(行きたい場所)]
###       │
###        ▼ (FastAPI がキャッチ)
### ┌────────────────────────────────────────────────────────┐
### │ 1. 意味の検索 (ChromaDB + OpenAI Embeddings)         │
### │   → 自分の「独自のこだわりナレッジ」から関連データを抽出 │
### ├────────────────────────────────────────────────────────┤
### │ 2. ネット検索 (Tavily API)                             │
### │   → 「2026年5月の最新トレンド」をネットから自動収集         │
### └────────────────────────────────────────────────────────┘
###        │
###        ▼ (2つの情報をガッチャンコしてプロンプトに注入)
### [OpenAI API (gpt-4o-mini)] ← 「この知識を最優先してオシャレの回答を作って！」と命令
###         │
###         ▼ (生成された賢い回答)
### [フロントエンド (Next.js)] ← 画面に美しく表示！
