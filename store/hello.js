let http = require('http')
let counter = 0

let server = http.createServer((req,res)=>{
    counter++
    res.write(`It has ${counter} times accessing`)
    res.end()
}).listen(3000)