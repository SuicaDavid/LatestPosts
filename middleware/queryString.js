const connect = require('connect')
const bodyParser = require('body-parser')
const url = require('url')
const app = connect()
    .use(bodyParser.urlencoded({extended:true}))
    .use(function(req, res, next){
        let url_parts = url.parse(req.url, true);
        let query = url_parts.query;
        console.log(query)
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(req.query));
    })
    .listen(3000)