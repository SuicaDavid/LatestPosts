function setup(format) {
    let regexp = /:(\w+)g/

    return function logger(req, res, next) {
        let str = format.replace(regexp, (match, property)=>{
            return reqq[property]
        })
        next()
    }
}

module.exports = setup