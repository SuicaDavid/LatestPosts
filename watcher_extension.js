let events = require('events')
let util = require('util')
let fs = require('fs')
const { rawListeners } = require('process')
let watchDir = './watch'
let processedDir = './done'

class Watcher extends events.EventEmitter {
    constructor(watchDir, processedDir) {
        super()
        this.watchDir = watchDir
        this.processedDir = processedDir
    }

    watch() {
        fs.readdir(this.watchDir, (err, files) => {
            if (err) throw err
            for (var index in files) {
                this.emit('process', files[index])
            }
        })
    }

    start() {
        fs.watchFile(this.watchDir, () => {
            this.watch()
        })
    }
}

let watcher = new Watcher(watchDir, processedDir)

watcher.on('process', function (file) {
    let watchFile = this.watchDir + '/' + file
    let processedFile = this.processedDir + '/' + file.toLowerCase()
    fs.rename(watchFile, processedFile, (err) => {
        if (err) throw err
    })
})

watcher.start()