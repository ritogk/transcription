# フロントエンド完結で文字起こしが行えるwebアプリケーション
https://transcription.homisoftware.net/index.html
|  LP  |  APP  |
| ---- | ---- |
|  ![image](https://user-images.githubusercontent.com/72111956/218292326-e271f8a6-18ae-4419-a536-7106d991fa42.png)  |  ![image](https://user-images.githubusercontent.com/72111956/226536066-bf784c33-996a-434a-9353-17373413745c.png)  |

## このアプリケーションは何？
[whisper](https://github.com/ggerganov/whisper.cpp/tree/master/examples/whisper.wasm)と[ffmepg](https://github.com/ffmpegwasm/ffmpeg.wasm)をブラウザで動かしてフロントエンド完結で文字起こしができるアプリケーション

## 技術記事
https://zenn.dev/homing/articles/9ea769ab12f310

## 良い点
メディアファイルの変換と文字起こしの処理をサーバではなくブラウザで実行しているのでサーバー代がかからない。  
利用側はlinuxの知識無しで最新の文字起こしが使える。

## 悪い点
CのコードをWebAssemblyにコンパイルしたコードを使っているためメンテにCの知識が必要。  
フロント側でほぼすべて完結しているので簡単にアプリがパクられる。

## setup
### 1.インフラ生成と更新
```
cd cdk
cp .env.base .env
cdk deploy --all
```

### 2.ファイルを配置
1. src配下のファイルをバケットに突っ込む  
2. modelsはファイルサイズが大きいのでここから持ってきて手動で入れる(ファイルサイズがお大きいのでgit管理はしない。)  
https://huggingface.co/ggerganov/whisper.cpp/tree/main  
3. CloudFrontのキャッシュを更新  

## インフラのあとかたずけ
1. バケットの中身を空にする  
```
cd cdk
cdk destroy --all
```
