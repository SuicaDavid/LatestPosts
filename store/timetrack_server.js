let http = require('http')
let work = require('./lib/timetrack')
let mysql = require('mysql')

let db = mysql.createConnection({
	host: '127.0.0.1',
	user: 'root',
	password: '123456789',
	database: 'timetrack',
})

let server = http.createServer((req, res) => {
	switch (req.method) {
		case 'POST':
			postRouter(req.url, req, res)
			break
		case 'GET':
			getRouter(req.url, req, res)
			break
	}
})

function postRouter(url, req, res) {
	switch (url) {
		case '/':
			work.add(db, req, res)
			break
		case '/archive':
			work.archive(db, req, res)
			break
		case '/delete':
			work.delete(db, req, res)
			break
	}
}

function getRouter(url, req, res) {
	switch (url) {
		case '/':
			work.show(db, res)
			break
		case '/archived':
			work.showArchived(db, res)
	}
}

db.query(
	`CREATE TABLE IF NOT EXISTS work ( id INT(10) NOT NULL AUTO_INCREMENT, hours DECIMAL(5, 2) DEFAULT 0, date DATE, archived INT(1) DEFAULT 0, description LONGTEXT, PRIMARY KEY(id))`,
	(err) => {
		if (err) throw err
		console.log('Server started')
		server.listen(3000, '127.0.0.1')
	}
)
