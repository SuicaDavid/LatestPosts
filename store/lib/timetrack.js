let qs = require('querystring')

exports.sendHtml = function (res, html) {
	res.setHeader('Content-Type', 'text/html')
	res.setHeader('Content-Length', Buffer.byteLength(html))
	res.end(html)
}

exports.parseReceivedData = function (req, callback) {
	let body = ''
	req.setEncoding('utf8')
	req.on('data', (chunk) => {
		body += chunk
	})
	req.on('end', function () {
		let data = qs.parse(body)
		callback(data)
	})
}

exports.actionForm = function (id, path, label) {
	let html = `
        <form method="POST" action="${path}">
        <input type="hidden" name="id" value="${id}">
        <input type="submit" value="${label}"/>
        </form>
    `
	return html
}

exports.add = function (db, req, res) {
	exports.parseReceivedData(req, (work) => {
		db.query(
			`INSERT INTO work (hours, date, description) VALUES (?, ?, ?)`,
			[work.hours, work.date, work.description],
			(err) => {
				if (err) throw err
				exports.show(db, res)
			}
		)
	})
}

exports.delete = function (db, req, res) {
	exports.parseReceivedData(req, (work) => {
		db.query(`DELETE FROM work WHERE id=?`, [work.id], (err) => {
			if (err) throw err
			exports.show(db, res)
		})
	})
}

exports.archive = function (db, req, res) {
	exports.parseReceivedData(req, (work) => {
		db.query(`UPDATE work SET archived=1 WHERE id=?`, [work.id], (err) => {
			if (err) throw err
			exports.show(db, res)
		})
	})
}
exports.show = function (db, res, showArchived) {
	let query = `SELECT * FROM work WHERE archived=? ORDER BY date DESC`
	let archiveValue = showArchived ? 1 : 0
	db.query(query, [archiveValue], (err, rows) => {
		if (err) throw err
		html = showArchived ? '' : '<a href="/archived">Archived Work</a><br/>'
		html += exports.workHitlistHtml(rows)
		html += exports.workFormHtml()
		exports.sendHtml(res, html)
	})
}

exports.showArchived = function (db, res) {
	exports.show(db, res, true)
}

exports.workHitlistHtml = function (rows) {
	let html = `<table>`
	for (var i in rows) {
		html += `
            <tr>
                <td>${rows[i].date}</td>
                <td>${rows[i].hours}</td>
                <td>${rows[i].description}</td>
                ${
									rows[i].archived
										? ''
										: `<td>${exports.workArchiveForm(rows[i].id)}</td>`
								}
                <td>${exports.workDeleteForm(rows[i].id)}</td>
            </tr>
        `
	}
	html += '</table>'
	return html
}

exports.workFormHtml = function () {
	var html = `
	<form method="POST" action="/">
	<p>Date (YYYY-MM-DD):<br/><input name="date" type="text"><p/>
	<p>Hours worked:<br/><input name="hours" type="text"><p/><p>Description:<br/>
	<textarea name="description"></textarea></p>
	<input type="submit" value="Add" />
	</form>`
	return html
}
exports.workArchiveForm = function (id) {
	return exports.actionForm(id, '/archive', 'Archive')
}

exports.workDeleteForm = function (id) {
	return exports.actionForm(id, '/delete', 'Delete')
}
