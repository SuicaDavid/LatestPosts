let app = connect()
.use(logger(':method :url'))
.use(hello)


function hello(req, res) {
	res.setHeader('Content-Type', 'text/plain')
	res.end('hello world')
}

function setup(format) {
    let regexp = /:(\w+)g/

    return function logger(req, res, next) {
        let str = format.replace(regexp, (match, property)=>{
            return reqq[property]
        })
        next()
    }
}