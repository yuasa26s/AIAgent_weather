import os
from tavily import TavilyClient
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma

# システム環境変数の古い記憶を無視して、.envの最新の値を強制上書きロードする
load_dotenv(override=True)

# 各種設定
tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

# ChromaDBのディレクトリ（絶対パスで確実に指定）
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CHROMA_DIR = os.path.join(BASE_DIR, "../../chroma_db")

def get_local_knowledge(query: str):
    """ChromaDBから独自の豆知識を検索"""
    try:
        # .env から確実に「本物のキー」を取り出す
        api_key = os.getenv("OPENAI_API_KEY")
        
        # 明示的に openai_api_key を渡すことで、LangChain内部がOSの古い記憶を見に行くのを完全に防ぎます
        embeddings = OpenAIEmbeddings(openai_api_key=api_key)
        
        vectorstore = Chroma(persist_directory=CHROMA_DIR, embedding_function=embeddings)
        
        # 関連度が高い順に2件取得
        docs = vectorstore.similarity_search(query, k=2)
        return "\n".join([doc.page_content for doc in docs])
    except Exception as e:
        print(f"ChromaDB検索エラー: {e}")
        return ""

def search_fashion_trends(city: str, weather_desc: str, user_query: str):
    """ウェブ情報と独自知識を統合し、AIに渡すコンテキストを作成"""
    # 検索クエリを具体化（季節のズレを防ぐため）
    search_query = f"2026年5月 {city} {weather_desc} ファッション トレンド オシャレ"
    
    try:
        # 1. Tavily検索（ネットの最新情報）
        response = tavily.search(query=search_query, search_depth="basic", max_results=3)
        web_context = "\n".join([result['content'] for result in response['results']])
        
        # 2. ローカル豆知識検索（あなたのこだわり）
        local_context = get_local_knowledge(user_query)
        
        # 3. 構造化して返却
        return f"【独自のこだわりナレッジ】\n{local_context}\n\n【ネットの最新トレンド】\n{web_context}"
    except Exception as e:
        print(f"検索エラー: {e}")
        return "情報を取得できませんでした。"

# --- AIへの命令テンプレート（厳格化バージョン） ---
RAG_PROMPT_TEMPLATE = """
あなたは、ユーザーに最高のオシャレ体験を提供するプロのファッションアドバイザーです。
以下の【ナレッジ】を読み、**特に「独自のこだわりナレッジ」の内容を最優先して**回答を作成してください。

### 回答のルール:
1. **独自ナレッジの絶対優先**: 
   【独自のこだわりナレッジ】に具体的な記述（例：居酒屋での靴の選び方、マナー、特定のアイテムの注意点など）がある場合、それを回答の主軸にしてください。
2. **季節の整合性**: 
   現在は **2026年5月** です。ネット情報に厚手のコートやブーツなど、季節に合わない内容が含まれている場合は、それを無視するか「5月には暑すぎる」と注意を促してください。
3. **具体的な提案**: 
   単なるトレンド紹介ではなく、「〜なので、〜にするのがスマートです」といった、ユーザーがすぐに行動できるアドバイスをしてください。

---
【ナレッジ】
{context}

【ユーザーからの質問】
{query}
---

アドバイス：
"""