let http = require('http')
let url = require('url')
let items = []
let server = http.createServer((req, res) => {
    switch (req.method) {
        case 'POST':
            let item = ''
            req.setEncoding('utf-8')
            req.on('data', (chunk) => {
                item += chunk
            })
            req.on('end', () => {
                items.push(item)
                res.end()
            })
            break
        case 'GET':
            let body = items.map((item, index)=>{
                return `(${index})${item}`
            }).join('\n')
            res.setHeader('Content-Length', Buffer.byteLength(body))
            res.setHeader('Content-Type', 'text/plain; charset="utf-8"')
            res.end(body)
            break
        case 'DELETE':
            let path = url.parse(req.url).pathname
            let i =parseInt(path.slice(1), 10)

            if(isNaN(i)){
                res.statusCode = 400
                res.end('Invalid item id')
            } else if (!items[i]){
                res.statusCode = 404
                res.end('Item not found')
            } else {
                items.splice(i, 1)
                res.end('OK\n')
            }
            break
    }
}).listen(3000)