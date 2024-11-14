FROM node:18

# 作業ディレクトリを設定
WORKDIR /app

# パッケージファイルをコピー
COPY package.json package-lock.json ./

# 依存関係をインストール
RUN npm install

# ソースコードをコピー
COPY . .

# ビルド（必要に応じて）
RUN npm run build

# ポートを公開
EXPOSE 3000

# アプリケーションを起動
CMD ["npm", "run", "dev"]
