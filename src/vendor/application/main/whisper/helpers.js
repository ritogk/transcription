function setAudio(audio) {}

var Module = {
  print: printTextarea,
  printErr: printTextarea,
  setStatus: function (text) {
    printTextarea("js: " + text)
  },
  monitorRunDependencies: function (left) {},
}

storeFS = (fname, buf, completedFunc) => {
  // write to WASM file using FS_createDataFile
  // if the file exists, delete it
  try {
    Module.FS_unlink(fname)
  } catch (e) {
    // ignore
  }

  Module.FS_createDataFile("/", fname, buf, true, true)

  model_whisper = fname

  // document.getElementById("model-whisper-status").innerHTML =
  //   'loaded "' + model_whisper + '"!'

  printTextarea("storeFS: stored model: " + fname + " size: " + buf.length)
  // 完了処理
  completedFunc()
}

// web audio context
var context = null

// the whisper instance
var model_whisper = ""

// helper function
function convertTypedArray(src, type) {
  var buffer = new ArrayBuffer(src.byteLength)
  var baseView = new src.constructor(buffer).set(src)
  return new type(buffer)
}

let dbVersion = 1
let dbName = "whisper.ggerganov.com"
let indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB

window.AudioContext = window.AudioContext || window.webkitAudioContext
window.OfflineAudioContext =
  window.OfflineAudioContext || window.webkitOfflineAudioContext

cbProgress = function (p) {
  console.log(Math.round(100 * p) + "%")
}

function convertTypedArray(src, type) {
  var buffer = new ArrayBuffer(src.byteLength)
  var baseView = new src.constructor(buffer).set(src)
  return new type(buffer)
}

cbCancel = function () {
  var el
  el = document.getElementById("fetch-whisper-tiny-en")
  if (el) el.style.display = "inline-block"
  el = document.getElementById("fetch-whisper-base-en")
  if (el) el.style.display = "inline-block"
  el = document.getElementById("fetch-whisper-small-en")
  if (el) el.style.display = "inline-block"
  el = document.getElementById("fetch-whisper-tiny")
  if (el) el.style.display = "inline-block"
  el = document.getElementById("fetch-whisper-base")
  if (el) el.style.display = "inline-block"
  el = document.getElementById("fetch-whisper-small")
  if (el) el.style.display = "inline-block"
  el = document.getElementById("whisper-file")
  if (el) el.style.display = "inline-block"
  el = document.getElementById("model-whisper-status")
  if (el) el.innerHTML = ""
}

var printTextarea = (function () {
  var element = document.getElementById("output")
  if (element) element.alue = "" // clear browser cache
  return function (text) {
    if (arguments.length > 1)
      text = Array.prototype.slice.call(arguments).join(" ")
    console.log(text)
    if (element) {
      element.value += text + "\n"
      element.scrollTop = element.scrollHeight // focus on bottom
    }
  }
})()

// ↑ global

async function clearCache() {
  if (
    confirm(
      "Are you sure you want to clear the cache?\nAll the models will be downloaded again."
    )
  ) {
    indexedDB.deleteDatabase(dbName)
  }
}

// fetch a remote file from remote URL using the Fetch API
async function fetchRemote(url, cbProgress, cbPrint) {
  cbPrint("fetchRemote: downloading with fetch()...")

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/octet-stream",
    },
  })

  if (!response.ok) {
    cbPrint("fetchRemote: failed to fetch " + url)
    return
  }

  const contentLength = response.headers.get("content-length")
  const total = parseInt(contentLength, 10)
  const reader = response.body.getReader()

  var chunks = []
  var receivedLength = 0
  var progressLast = -1

  while (true) {
    const { done, value } = await reader.read()

    if (done) {
      break
    }

    chunks.push(value)
    receivedLength += value.length

    if (contentLength) {
      cbProgress(receivedLength / total)

      var progressCur = Math.round((receivedLength / total) * 10)
      if (progressCur != progressLast) {
        cbPrint("fetchRemote: fetching " + 10 * progressCur + "% ...")
        progressLast = progressCur
      }
    }
  }

  var position = 0
  var chunksAll = new Uint8Array(receivedLength)

  for (var chunk of chunks) {
    chunksAll.set(chunk, position)
    position += chunk.length
  }

  return chunksAll
}

// load remote data
// - check if the data is already in the IndexedDB
// - if not, fetch it from the remote URL and store it in the IndexedDB
function loadRemote(
  url,
  dst,
  size_mb,
  onProgress,
  cbReady,
  cbCancel,
  cbPrint,
  completeFunc
) {
  if (!onProgress) {
    onProgress = window.cbProgress
  }
  if (!cbReady) {
    cbReady = storeFS
  }
  if (!cbCancel) {
    cbCancel = window.cbCancel
  }

  if (!cbPrint) {
    cbPrint = printTextarea
  }
  // query the storage quota and print it
  navigator.storage.estimate().then(function (estimate) {
    cbPrint("loadRemote: storage quota: " + estimate.quota + " bytes")
    cbPrint("loadRemote: storage usage: " + estimate.usage + " bytes")
  })

  // check if the data is already in the IndexedDB
  var rq = indexedDB.open(dbName, dbVersion)

  rq.onupgradeneeded = function (event) {
    var db = event.target.result
    if (db.version == 1) {
      var os = db.createObjectStore("models", { autoIncrement: false })
      cbPrint(
        "loadRemote: created IndexedDB " + db.name + " version " + db.version
      )
    } else {
      // clear the database
      var os = event.currentTarget.transaction.objectStore("models")
      os.clear()
      cbPrint(
        "loadRemote: cleared IndexedDB " + db.name + " version " + db.version
      )
    }
  }

  rq.onsuccess = function (event) {
    var db = event.target.result
    var tx = db.transaction(["models"], "readonly")
    var os = tx.objectStore("models")
    var rq = os.get(url)

    rq.onsuccess = function (event) {
      if (rq.result) {
        // ★モデルを強制的に更新
        // if (false) {
        cbPrint('loadRemote: "' + url + '" is already in the IndexedDB')
        cbReady(dst, rq.result, completeFunc)
      } else {
        // data is not in the IndexedDB
        cbPrint('loadRemote: "' + url + '" is not in the IndexedDB')

        fetchRemote(url, onProgress, cbPrint).then(function (data) {
          if (data) {
            // store the data in the IndexedDB
            var rq = indexedDB.open(dbName, dbVersion)
            rq.onsuccess = function (event) {
              var db = event.target.result
              var tx = db.transaction(["models"], "readwrite")
              var os = tx.objectStore("models")
              var rq = os.put(data, url)

              rq.onsuccess = function (event) {
                cbPrint('loadRemote: "' + url + '" stored in the IndexedDB')
                cbReady(dst, data, completeFunc)
              }

              rq.onerror = function (event) {
                cbPrint(
                  'loadRemote: failed to store "' + url + '" in the IndexedDB'
                )
                cbCancel()
              }
            }
          }
        })
      }
    }

    rq.onerror = function (event) {
      cbPrint("loadRemote: failed to get data from the IndexedDB")
      cbCancel()
    }
  }

  rq.onerror = function (event) {
    cbPrint("loadRemote: failed to open IndexedDB")
    cbCancel()
  }

  rq.onblocked = function (event) {
    cbPrint("loadRemote: failed to open IndexedDB: blocked")
    cbCancel()
  }

  rq.onabort = function (event) {
    cbPrint("loadRemote: failed to open IndexedDB: abort")
  }
}
