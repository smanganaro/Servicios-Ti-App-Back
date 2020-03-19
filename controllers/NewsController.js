var mongoose = require('mongoose');
const News = require('../models/News');

function getAllNews(res){
	News.find(function(err, news){
		if (err) { 
			console.log(err);
		} else {
			res.json(news);
		}
	});
}

function getNewsById(id, res){
	News.findById(id, function(err,news){
		if (err) { 
			res.status(400).send("Get not possible");
			console.log(err);
		} else {
			res.json(news);
		}
	});
}

function createNews(body, res){
	let today =	Date();
	let data = body;
	data.date = today;
	let news = new News(data);
	news.save().then(news => {
			res.status(200).json({'news': 'news added successfully'});
		}).catch(err => {
			res.status(400).send('Adding new news failed');
		});
}

function updateNews(req, res){
	News.findById(req.params.id, function(err, news) {
        if (!news)
            res.status(404).send("data is not found");
        else
            news.title = req.body.title;
            news.subtitle = req.body.subtitle;
            news.body = req.body.body;
            //news.img = req.body.img;

            news.save().then(news => {
                res.json('News updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
}

function deleteNews(id,res){
	News.findOneAndDelete({_id: id}, function(err){
		if (err){
			console.log(err);
			res.status(400).send("Delete not possible");
		} else{
			console.log("Successful deletion");
			res.status(200).send("Successful deletion");
		}
		
	})
}

module.exports = {
	getAllNews: getAllNews,
	getNewsById: getNewsById,
	createNews: createNews,
	updateNews: updateNews,
	deleteNews: deleteNews   
};
