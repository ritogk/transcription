export class Transcode {
  #ffmpeg = null
  #fetchFile = null
  #transcodedBlobUrl = ""
  #onProgressTranscode = () => {}
  #callbackCompleteTranscode = () => {}

  constructor(FFmpeg, onProgressTranscode, callbackCompleteTranscode) {
    this.#onProgressTranscode = onProgressTranscode
    this.#callbackCompleteTranscode = callbackCompleteTranscode
    this.#setup(FFmpeg)
  }

  #setup = (FFmpeg) => {
    var txt = document.getElementById("log")
    const { createFFmpeg, fetchFile } = FFmpeg
    this.#fetchFile = fetchFile
    this.#ffmpeg = createFFmpeg({
      log: true,
      logger: ({ message }) => {
        //txt.value += "\n" + message
      },
    })
    this.#ffmpeg.setProgress(this.#onProgressTranscode)
    const elm = document.getElementById("upload_image_background")
    elm.addEventListener("change", this.#transcode)
  }

  #transcode = async ({ target: { files } }) => {
    document.getElementById("spinnerTranscode").style.display = ""
    // const message = document.getElementById("message")
    const extension = files[0].name.split(".")[1]
    const name = `file.${extension}`
    // message.innerHTML = "ffmpegのロード"
    await this.#ffmpeg.load()
    this.#ffmpeg.FS("writeFile", name, await this.#fetchFile(files[0]))
    // message.innerHTML = "wavの16khzに変換中"
    await this.#ffmpeg.run(
      "-i",
      name,
      "-ar",
      "16000",
      "-ac",
      "1",
      "-c:a",
      "pcm_s16le",
      "output.wav"
    )

    // message.innerHTML = "完了"
    const data = this.#ffmpeg.FS("readFile", "output.wav")

    // メモリに保存されたblobにアクセスできるURLを作成
    const blobUrl = URL.createObjectURL(
      new Blob([data.buffer], { type: "audio/wav" })
    )

    this.#transcodedBlobUrl = blobUrl

    this.#callbackCompleteTranscode()
  }

  getTranscodedBlobUrl = () => {
    return this.#transcodedBlobUrl
  }
}
