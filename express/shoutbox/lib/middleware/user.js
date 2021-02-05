const User = require('../user')

module.exports = function (req, res, next) {
	console.log('user')
	console.log(req.remoteUser)
	if (req.remoteUser) {
		res.locals.user = req.remoteUser
	}
	let uid = req.session.uid
	console.log(uid)
	if (!uid) return next()
	User.get(uid, function (err, user) {
		if (err) return next(err)
		console.log(user)
		req.user = res.locals.user = user
		next()
	})
}
