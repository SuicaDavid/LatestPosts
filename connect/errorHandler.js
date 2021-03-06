let connect = require('connect')

let api = connect().use(users).use(pets).use(errorHandler)

let app = connect().use(hello).use('/api', api).use(errorPage).listen(3000)

function hello(req, res, next) {
	if (req.url.match(/^\/hello/)) {
		res.end('Hello World\n')
	} else {
		next()
	}
}

function errorHandler(err, req, res, next) {
	let env = process.env.NODE_ENV || 'development'
	console.error(err.stack)
	res.setHeader('Content-Type', 'application/json')
	if (err.notFound) {
		res.statusCode = 404
		res.end(JSON.stringify({ error: err.message }))
	} else {
		res.statusCode = 500
		res.end(JSON.stringify({ error: 'Internal Server Error' }))
	}
}

let db = {
	users: [{ name: 'tobi' }, { name: 'loki' }, { name: 'jane' }],
}

function users(req, res, next) {
	var match = req.url.match(/^\/user\/(.+)/)
	console.log("user")
	console.log(match)
	if (match) {
		var user = db.users[match[1]]
		if (user) {
			res.setHeader('Content-Type', 'application/json')
			res.end(JSON.stringify(user))
		} else {
			var err = new Error('User not found')
			err.notFound = true
			next(err)
		}
	} else {
		next()
	}
}

function pets(req, res, next) {
	console.log("pet")
	if (req.url.match(/^\/pet\/(.+)/)) {
		foo()
	} else {
		next()
	}
}

function errorPage(err, req, res, next) {
	console.error(err.stack)
	res.setHeader('Content-Type', 'application/json')
	if (err.notFound) {
		res.statusCode = 404
		res.end(JSON.stringify({ error: err.message }))
	} else {
		res.statusCode = 500
		res.end(JSON.stringify({ error: 'Internal Server Error' }))
	}
}
