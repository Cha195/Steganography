const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'./uploads/audio')
    },
    filename:  (req,file,cb) => {
        cb(null, file.originalname)
    }
});

const audioFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(wav|mp3)$/)) {
        return cb(new Error('You can upload only audio files.'), false)
    }
    cb(null, true);
}

const upload = multer({ storage: storage, fileFilter: audioFileFilter})

const audioRouter = express.Router();
audioRouter.use(bodyParser.json());

audioRouter.route('/')
.get((req, res, next) => {
    res.statusCode = 403;
    res.end('GET operations not supported on /audioUploads');
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operations not supported on /audioUploads');
})
.post(upload.single('audioFile'),(req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file)
})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operations not supported on /audioUploads');
})

module.exports = audioRouter;