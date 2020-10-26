const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'./uploads/video')
    },
    filename:  (req,file,cb) => {
        cb(null, file.originalname)
    }
});

const videoFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(|mp4|avi|mov|mkv)$/)) {
        return cb(new Error('You can upload only video files.'), false)
    }
    cb(null, true);
}

const upload = multer({ storage: storage, fileFilter: videoFileFilter})

const videoRouter = express.Router();
videoRouter.use(bodyParser.json());

videoRouter.route('/')
.get((req, res, next) => {
    res.statusCode = 403;
    res.end('GET operations not supported on /videoUploads');
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operations not supported on /videoUploads');
})
.post(upload.single('videoFile'),(req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file)
})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operations not supported on /videoUploads');
})

module.exports = videoRouter;