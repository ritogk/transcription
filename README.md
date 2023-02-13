# サーバーレスで文字起こしが行えるwebアプリケーション
https://transcription.homisoftware.net/index.html
|  LP  |  APP  |
| ---- | ---- |
|  ![image](https://user-images.githubusercontent.com/72111956/218292326-e271f8a6-18ae-4419-a536-7106d991fa42.png)  |  ![image](https://user-images.githubusercontent.com/72111956/218292331-02b9bbe7-740f-4bd1-9998-c40d5292a625.png)  |

## なにこれ
[whisper](https://github.com/ggerganov/whisper.cpp/tree/master/examples/whisper.wasm)と[ffmepg](https://github.com/ffmpegwasm/ffmpeg.wasm)を組み合わせてwebブラウザ上で簡単に文字起こしができるアプリケーション

## 良い事
メディアファイルの変換, 文字起こしの処理をサーバー側ではなくブラウザ側で実行するようにしたのでサーバー代が浮いた。  
linuxの知識無しで文字起こしが行える。

## 悪い事
whisperとffmpegのコードはc言語のコードをjavascriptにビルドした物を使っているのでメンテナンスがしにくい。  
フロント側でほぼすべて完結しているので簡単にアプリがパクられる。
