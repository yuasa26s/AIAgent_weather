import os
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from dotenv import load_dotenv

# スクリプトの場所を基準に絶対パスを作成
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# 3つ上がプロジェクトルート、そこの .env
load_dotenv(os.path.join(BASE_DIR, "../../../.env"))
# 2つ上が backend、そこの chroma_db
CHROMA_DIR = os.path.join(BASE_DIR, "../../chroma_db")

def ingest_data():
    # ... (前略) ...
    embeddings = OpenAIEmbeddings()
    vectorstore = Chroma.from_documents(
        documents=docs,
        embedding=embeddings,
        persist_directory=CHROMA_DIR  # 絶対パスに変更
    )
    print("データの登録が完了しました！")