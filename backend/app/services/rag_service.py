import os
from dotenv import load_dotenv
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from tavily import TavilyClient

# .env から環境変数を最優先でロード
load_dotenv(override=True)

# ==============================================================================
# 1. プロンプトテンプレートの定義
# ==============================================================================
# chat.py 側の .format(context=context, query=refined_query) に完全に合わせ、
# 変数を {context} と {query} の2つだけに統一している。
RAG_PROMPT_TEMPLATE = """
あなたは親しみやすくスマートなファッション・コーディネートのアドバイザーです。
以下の「独自のこだわりナレッジ（コンテキスト）」がある場合はそれを最優先し、
ない場合は一般的な知識と最新のトレンドを踏まえて、ユーザーの現在地や気候に最適な服装を提案してください。

【独自のこだわりナレッジ（コンテキスト）】
{context}

【ユーザーからの要求】
{query}

回答の構成案：
1. 現在地の天気や気温への共感・コメント
2. 今日（または指定されたシチュエーション）に最適な服装のアドバイス
3. コーディネートのワンポイント（独自のこだわりがあればそれを含める）
"""

# ==============================================================================
# 2. RAG・外部検索連携サービス関数
# ==============================================================================
def search_fashion_trends(city: str, weather_desc: str, user_query: str) -> str:
    """
    ChromaDBからの独自ナレッジ検索と、Tavilyによる最新ネット検索をブレンドして
    LLMに渡すためのコンテキスト（背景知識）を生成する関数
    """
    context_parts = []

    # --------------------------------------------------------------------------
    # 2-1. ChromaDB（ベクトルデータベース）から独自ナレッジの検索
    # --------------------------------------------------------------------------
    persist_directory = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "chroma")
    
    if os.path.exists(persist_directory):
        try:
            # OpenAIの埋め込みモデルを初期化
            embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))
            
            # ChromaDBのロード
            vector_store = Chroma(
                persist_directory=persist_directory,
                embedding_function=embeddings
            )
            
            # ユーザーの質問や都市名、天気を組み合わせて類似度検索
            search_keyword = f"{city} {weather_desc} {user_query}"
            docs = vector_store.similarity_search(search_keyword, k=2)
            
            if docs:
                context_parts.append("--- データベース内の独自ナレッジ ---")
                for doc in docs:
                    context_parts.append(doc.page_content)
        except Exception as e:
            print(f"【INFO】ChromaDB検索スキップ（データ未投入、または初期化前）: {e}")
    else:
        print(f"【INFO】ChromaDBのディレクトリが見つかりません。検索をスキップします。")

    # --------------------------------------------------------------------------
    # 2-2. Tavily APIによるリアルタイムWeb検索
    # --------------------------------------------------------------------------
    tavily_key = os.getenv("TAVILY_API_KEY")
    if tavily_key:
        try:
            tavily_client = TavilyClient(api_key=tavily_key)
            
            # 「2026年5月 横浜 天気:小雨, 気温:18°C 服装 コーディネート」のような最新クエリを自動生成
            search_query = f"2026年5月 {city} {weather_desc} ファッション 服装 コーディネート"
            
            # AI特化型の検索を実行
            response = tavily_client.search(query=search_query, max_results=2)
            
            if response and "results" in response:
                context_parts.append("\n--- 最新のネット検索情報 ---")
                for result in response["results"]:
                    context_parts.append(f"ソース: {result['url']}")
                    context_parts.append(f"概要: {result['content']}\n")
        except Exception as e:
            print(f"【INFO】Tavily検索エラー、または制限によりスキップ: {e}")

    # --------------------------------------------------------------------------
    # 2-3. 取得した情報の統合
    # --------------------------------------------------------------------------
    if context_parts:
        return "\n".join(context_parts)
    else:
        return "独自のこだわりナレッジおよび最新のネット検索結果はありません。"