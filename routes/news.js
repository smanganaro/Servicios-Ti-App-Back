var express = require("express");
var router = express(); 

const NewsController = require('../controllers/NewsController');

router.get('/',function(req,res){
	NewsController.getAllNews(res);
});

router.get('/:id',function(req, res) {
	let id = req.params.id;
	NewsController.getNewsById(id, res);
});

router.post('/add', function(req,res){
	NewsController.createNews(req.body, res);
});


router.post('/update/:id', function(req, res) {
    NewsController.updateNews(req, res);
});

router.post('/delete/:id', function(req, res){
	let id = req.params.id;
	NewsController.deleteNews(id, res);
})

module.exports = router;