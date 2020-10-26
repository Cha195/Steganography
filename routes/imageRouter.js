const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'./uploads/images')
        cb(null,'./downloads/images')
    },
    filename:  (req,file,cb) => {
        cb(null, file.originalname)
    }
});

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|png|jpeg|gif)$/)) {
        return cb(new Error('You can upload only image files.'), false)
    }
    cb(null, true);
}

const upload = multer({ storage: storage, fileFilter: imageFileFilter})

const imageRouter = express.Router();
imageRouter.use(bodyParser.json());

imageRouter.route('/')
.get((req, res, next) => {
    res.statusCode = 403;
    res.end('GET operations not supported on /imageUploads');
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operations not supported on /imageUploads');
})
.post(upload.single('imageFile'),(req, res) => {
    res.statusCode = 200;
    res.setHeader('Conten-Type', 'application/json');
    res.json(req.file)
})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operations not supported on /imageUploads');
})

module.exports = imageRouter;