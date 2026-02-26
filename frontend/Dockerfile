# Node公式イメージ
FROM node:20-alpine

# 作業ディレクトリ
WORKDIR /app

# 依存関係コピー
COPY package.json package-lock.json ./

# install
RUN npm install

# ソースコピー
COPY . .

# 開発サーバ起動
CMD ["npm", "run", "dev"]