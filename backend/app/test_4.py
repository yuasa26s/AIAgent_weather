# backend/app/test_4.py
import sys
import os

# フォルダの読み込み設定
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.llm_service import get_clothing_advice

# 5人目から届いた本物のデータサンプル
mock_weather_data = {
    "current": {
        "temp": 9.3,
        "feels_like": 4.47,
        "humidity": 48,
        "weather": [{"description": "薄い雲"}]
    }
}

print("--- AIアドバイス生成テスト開始 ---")
try:
    # あなたが作った関数を呼び出す
    advice = get_clothing_advice(mock_weather_data)
    print("\n【AIからの回答】")
    print(advice)
    print("\n--------------------------------")
    print("✅ 成功！ロジックは正常に動いています。")
except Exception as e:
    print(f"❌ エラー発生: {e}")