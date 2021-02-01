const redis = require('redis')
const bcrypt = require('bcrypt')
const db = redis.createClient()

class User {
	constructor(obj) {
		for (let key in obj) {
			this[key] = obj[key]
		}
	}

	save(fn) {
		if (this.id) {
			this.update(fn)
		} else {
			db.incr('user:ids', (err, id) => {
				if (err) return fn(err)
				this.id = id
				this.hashPassword((err) => {
					if (err) return fn(err)
					this.update(fn)
				})
			})
		}
	}

	update(fn) {
		let id = this.id
		db.set('user:id:' + this.name, id, (err) => {
			if (err) return fn(err)
			db.hmset('user:' + id, this, (err) => fn(err))
		})
	}

	hashPassword(fn) {
		let user = this
		bcrypt.genSalt(12, (err, salt) => {
			if (err) return fn(err)
			user.salt = salt
			bcrypt.hash(user.pass, salt, (err, hash) => {
				if (err) return fn(err)
				user.pass = hash
				fn()
			})
		})
	}

	static getByName(name, fn) {
		this.getId(name, (err, id) => {
			if (err) return fn(err)
			this.get(id, fn)
		})
	}

	static getId(name, fn) {
		db.get('user:id:' + name, fn)
	}

	static get(id, fn) {
		db.hgetall('user:' + id, (err, user) => {
			if (err) return fn(err)
			fn(null, new User(user))
		})
	}

	static authenticate(name, pass, fn) {
		this.getByName(name, (err, user) => {
			if (err) return fn(err)
			if (!user.id) return fn()
			bcrypt.hash(pass, user.salt, (err, hash) => {
				if (err) return fn(err)
                if (hash == user.pass) return fn(null, user)
                fn()
			})
		})
	}
}

let tobi = new User({
	name: 'Tobi',
	pass: 'im a ferret',
	age: '2',
})
tobi.save(function (err) {
	if (err) throw err
	console.log('user id %d', tobi.id)
})

module.exports = User
