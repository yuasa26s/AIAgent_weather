import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="db",  # docker-composeのサービス名
        user="app_user",
        password="password",
        database="app_db"
    )