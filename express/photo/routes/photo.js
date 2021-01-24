const Photo = require('../models/Photo')
const path = require('path')
const fs = require('fs')
const join = path.join

// dummy data
// let photos = []
// photos.push({
//     name: 'Note.js logo',
//     path: 'http://nodejs.org/images/logos/nodejs-green.png'
// })
// photos.push({
//     name: 'Ryan Speaking',
//     path: 'http://nodejs.org/images/ryan-speaker.jpg'
// })

exports.list = function (req, res, next) {
	Photo.find({}, (err, photos) => {
        if (err) return next(err)
        console.log(photos)
		res.render('index', {
			title: 'Photos',
			photos: photos,
        })
	})
}

exports.form = function (req, res) {
	res.render('photos/upload', {
		title: 'Photo upload',
	})
}

exports.submit = function (dir, absoluteDir) {
	return function (req, res, next) {
		let img = req.files.photo
		let name = img.name
        let path = join(dir, name)
        let absolutePath = join(absoluteDir, name)
		fs.writeFile(
			path,
			img.data,
			async (err) => {
				if (err) return next(err)
			},
			function (err) {
                if (err) return next(err)
                Promise.race([Photo.create({
					name,
					path: absolutePath,
                })])
                .then(()=>{
                    console.log('finish')
				    res.redirect('/')
                })
			}
		)
	}
}
