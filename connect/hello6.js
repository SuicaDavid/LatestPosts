let connect = require('connect')
let url = require('url')
let app = connect().use(rewrite).use(showPost).listen(3000)

function rewrite(req, res, next) {
	let path = url.parse(req.url).pathname
	let match = path.match(/^\/blog\/posts\/(.+)/)
	if (match) {
		findPostIdBySlug(match[1], function (err, id) {
			if (err) return next(err)
			if (!id) return next(new Error('User not found'))
			req.url = '/blog/posts/' + id
			next()
		})
	} else {
		next()
	}
}

function showPost(req, res, next) {
	res.setHeader('Content-Type', 'text/plain')
	res.end('hello world')
}