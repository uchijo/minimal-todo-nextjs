# todoアプリ

## 機能など

todoアプリです。
ログインが必須となっており、複数ユーザで利用できます。
各ユーザは自分のtodoのみ閲覧可能で、他の人のtodoを見ることはできません。
作成と削除のみたいおうしています。

## 使い方

以下の環境変数を設定してください。

- prismaのdb接続先
  - DATABASE_URL
- Auth0の設定
  - AUTH0_SECRET
  - AUTH0_BASE_URL
  - AUTH0_ISSUER_BASE_URL
  - AUTH0_CLIENT_ID
  - AUTH0_CLIENT_SECRET

なお、prismaに関してはsqlite3を使用しています。

これらを設定した上で以下のコマンドを使用することでデプロイ可能です。

```bash
npm install && npx prisma migrate deploy && npm run build && npm run start
```
