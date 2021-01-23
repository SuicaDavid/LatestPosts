const photo = require('../models/photo')
const path = require('path')
const fs = require('fs')
const join = path.join

let photos = []
photos.push({
    name: 'Note.js logo',
    path: 'http://nodejs.org/images/logos/nodejs-green.png'
})
photos.push({
    name: 'Ryan Speaking',
    path: 'http://nodejs.org/images/ryan-speaker.jpg'
})

exports.list = function(req, res) {
    res.render('index', {
        title: 'Photos',
        photos: photos
    })
}

exports.form = function(req, res){
    res.render('photos/upload', {
      title: 'Photo upload'
    })
 }

 exports.submit = function(dir) {
    return function(req, res, next) {
        let img = req.files.photo
        let name = img.name
        let path = join(dir, name)
        fs.writeFile(path, img.data, async(err) => {
            if (err) return next(err)

            photo.create({
                name,
                path: path
            })
        }, function(err) {
            if (err) return next(err)
            res.redirect('/')
        }) 
    }
}
