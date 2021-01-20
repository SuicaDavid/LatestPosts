let connect = require('connect')
let logger = require('./setup')
let app = connect()
.use(logger(':method :url'))
.use(hello)
.listen(3000)


function hello(req, res) {
	res.setHeader('Content-Type', 'text/plain')
	res.end('hello world')
}
