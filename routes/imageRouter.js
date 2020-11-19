const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const spawn = require('child_process').spawn;

const encodeStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'./public/uploads/images/encode')
    },
    filename:  (req,file,cb) => {
        cb(null, file.originalname)
    }
});

const decodeStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'./public/uploads/images/decode')
    },
    filename:  (req,file,cb) => {
        cb(null, file.originalname)
    },
});

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|png|jpeg|gif)$/)) {
        return cb(new Error('You can upload only image files.'), false)
    }
    cb(null, true);
}

const encodeUpload = multer({ storage: encodeStorage, fileFilter: imageFileFilter});
const decodeUpload = multer({ storage: decodeStorage, fileFilter: imageFileFilter});

const imageRouter = express.Router();
imageRouter.use(bodyParser.json());

imageRouter.route('/')
.get((req, res, next) => {
    res.statusCode = 200;
    res.sendFile('image.html',{root: path.join('./public')});
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operations not supported on /imageSteg');
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operations not supported on /imageSteg');
})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operations not supported on /imageSteg');
})

imageRouter.route('/encode')
.get((req, res, next) => {
    res.statusCode = 403;
    res.end('GET operations not supported on /imageSteg/encode');
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operations not supported on /imageSteg/encode');
})
.post(encodeUpload.single('imageFile'),(req, res) => {
    const filePath = './public/downloads/images/' + req.file.originalname
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    const process = spawn('python3',['./routes/Image.py',1,'./public/uploads/image/encode/',req.file.originalname,req.body.message]);
    res.download(filePath);
})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operations not supported on /imageSteg/encode');
})

imageRouter.route('/decode')
.get((req, res, next) => {
    res.statusCode = 403;
    res.end('GET operations not supported on /imageSteg/decode');
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operations not supported on /imageSteg/decode');
})
.post(decodeUpload.single('imageFile'),(req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    const process = spawn('python3',['./routes/Image.py',2,`./public/uploads/images/decode/${req.file.originalname}`]);
    res.send(`Original image: ${req.file.path} Message: ${req.body.message}`);
    process('data', data => {
        console.log(data.toString());
    });
})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operations not supported on /imageSteg/decode');
})

module.exports = imageRouter;