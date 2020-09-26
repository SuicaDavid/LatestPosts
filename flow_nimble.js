// let flow = require('nimble')
// flow.series([
//     function(callback) {
//         setTimeout(() => {
//             console.log('I execute first.')
//              callback()
//         }, 1000)
//     },
//     function(callback) {
//         setTimeout(() => {
//             console.log('I execute next.')
//              callback()
//         }, 500)
//     },
//     function(callback) {
//         setTimeout(() => {
//             console.log('I execute last.')
//              callback()
//         }, 100)
//     }
// ])

function timer1() {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('I execute first.')
            resolve()
        }, 1000)
    })
}
function timer2() {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('I execute next.')
            resolve()
        }, 500)
    })
}
function timer3() {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('I execute last.')
            resolve()
        }, 100)
    })
}

// timer1()
// .then(()=>{
//     timer2()
//     .then(()=>{
//         timer3()
//     })
// })

// async function sequence() {
//     await timer1()
//     await timer2()
//     await timer3()
// }
// sequence()