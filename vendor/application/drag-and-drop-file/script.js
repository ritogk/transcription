// Drag and drop - single or multiple image files
// https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
// https://codepen.io/joezimjs/pen/yPWQbd?editors=1000
const createDragAndDropFile = () => {
  const preventDefaults = (event) => {
    // ブラウザの規定の動きを止める
    event.preventDefault()
    // イベントの伝達を止める
    event.stopPropagation()
  }

  const highlight = (event) => event.target.classList.add("highlight")

  const unhighlight = (event) => event.target.classList.remove("highlight")

  const getInputAndGalleryRefs = (element) => {
    const zone = element.closest(".upload_dropZone") || false
    const gallery = zone.querySelector(".upload_gallery") || false
    const input = zone.querySelector('input[type="file"]') || false
    return { input: input, gallery: gallery }
  }

  const handleDrop = (event) => {
    const dataRefs = getInputAndGalleryRefs(event.target)
    dataRefs.files = event.dataTransfer.files
    // ドラッグしたファイルをfileに突っ込む
    dataRefs.input.files = dataRefs.files
    // つっこんだだけだとイベントが発火しないので発火
    dataRefs.input.dispatchEvent(new Event("change"))
  }

  const eventHandlers = (zone) => {
    const dataRefs = getInputAndGalleryRefs(zone)
    if (!dataRefs.input) return // Prevent default drag behaviors
    ;["dragenter", "dragover", "dragleave", "drop"].forEach((event) => {
      zone.addEventListener(event, preventDefaults, false)
      document.body.addEventListener(event, preventDefaults, false)
    })

    // Highlighting drop area when item is dragged over it
    ;["dragenter", "dragover"].forEach((event) => {
      zone.addEventListener(event, highlight, false)
    })
    ;["dragleave", "drop"].forEach((event) => {
      zone.addEventListener(event, unhighlight, false)
    })

    // Handle dropped files
    zone.addEventListener("drop", handleDrop, false)

    // Handle browse selected files
    dataRefs.input.addEventListener(
      "change",
      (event) => {
        dataRefs.files = event.target.files
        handleFiles(dataRefs)
      },
      false
    )
  }

  // Initialise ALL dropzones
  const dropZones = document.querySelectorAll(".upload_dropZone")
  for (const zone of dropZones) {
    eventHandlers(zone)
  }

  const isImageFile = (file) => {
    return ["audio/", "video/"].some((x) => {
      return file.type.indexOf(x) === 0
    })
  }

  function previewFiles(dataRefs) {
    if (!dataRefs.gallery) return
    // multipleを有効化させる場合は以下の１行を消す
    dataRefs.gallery.innerHTML = ""

    for (const file of dataRefs.files) {
      const span = document.createElement("span")
      const i = document.createElement("i")
      i.style.marginRight = "5px"
      span.innerText = file.name
      if (file.type.indexOf("audio/") !== -1) {
        i.classList.add("fa", "fa-file-audio")
      } else if (file.type.indexOf("video/") !== -1) {
        i.classList.add("fa", "fa-file-video")
      }
      span.prepend(i)
      dataRefs.gallery.appendChild(span)
    }
  }

  // Handle both selected and dropped files
  const handleFiles = (dataRefs) => {
    if (dataRefs.files[0].size > 2000000000) {
      alert("ファイルサイズが2Gを超えています。")
      preventDefaults()
      return
    }

    let files = [...dataRefs.files]
    // Remove unaccepted file types
    files = files.filter((item) => {
      if (!isImageFile(item)) {
        console.log("Not an audio or video, ", item.type)
      }
      return isImageFile(item) ? item : null
    })

    if (!files.length) return
    dataRefs.files = files

    previewFiles(dataRefs)
  }
}
