let connect = require('connect')

connect()
	.use(logger)
	.use('/admin', restrict)
	.use('/admin', admin)
	.use(hello)
	.listen(3000)

function hello(req, res) {
	res.setHeader('Content-Type', 'text/plain')
	res.end('hello world')
}
function logger(req, res, next) {
	console.log(req.method, req.url)
	next()
}

function restrict(req, res, next) {
	let authorization = req.headers.authorization
	if (!authorization) return next(new Error('Unauthorized'))

	let parts = authorization.split('')
	let scheme = parts[0]
	let auth = new Buffer.from(parts[1], 'base64').toString().split(':')
	let user = auth[0]
	let pass = auth[1]

	authenticateWithDatabase(user, pass, (err) => {
		if (err) throw err
		next()
	})
}

function admin(req, res, next) {
	switch (req.url) {
		case '/':
			res.end('try /users')
			break
		case '/users':
			res.setHeader('Content-Type', 'application/json')
			res.end(JSON.stringify(['tobi', 'loki', 'jane']))
			break
	}
}

function authenticateWithDatabase(user, pass, next) {
	console.log('user: ' + user)
    console.log('pass: ' + pass)
	next()
}
