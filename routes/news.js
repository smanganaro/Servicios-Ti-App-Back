var express = require("express");
var router = express(); 
var multer = require('multer');
var mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const NewsController = require('../controllers/NewsController');
const DIR = './public';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});


router.get('/',function(req,res){
	NewsController.getAllNews(res);
});

router.get('/:id',function(req, res) {
	let id = req.params.id;
	NewsController.getNewsById(id, res);
});

router.post('/add', upload.single('img'), function(req,res){
	NewsController.createNews(req, res);
});


router.post('/update/:id', function(req, res) {
    NewsController.updateNews(req, res);
});

router.post('/delete/:id', function(req, res){
	let id = req.params.id;
	NewsController.deleteNews(id, res);
})

module.exports = router;