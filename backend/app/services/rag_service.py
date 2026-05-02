import os
from tavily import TavilyClient
from dotenv import load_dotenv

load_dotenv()

# 5人目が.envに追加してくれるTAVILY_API_KEYを使用
tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

def search_fashion_trends(city: str, weather_desc: str):
    """
    Tavilyを使って、特定の地域や天気に合わせた最新ファッション情報を検索する
    """
    query = f"2026年3月 {city} {weather_desc} 服装 トレンド オシャレ"
    
    try:
        # AIに特化した検索を実行（contextを取得）
        # search_depth="advanced" にするとより深く調べられますが、まずは基本でOK
        response = tavily.search(query=query, search_depth="basic", max_results=3)
        
        # 検索結果の「内容（content）」だけを繋げて、AIが読みやすい形にする
        context = "\n".join([result['content'] for result in response['results']])
        return context
    except Exception as e:
        print(f"Tavily検索中にエラーが発生しました: {e}")
        return "検索結果を取得できませんでした。"