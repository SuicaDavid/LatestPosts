let http = require('http')
// let server = http.createServer((req, res) => {
//     let body = 'Hello World'
//     res.setHeader('Content-Length', body.length)
//     res.setHeader('Content-Type', 'text/plain')
//     res.end(body)
// }).listen(3000)

let serverWithStatus = http.createServer((req, res) => {
    let url = 'http://google.com'
    let body = `<p>Redirecting to <a href="${url}">'${url}'</a></p>`
    res.setHeader('Location', url)
    res.setHeader('Content-Lenght', body.length)
    res.setHeader('Content-Type', 'text/html')
    res.statusCode = 302
    res.end(body)
}).listen(3000)