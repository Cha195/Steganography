const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const spawn = require('child_process').spawn;

const encodeStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'./public/uploads/audio/encode')
    },
    filename:  (req,file,cb) => {
        cb(null, file.originalname)
    },
});

const decodeStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'./public/uploads/audio/decode')
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

const encodeUpload = multer({ storage: encodeStorage, fileFilter: audioFileFilter});
const decodeUpload = multer({ storage: decodeStorage, fileFilter: audioFileFilter});

const audioRouter = express.Router();
audioRouter.use(bodyParser.json());

audioRouter.route('/')
.get((req, res, next) => {
    res.statusCode = 200;
    res.sendFile('audio.html',{root: path.join('./public')});
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operations not supported on /audioSteg');
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operations not supported on /audioSteg');
})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operations not supported on /audioSteg');
})

audioRouter.route('/encode')
.get((req, res, next) => {
    res.statusCode = 403;
    res.end('GET operations not supported on /audioSteg');
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operations not supported on /audioSteg');
})
.post(encodeUpload.single('audioFile'),(req, res) => {
    const filePath = './public/downloads/audio/' + req.file.originalname
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    const process = spawn('python3',['./routes/Audio.py', 1, './public/uploads/audio/encode/', req.file.originalname, req.body.message]);
    res.download(filePath);
})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operations not supported on /audioSteg');
})

audioRouter.route('/decode')
.get((req, res, next) => {
    res.statusCode = 403;
    res.end('GET operations not supported on /audioSteg');
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operations not supported on /audioSteg');
})
.post(decodeUpload.single('audioFile'),(req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    const process = spawn('python3',['./routes/Audio.py',2,`./public/uploads/audio/decode/${req.file.originalname}`]);
    res.json(req.file);
    process('data', data => {
        console.log(data.toString());
    });
})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operations not supported on /audioSteg');
})

module.exports = audioRouter;