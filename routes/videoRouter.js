const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const spawn = require('child_process').spawn;

const encodeStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'./public/uploads/video/encode')
    },
    filename:  (req,file,cb) => {
        cb(null, file.originalname)
    },
});

const decodeStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'./public/uploads/video/decode')
    },
    filename:  (req,file,cb) => {
        cb(null, file.originalname)
    },
});

const videoFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(|mp4|avi|mov|mkv)$/)) {
        return cb(new Error('You can upload only video files.'), false)
    }
    cb(null, true);
}

const encodeUpload = multer({ storage: encodeStorage, fileFilter: videoFileFilter});
const decodeUpload = multer({ storage: decodeStorage, fileFilter: videoFileFilter});

const videoRouter = express.Router();
videoRouter.use(bodyParser.json());

videoRouter.route('/')
.get((req, res, next) => {
    res.statusCode = 200;
    res.sendFile('video.html',{root: path.join('./public')});
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operations not supported on /videoSteg');
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operations not supported on /videoSteg');
})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operations not supported on /videoSteg');
})

videoRouter.route('/encode')
.get((req, res, next) => {
    res.statusCode = 403;
    res.end('GET operations not supported on /videoSteg');
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operations not supported on /videoSteg');
})
.post(encodeUpload.single('videoFile') ,(req, res) => {
    const filePath = './public/downloads/video/' + req.file.originalname
    res.statusCode = 200;
    const process = spawn('python3',['./routes/Video.py',1,'./public/uploads/video/encode/',req.file.originalname,req.body.message])
    process.on('data', data => {
        console.log(data)
    })
    res.download(filePath)
})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operations not supported on /videoSteg');
})

videoRouter.route('/decode')
.get((req, res, next) => {
    res.statusCode = 403;
    res.end('GET operations not supported on /videoSteg');
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operations not supported on /videoSteg');
})
.post(decodeUpload.single('videoFile'),(req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    const process = spawn('python3',['./routes/Video.py',2,`./public/uploads/video/decode/${req.file.originalname}`]);
    process('data', data => {
        console.log(data.toString());
    });
})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operations not supported on /videoSteg');
})

module.exports = videoRouter;