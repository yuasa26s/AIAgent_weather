import os
import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from app.services.rag_service import search_fashion_trends, RAG_PROMPT_TEMPLATE

# .env から最新の環境変数を強制ロード（上書きモード）
load_dotenv(override=True)

router = APIRouter()

# ==========================================================================
# 1. スキーム（リクエストボディ）の定義・修正
# ==========================================================================
class ChatRequest(BaseModel):
    message: str
    city: str = "東京"
    weather: str = "晴れ"
    
    # 💡 改善の核心：フロントエンド（Next.js）側のお天気カードが保持している
    # OpenWeatherMap等の生のJSONデータを、丸ごとオプショナルで受け取れるように拡張
    weather_data: Optional[Dict[str, Any]] = None

# ==========================================================================
# 2. リアルタイム天気取得関数（フロントからデータが来ない場合のセーフティネット）
# ==========================================================================
def get_realtime_weather(city_name: str) -> dict:
    """
    OpenWeatherMap APIを利用して、都市名からリアルタイムの天気と気温を取得する関数。
    ※フロントから weather_data が送られてこなかった場合のバックアップとして維持します。
    """
    api_key = os.getenv("OPENWEATHER_API_KEY")
    
    if not api_key:
        print("【INFO】OPENWEATHER_API_KEY が未設定です。デフォルトの気候を使用します。")
        return {"desc": "快適な晴れ", "temp": "22°C", "temp_max": "22°C", "temp_min": "15°C"}

    clean_city = city_name
    for prefecture in ["神奈川県", "東京都", "大阪府", "京都府", "北海道", "兵庫県", "福岡県", "愛知県"]:
        clean_city = clean_city.replace(prefecture, "")
        
    for unit in ["県", "市", "区", "町", "村"]:
        clean_city = clean_city.replace(unit, "")
    
    city_mapping = {
        "東京": "Tokyo", "横浜": "Yokohama", "大阪": "Osaka", "名古屋": "Nagoya", 
        "札幌": "Sapporo", "福岡": "Fukuoka", "京都": "Kyoto", "神戸": "Kobe"
    }
    search_query = city_mapping.get(clean_city, clean_city)

    url = f"https://api.openweathermap.org/data/2.5/weather?q={search_query}&appid={api_key}&lang=ja&units=metric"
    
    try:
        response = requests.get(url, timeout=5)
        if response.status_code in [401, 403]:
            return {"desc": "快適な気候", "temp": "22°C", "temp_max": "22°C", "temp_min": "15°C"}
            
        if response.status_code == 200:
            data = response.json()
            weather_desc = data["weather"][0]["description"]
            temp_cel = data["main"]["temp"]
            temp_max = data["main"].get("temp_max", temp_cel)
            temp_min = data["main"].get("temp_min", temp_cel)
            
            print(f"【API成功】バックエンドでOpenWeatherMapからデータを取得しました（クエリ: {search_query}）")
            return {
                "desc": weather_desc, 
                "temp": f"{int(round(temp_cel))}°C",
                "temp_max": f"{int(round(temp_max))}°C",
                "temp_min": f"{int(round(temp_min))}°C"
            }
    except Exception as e:
        print(f"【INFO】天気API通信エラー: {e}")
        
    return {"desc": "晴れ", "temp": "22°C", "temp_max": "22°C", "temp_min": "15°C"}

# ==========================================================================
# 3. OpenAI LLMの初期化
# ==========================================================================
llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.7,
    openai_api_key=os.getenv("OPENAI_API_KEY")
)

