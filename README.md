# フロントエンド完結で文字起こしが行えるwebアプリケーション
https://transcription.homisoftware.net/index.html
|  LP  |  APP  |
| ---- | ---- |
|  ![image](https://user-images.githubusercontent.com/72111956/218292326-e271f8a6-18ae-4419-a536-7106d991fa42.png)  |  ![image](https://user-images.githubusercontent.com/72111956/226536066-bf784c33-996a-434a-9353-17373413745c.png)  |

## なにこれ
[whisper](https://github.com/ggerganov/whisper.cpp/tree/master/examples/whisper.wasm)と[ffmepg](https://github.com/ffmpegwasm/ffmpeg.wasm)を組み合わせてフロントエンド完結で文字起こしができるアプリケーション

## 良い事
メディアファイルの変換, 文字起こしの処理をサーバー側ではなくブラウザ側で実行しているのでサーバー代がかからない。  
linuxの知識無しで文字起こしが行える。

## 悪い事
CからWebAssemblyに変換したコードを使っているためメンテナンスしにくい。  
Cのコードを理解していないのでwebブラウザで仕様変更があった時に対応できない。  
フロント側でほぼすべて完結しているので簡単にアプリがパクられる。
