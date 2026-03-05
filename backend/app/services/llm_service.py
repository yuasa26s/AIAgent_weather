import openai
import os
from dotenv import load_dotenv
from .prompt_templates import CLOTHING_ADVICE_PROMPT

# .envからAPIキーを読み込む
load_dotenv()
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_clothing_advice(weather_data: dict):
    """
    5人目から届く天気データ(weather_data)を使って、AIアドバイスを生成する
    """
    try:
        # 1. 5人目のデータ形式から必要な情報を抜き出す
        current = weather_data.get("current", {})
        weather_list = current.get("weather", [{}])
        
        temp = current.get("temp")
        feels_like = current.get("feels_like")
        humidity = current.get("humidity")
        weather_desc = weather_list[0].get("description", "不明")

        # 2. prompt_templates.py の台本にデータを流し込む
        prompt = CLOTHING_ADVICE_PROMPT.format(
            temp=temp,
            feels_like=feels_like,
            humidity=humidity,
            weather_desc=weather_desc
        )

        # 3. OpenAI APIを呼び出す (gpt-4o-mini)
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "あなたは親切なファッションスタイリストです。"},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )

        return response.choices[0].message.content

    except Exception as e:
        return f"エラーが発生しました: {str(e)}"