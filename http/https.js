let https = require('https')
let fs = require('fs')

let options = {
	key: fs.readFileSync('./key.pem'),
	cery: fs.readFileSync('./key-cert.pem'),
}

https
	.createServer(options, (req, res) => {
		res.writeHead(200)
		res.end('Hello World\n')
	})
	.listen(30000)
