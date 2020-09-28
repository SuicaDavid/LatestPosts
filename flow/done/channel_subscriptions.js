let event = require('events')
let net = require('net')

let channel = new event.EventEmitter()
channel.clients = {}
channel.subscriptions = {}
channel.setMaxListeners(50)

channel.on('join', function (id, client) {
    let welcome = "Welcome!\n" + 'Guests online: ' + this.listeners('broadcast').length + 1
    client.write(welcome + "\n")
    this.clients[id] = client
    this.subscriptions[id] = (senderId, message) => {
        if (id != senderId) {
            this.clients[id].write(message)
        }
    }
    this.on('broadcast', this.subscriptions[id])
})

channel.on('leave', function (id) {
    channel.removeListener('broadcast', this.subscriptions[id])
    channel.emit('broadcast', id, id + ' has left the chat. \n')
})

channel.on('shutdown', function () {
    channel.emit('broadcast', '', 'Chat has shut down.\n')
    channel.removeAllListeners('broadcast')
})

let server = net.createServer((client) => {
    let id = client.remoteAddress + ':' + client.remotePort
    console.log(`${client.remotePort} join the channel`)
    channel.emit('join', id, client)

    client.on('data', (data) => {
        data = data.toString()
        console.log(`${id} send a message: ${data}`)
        if (data == "shutdown\r\n") {
            channel.emit('shutdown')
        }
        channel.emit('broadcast', id, data)
    })
    client.on('close', () => {
        console.log(`${client.remotePort} leave the channel`)
        client.emit('leave', id)
    })
})
server.listen(8888)