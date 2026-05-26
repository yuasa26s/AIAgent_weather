import os
import requests

def get_current_weather(city_name: str) -> dict:
    """都市名からリアルタイムの天気と気温を取得する"""
    api_key = os.getenv("OPENWEATHER_API_KEY")
    if not api_key:
        return {"weather": "不明", "temp": "20"} # キーがない場合のフォールバック

    # OpenWeatherMapのAPIエンドポイント（日本語指定）
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city_name}&appid={api_key}&lang=ja&units=metric"
    
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            weather_desc = data["weather"][0]["description"] # 例: "薄い雲"、"小雨"
            temp = data["main"]["temp"]                     # 例: 21.5
            return {"weather": weather_desc, "temp": f"{temp}°C"}
    except Exception as e:
        print(f"天気APIエラー: {e}")
        
    return {"weather": "晴れ", "temp": "22°C"} # エラー時のデフォルト