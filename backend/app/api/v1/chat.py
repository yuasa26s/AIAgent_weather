import os
import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from app.services.rag_service import search_fashion_trends, RAG_PROMPT_TEMPLATE

# .env から最新の環境変数を強制ロード（上書きモード）
load_dotenv(override=True)

router = APIRouter()

# --------------------------------------------------------------------------
# 1. リクエストボディの定義
# --------------------------------------------------------------------------
class ChatRequest(BaseModel):
    message: str
    city: str = "東京"
    weather: str = "晴れ"

# --------------------------------------------------------------------------
# 2. リアルタイム天気取得関数（文字列クレンジング強化版）
# --------------------------------------------------------------------------
def get_realtime_weather(city_name: str) -> dict:
    """
    OpenWeatherMap APIを利用して、都市名からリアルタイムの天気と気温を取得する関数。
    「神奈川県横浜市」のような複雑な漢字表記から余計な文字列を削ぎ落としてヒット率を最大化します。
    """
    api_key = os.getenv("OPENWEATHER_API_KEY")
    
    # APIキーが未設定の場合の安全弁
    if not api_key:
        print("【INFO】OPENWEATHER_API_KEY が未設定です。デフォルトの気候を使用します。")
        return {"desc": "快適な晴れ", "temp": "22°C"}

    # 💡 改善の核心：広域な都道府県名を先に一括カットし、その後に市区町村の単位を削る。
    clean_city = city_name
    
    # 1. 都道府県名のカット
    for prefecture in ["神奈川県", "東京都", "大阪府", "京都府", "北海道", "兵庫県", "福岡県", "愛知県"]:
        clean_city = clean_city.replace(prefecture, "")
        
    # 2. 末尾の行政単位のカット
    for unit in ["県", "市", "区", "町", "村"]:
        clean_city = clean_city.replace(unit, "")
    
    # この時点で「神奈川県横浜市」であれば「横浜」だけが綺麗に残る

    # 主要都市の英語名マッピング（漢字でヒットしない場合の対策）
    city_mapping = {
        "東京": "Tokyo", "横浜": "Yokohama", "大阪": "Osaka", "名古屋": "Nagoya", 
        "札幌": "Sapporo", "福岡": "Fukuoka", "京都": "Kyoto", "神戸": "Kobe"
    }
    search_query = city_mapping.get(clean_city, clean_city)

    # OpenWeatherMap エンドポイント
    url = f"https://api.openweathermap.org/data/2.5/weather?q={search_query}&appid={api_key}&lang=ja&units=metric"
    
    try:
        response = requests.get(url, timeout=5)
        
        # APIキーのアクティベート待ち（1〜2時間）のハンドリング
        if response.status_code in [401, 403]:
            print(f"【⚠️注意】OpenWeatherMapが {response.status_code} を返しました。アカウント有効化待ちの可能性があります。")
            return {"desc": "快適な気候", "temp": "22°C"}
            
        if response.status_code == 200:
            data = response.json()
            weather_desc = data["weather"][0]["description"]  # 例: "薄い雲", "小雨"
            temp_cel = data["main"]["temp"]                  # 例: 18.5
            print(f"【API成功】OpenWeatherMapからデータを取得しました（検索クエリ: {search_query}）")
            return {"desc": weather_desc, "temp": f"{int(round(temp_cel))}°C"}
            
        # 404などのエラーが起きた場合のデバッグログ
        print(f"【INFO】天気取得エラー（Status: {response.status_code}）検索クエリ: {search_query}")
    except Exception as e:
        print(f"【INFO】天気API通信エラー: {e}")
        
    # 通信エラーや404時はシステムを落とさず安全なフォールバック値を返す
    return {"desc": "晴れ", "temp": "22°C"}

# --------------------------------------------------------------------------
# 3. OpenAI LLMの初期化
# --------------------------------------------------------------------------
llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.7,
    openai_api_key=os.getenv("OPENAI_API_KEY")
)

# --------------------------------------------------------------------------
# 4. チャットエンドポイント（メインロジック）
# --------------------------------------------------------------------------
@router.post("/chat")
def chat(request: ChatRequest):
    try:
        # フロントからの入力メッセージの存在チェック
        user_message = getattr(request, "message", "")
        if not user_message:
            print("【⚠️警告】フロントから受け取ったメッセージが空です。")
            return {"response": "メッセージが空になっています。何か入力してくださいね！"}

        # 都市名の取得とバリデーション（空文字や「自動取得中」であれば東京にフォールバック）
        input_city = getattr(request, "city", "東京")
        if not input_city or input_city == "自動取得中":
            input_city = "東京"

        print(f"--- [デバッグ開始] ---")
        print(f"ユーザーメッセージ: {user_message}")
        print(f"解析された現在地: {input_city}")

        # 4-1. 強化されたクレンジング関数でリアルタイムの天気を自動取得
        weather_info = get_realtime_weather(input_city)
        real_weather = weather_info.get("desc", "晴れ")
        real_temp = weather_info.get("temp", "22°C")
        
        weather_string = f"天気:{real_weather}, 気温:{real_temp}"
        print(f"取得されたリアルタイム気候: {weather_string}")

        # 4-2. 自動検知した都市と本物の気候をRAG（ChromaDB/Tavily）に引き渡す
        context = search_fashion_trends(
            city=input_city,
            weather_desc=weather_string,
            user_query=user_message
        )
        
        # 4-3. プロンプトテンプレートに情報をブレンド
        refined_query = f"現在地は「{input_city}」で、今の気候は「{real_weather}（気温 {real_temp}）」です。これらを踏まえて質問に答えてください：{user_message}"
        
        final_prompt = RAG_PROMPT_TEMPLATE.format(
            context=context,
            query=refined_query
        )
        
        # 4-4. OpenAIにリクエストを投げて回答を生成
        response = llm.invoke(final_prompt)
        
        # 4-5. 返却値のコンテンツを安全に抽出
        ai_reply = response.content if hasattr(response, "content") else str(response)
        
        if not ai_reply or not ai_reply.strip():
            ai_reply = f"【AIエージェント通知】{input_city}の気候に基づいた最適な服装を計算しましたが、回答テキストの生成に失敗しました。お手数ですがもう一度送信してください。"

        print(f"AIの生成回答（先頭50文字）: {ai_reply[:50]}...")
        print(f"--- [デバッグ完了] ---")
        
        return {"response": ai_reply}
        
    except Exception as e:
        print(f"【🔥重大エラー】Chat API内部で例外が発生しました: {e}")
        return {"response": f"バックエンドの処理中にエラーが発生しました。詳細システムログ: {str(e)}"}