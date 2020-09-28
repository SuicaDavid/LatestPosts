let http = require('http')
let fs = require('fs')

http.createServer((req, res) => {
    if (req.url === '/') {
        getTitle(res)
    }
}).listen(8000, '127.0.0.1')

function getTitle(res) {
    fs.readFile('./title.json', (err, data) => {
        if (err) {
            hadError(err,res)
        } else {
            let titles = JSON.parse(data.toString())

            getTemplate(titles, res)
        }
    })
}

function getTemplate(titles, res) {
    fs.readFile('./template.html', (err, data) => {
        if (err) {
            hadError(err,res)
        } else {
            formatHtml(titles, data.toString(), res)
        }
    })
}
function formatHtml(titles, template, res) {
    let html = template.replace('%', titles.join('<\li><li>'))
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(html)
}

function hadError(err, res) {
    console.error(err)
    res.end('Server Error')
}