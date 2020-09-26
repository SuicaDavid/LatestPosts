function asyncFunction (callback) {
    setTimeout(callback, 200)
}

let color = 'blue';

(function(color){
    asyncFunction(()=>{
        console.log(color)
    })
})('color')
color = 'green'