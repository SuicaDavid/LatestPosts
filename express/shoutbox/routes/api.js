const express = require('express')
const basicAuth = require('express-basic-auth')
const User = require('../lib/user')

exports.auth = basicAuth({
    authorizer: User.authenticate,
    authorizeAsync: true
})

exports.user = function (req, res, next) {
	User.get(req.params.id, (err, user) => {
        if (err) return next(err)
		if (!user.id) return res.send(404)
		res.json(user)
	})
}
