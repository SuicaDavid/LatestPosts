let fs = require('fs')
let completeTasks = 0
let tasks = []
let wordCounts = {}
let filesDir = './text'

function checkIfComplete() {
    completeTasks++
    if (completeTasks == tasks.length) {
        for (var index in wordCounts) {
            console.log(index + ': ' + wordCounts[index])
        }
    }
}

function countWordInText(text) {
    let words = text.toString().toLowerCase().split(/\W+/).sort()
    for (let index in words) {
        let word = words[index]
        if (word) {
            wordCounts[word] = (wordCounts[word])?wordCounts[word] + 1 : 1
        }
    }
}

function readFile(file) {
    return function() {
        fs.readFile(file, function(err, text) {
            if (err) throw err
            countWordInText(text)
            checkIfComplete()
        })
    }
}

fs.readdir(filesDir, function(err, files) {
    if (err) throw err
    for(let index in files) {
        let task = readFile(filesDir + '/' + files[index])
        tasks.push(task)
    }
    for(let task in tasks) {
        tasks[task]()
      }
})
