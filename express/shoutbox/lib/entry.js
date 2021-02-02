const e = require('express')
const redis = require('redis')
const db = redis.createClient()

class Entry {
	constructor(obj) {
		for (let key in obj) {
			this[key] = obj[key]
		}
	}

	static save(fn) {
		let entryJSON = JSON.stringify(this)
		db.lpush('entries', entryJSON, (err) => {
			if (err) return fn(err)
			fn()
		})
	}
	static getRange(from, to, fn) {
		db.lrange('entries', from, to, (err, items) => {
			if (err) return fn(err)
			let entries = []
			items.forEach(function (item) {
				entries.push(JSON.parse(item))
			})
			fn(null, entries)
		})
	}

	static count(fn) {
		db.llen('entries', fn)
    }
    
    static list(req, res, next) {
        let page = req.page
        Entry.getRange(page.from, page.to, function(err, entries){
            if (err) return next(err);
        })
    }
}

module.exports = Entry
