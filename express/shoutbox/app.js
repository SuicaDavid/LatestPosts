var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var methodOverride = require('method-override')
var cookieParser = require('cookie-parser')
var session = require('cookie-session')
var logger = require('morgan')

const register = require('./routes/register')
const messages = require('./lib/message')
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const login = require('./routes/login')
const user = require('./lib/middleware/user')
const entries = require('./routes/entries')
const validate = require('./lib/middleware/validate')
const Entry = require('./lib/entry')
const page = require('./lib/middleware/page')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride())
app.use(cookieParser('your secret here'))
app.use(
	session({
		name: 'session',
		keys: [0],

		// Cookie Options
		maxAge: 24 * 60 * 60 * 1000, // 24 hours
	})
)
app.use(user)
app.use(messages)

app.use('/users', usersRouter)
app.get('/register', register.form)
app.post('/register', register.submit)
app.get('/login', login.form)
app.post('/login', login.submit)
app.get('/logout', login.logout)
app.get('/post', entries.form)
app.post(
	'/post',
	validate.required('entry[title]'),
	validate.lengthAbove('entry[title]', 4),
	entries.submit
)
app.get('/:page?', page(Entry.count, 5), entries.list)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render('error')
})

module.exports = app