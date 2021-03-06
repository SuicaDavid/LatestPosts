const Entry = require('../lib/entry')

exports.list = function (req, res, next) {
	Entry.getRange(0, -1, function (err, entries) {
		if (err) return next(err)
		res.render('entries', {
			title: 'Entries',
			entries: entries,
		})
	})
}

exports.form = function (req, res) {
	res.render('post', { title: 'Post' })
}

exports.submit = function (req, res, next) {
	let data = req.body.entry
	console.log('entry submit')
	console.log(res.locals)
	console.log(req.user)
	let entry = new Entry({
		username: res.locals.user.name,
		title: data.title,
		body: data.body,
	})
	entry.save(function (err) {
		if (err) return next(err)
		console.log(1)
		if (req.remoteUser) {
			res.json({ message: 'Entry added.' })
		} else {
			res.redirect('/')
		}
	})
}