# ==========================================================================
# 4. ルーティング処理（メインロジックエンドポイント）の修正
# ==========================================================================
@router.post("/chat")
def chat(request: ChatRequest):
    try:
        # 4-1. フロントからの入力メッセージの存在チェック
        user_message = getattr(request, "message", "")
        if not user_message:
            print("【⚠️警告】フロントから受け取ったメッセージが空です。")
            return {"response": "メッセージが空になっています。何か入力してくださいね！"}

        # 4-2. 都市名の取得とバリデーション（空文字や「自動取得中」であれば東京にフォールバック）
        input_city = getattr(request, "city", "東京")
        if not input_city or input_city == "自動取得中":
            input_city = "東京"

        print(f"\n--- [デバッグ開始] ---")
        print(f"ユーザーメッセージ: {user_message}")
        print(f"解析された現在地: {input_city}")

        # 💡 改善の核心: フロントからお天気JSONが届いているか確認し、あればそちらを最優先で使用（データ完全同期）
        if request.weather_data and "main" in request.weather_data:
            print("【データ同期】フロントエンドから送信されたリアルタイム天気データを検知しました。")
            wd = request.weather_data
            
            # 天気説明の抽出（フロントから渡されるOpenWeatherMapの構造に対応）
            real_weather = wd.get("weather", [{}])[0].get("description", request.weather)
            
            # 各種気温の抽出と四捨五入処理
            main_data = wd["main"]
            real_temp = f"{int(round(main_data.get('temp', 22)))}°C"
            real_max = f"{int(round(main_data.get('temp_max', 22)))}°C"
            real_min = f"{int(round(main_data.get('temp_min', 15)))}°C"
            
        else:
            # フロントからデータが届いていない、または構造が異なる場合はバックエンドで直接取得（安全弁）
            print("【フォールバック】フロントから天気データが届いていないため、バックエンドでAPIを叩きます。")
            weather_info = get_realtime_weather(input_city)
            real_weather = weather_info.get("desc", "晴れ")
            real_temp = weather_info.get("temp", "22°C")
            real_max = weather_info.get("temp_max", "22°C")
            real_min = weather_info.get("temp_min", "15°C")
        
        # 4-3. RAGやプロンプトに引き渡す統合気候コンテキストの作成（最高・最低気温もしっかり明記）
        weather_string = f"天気:{real_weather}, 現在気温:{real_temp}, 最高気温:{real_max}, 最低気温:{real_min}"
        print(f"【確定気候コンテキスト】: {weather_string}")

        # 4-4. 自動検知した都市と完全に同期された本物の気候情報をRAGサービスに引き渡す
        context = search_fashion_trends(
            city=input_city,
            weather_desc=weather_string,
            user_query=user_message
        )
        
        # 4-5. プロンプトテンプレートに情報をブレンド
        refined_query = (
            f"現在地は「{input_city}」です。\n"
            f"画面に表示されている正確なリアルタイム気象データは以下の通りです：\n"
            f"- 天気: {real_weather}\n"
            f"- 現在の気温: {real_temp}\n"
            f"- 本日の最高気温: {real_max}\n"
            f"- 本日の最低気温: {real_min}\n"
            f"これら画面上のデータと寸分の狂いもないように整合性を取りつつ、ユーザーの質問に答してください：{user_message}"
        )
        
        final_prompt = RAG_PROMPT_TEMPLATE.format(
            context=context,
            query=refined_query
        )
        
        # 4-6. OpenAIにリクエストを投げて回答を生成
        response = llm.invoke(final_prompt)
        
        # 4-7. 返却値のコンテンツを安全に抽出
        ai_reply = response.content if hasattr(response, "content") else str(response)
        
        if not ai_reply or not ai_reply.strip():
            ai_reply = f"【AIエージェント通知】{input_city}の気候に基づいた最適な服装を計算しましたが、回答テキストの生成に失敗しました。お手数ですがもう一度送信してください。"

        print(f"AIの生成回答（先頭50文字）: {ai_reply[:50]}...")
        print(f"--- [デメインロジック完了] ---\n")
        
        return {"response": ai_reply}
        
    except Exception as e:
        print(f"【🔥重大エラー】Chat API内部で例外が発生しました: {e}")
        return {"response": f"バックエンドの処理中にエラーが発生しました。詳細システムログ: {str(e)}"}