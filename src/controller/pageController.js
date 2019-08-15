const express = require('express')
const router = express.Router()
const path = require('path')
var multer = require('multer')
var upload = multer({ dest: '../../temp' })

router.get('/', function(req, res){
    res.sendFile(path.resolve(__dirname, '../../public/index.html'))
});

router.post('/upload', upload.array('images', 10), (req, res, next) => {
    const files = req.files
    if (!files) {
      const error = new Error('Please choose files')
      error.httpStatusCode = 400
      return next(error)
    }
    res.sendFile(path.resolve(__dirname, '../../public/index.html'))
    // res.send(files)
})
  

module.exports = router