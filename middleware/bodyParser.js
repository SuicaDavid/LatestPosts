const connect = require('connect');
const bodyParser = require('body-parser')
const app = connect()
    .use(bodyParser.json({extended: true}))
    .use(function(req, res) {
        // register the user
        res.end('Registered new user ' + req.body.username)
    })
    .listen(3000)