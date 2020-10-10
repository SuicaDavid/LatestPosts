let connect = require('connect')
let app = connect()

function hello(req, res) {
	res.setHeader('Content-Type', 'text/plain')
	res.end('hello world')
}
function logger(req, res, next) {
	console.log(req.method, req.url)
	next()
}
app.use(logger)
app.use(hello)
app.listen(3000)
