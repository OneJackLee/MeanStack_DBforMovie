var Actor = require('../models/actor');
var Movie = require('../models/movie');
const mongoose = require('mongoose');

module.exports = {

    getAll: function (req, res) {
        Movie.find({}).populate("actors").exec(
            function (err, movies) {
                if (err) return res.status(400).json(err);
    
                res.json(movies);
            }
        );

        // Movie.find(function (err, movies) {
        //     if (err) return res.status(400).json(err);

        //     res.json(movies);
        // });
    },

    getYearBetween: function(req, res){
        let query = {$and:[{'year': {$lte: parseInt(req.params.year1)}}, {'year': {$gte: parseInt(req.params.year2)}}]}
        Movie.find(query).exec(function(err, movies){
            if (err) return res.status(400).json(err);
            res.json(movies);
        })
    },

    createOne: function (req, res) {
        let newMovieDetails = req.body;
        newMovieDetails._id = new mongoose.Types.ObjectId();
        Movie.create(newMovieDetails, function (err, movie) {
            if (err) return res.status(400).json(err);

            res.json(movie);
        });
    },


    getOne: function (req, res) {
        Movie.findOne({ _id: req.params.id })
            .populate('actors')
            .exec(function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();

                res.json(movie);
            });
    },


    updateOne: function (req, res) {
        Movie.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();

            res.json(movie);
        });
    },

    deleteOne: function (req, res) {
        Movie.findOneAndRemove({ _id: req.params.id }, function (err) {
            if (err) return res.status(400).json(err);
            res.json();
        });
    },

    deleteActor: function(req, res){
        Movie.findOne({ _id: req.params.id }, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();

            Actor.findOne({ _id: req.body.actorid }, function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();    
            })
            movie.actors = movie.actors.filter((item) => item != req.params.actorid)
            movie.save(function(err){
                if (err) return res.status(400).json(err);
            })
            res.json();
        });

    },

    addActor: function(req, res){
        Movie.findOne({ _id: req.params.id }, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();

            Actor.findOne({ _id: req.body.id }, function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();

                movie.actors.push(actor._id);
                movie.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(movie);
                });
            })
        });
        // Actor.findOne({ _id: req.params.id }, function (err, actor) {
        //     if (err) return res.status(400).json(err);
        //     if (!actor) return res.status(404).json();

        //     Movie.findOne({ _id: req.body.id }, function (err, movie) {
        //         if (err) return res.status(400).json(err);
        //         if (!movie) return res.status(404).json();

        //         actor.movies.push(movie._id);
        //         actor.save(function (err) {
        //             if (err) return res.status(500).json(err);

        //             res.json(actor);
        //         });
        //     })
        // });
    }

};