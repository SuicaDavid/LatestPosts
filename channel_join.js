let EventEmitter = require('events').EventEmitter
let channel = new EventEmitter()
channel.on('join', ()=>{
    console.log('Welcome')
})
channel.emit('join')