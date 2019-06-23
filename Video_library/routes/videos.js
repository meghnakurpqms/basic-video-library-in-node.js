var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/vid');

// HOME
router.get('/', function(req, res) {
    var collection = db.get('videos');
    var searchCriteria = {};
    var search = req.query.search;
    var genre = req.query.genre;
    if (genre) { 
        var indexOfColon = genre.indexOf(":");
        genre = genre.substr(indexOfColon + 1);
    }

    if (genre && search) searchCriteria = {title: {'$regex': search, '$options': 'i'}, genre: genre};
    if (genre && !search) searchCriteria = {genre: genre};
    if (!genre && search) searchCriteria = {title: {'$regex': search, '$options': 'i'}};
    
    collection.find(searchCriteria, function(err, videos){
        if (err) throw err;
        res.json(videos);
    });
});

// CREATE
router.post('/', function(req, res){
    var collection = db.get('videos');
    collection.insert({
        title: req.body.title,
        genre: req.body.genre,
        description: req.body.description
    }, function(err, video){
        if (err) throw err;

        res.json(video);
    });
});

// RETRIEVE
router.get('/:id', function(req, res) {
    var collection = db.get('videos');
    collection.findOne({ _id: req.params.id }, function(err, video){
        if (err) throw err;

      	res.json(video);
    });
});

// UPDATE
router.put('/:id', function(req, res){
    var collection = db.get('videos');
    collection.update({
        _id: req.params.id
    },
    {
        title: req.body.title,
        genre: req.body.genre,
        description: req.body.description
    }, function(err, video){
        if (err) throw err;

        res.json(video);
    });
});

// DELETE
router.delete('/:id', function(req, res){
    var collection = db.get('videos');
    collection.remove({ _id: req.params.id }, function(err, video){
        if (err) throw err;

        res.json(video);
    });
});

module.exports = router;