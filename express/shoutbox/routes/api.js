const express = require('express')
const basicAuth = require('express-basic-auth')
const User = require('../lib/user')
const Entity = require('../lib/entry')
const Entry = require('../lib/entry')

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

exports.entries = function(req, res, next) {
	let page = req.page
	Entry.getRange(page.from, page.to, (err, entries)=>{
		if (err) return next(err)
		res.json(entries)
	})
}
