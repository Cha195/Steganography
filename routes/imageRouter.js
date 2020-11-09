const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const spawn = require('child_process').spawn;

const encodeStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'./uploads/images/encode')
    },
    filename:  (req,file,cb) => {
        cb(null, file.originalname)
    },
});

const decodeStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'./uploads/images/decode')
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

imageRouter.route('/encode')
.get((req, res, next) => {
    res.statusCode = 403;
    res.end('GET operations not supported on /imageSteg');
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operations not supported on /imageSteg');
})
.post(encodeUpload.single('imageFile'),(req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    const process = spawn('python3',['./routes/Image.py',1,'./uploads/image/encode/',req.file.originalname,req.body.message]);
    res.json(req.file);
})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operations not supported on /imageSteg');
})

imageRouter.route('/decode')
.get((req, res, next) => {
    res.statusCode = 403;
    res.end('GET operations not supported on /imageSteg');
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operations not supported on /imageSteg');
})
.post(decodeUpload.single('imageFile'),(req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    const process = spawn('python3',['./routes/Image.py',2,`./uploads/image/decode/${req.file.originalname}`]);
    res.json(req.file);
    process('data', data => {
        console.log(data.toString());
    });
})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operations not supported on /imageSteg');
})

module.exports = imageRouter;