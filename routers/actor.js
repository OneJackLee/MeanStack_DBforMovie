const mongoose = require('mongoose');

const Actor = require('../models/actor');
const Movie = require('../models/movie');

module.exports = {

    getAll: function (req, res) {
        Actor.find({}).populate("movies").exec(
            function (err, actors) {
                if (err) return res.status(400).json(err);
    
                res.json(actors);
            }
        );

        // Actor.find(function (err, actors) {
        //     if (err) {
        //         return res.status(404).json(err);
        //     } else {
        //         res.json(actors);
        //     }
        // });
    },

    createOne: function (req, res) {
        let newActorDetails = req.body;
        newActorDetails._id = new mongoose.Types.ObjectId();

        let actor = new Actor(newActorDetails);
        actor.save(function (err) {
            res.json(actor);
        });
    },

    getOne: function (req, res) {
        Actor.findOne({ _id: req.params.id })
            .populate('movies')
            .exec(function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                res.json(actor);
            });
    },


    updateOne: function (req, res) {
        Actor.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();

            res.json(actor);
        });
    },


    deleteOne: function (req, res) {
        Actor.findOneAndRemove({ _id: req.params.id }, function (err) {
            if (err) return res.status(400).json(err);

            res.json();
        });
    },


    addMovie: function (req, res) {
        Actor.findOne({ _id: req.params.id }, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();

            Movie.findOne({ _id: req.body.id }, function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();

                actor.movies.push(movie._id);
                actor.save(function (err) {
                    if (err) return res.status(500).json(err);

                    res.json(actor);
                });
            })
        });
    },

    deleteMovie: function(req, res){
        Actor.findOne({ _id: req.params.id }, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();

            Movie.findOne({ _id: req.body.movieid }, function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();    
            })
            actor.movies = actor.movies.filter((item) => item != req.params.movieid)
            actor.save(function(err){
                if (err) return res.status(400).json(err);
            })
            res.json();
        });
    },

    deleteOneWithMovie: function (req, res) {
        Actor.findOne({ _id: req.params.id }, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();

            // delete the actor's movie
            actor.movies.forEach((element) => {
                Movie.findOneAndRemove({ _id: element }, function (err) {
                    if (err) return res.status(400).json(err);
                });

                Actor.find(function (err, actors) {
                    if (err) {
                        return res.status(404).json(err);
                    } else {
                        actors.forEach((actor)=> {
                            // actor.movies.forEach((item) => {console.log(">>" + item); console.log(element != item)})
                            let temp = actor.movies.filter((item) => !(item == element))
                            Actor.findOneAndUpdate({ _id: actor._id },{movies : temp}, function (err, actor) {
                                if (err) return res.status(400).json(err);
                                if (!actor) return res.status(404).json();
                           });
                        })
                    }
                });
    

            });


        });

        Actor.findOneAndRemove({ _id: req.params.id }, function (err) {
            if (err) return res.status(400).json(err);
            res.json();
        });
    },

    deleteYoungerThan15 : function(req, res) {
        // let currentYear = new Date().getFullYear();
        var curYear = new Date().getFullYear();
        //2019-15 =2004
        query = {'bYear' : {$gte : curYear-15}}
        Actor.deleteMany(query).exec(function(err){
            if (err) return res.status(400).json(err);
            res.json();
        })
        // Actor.deleteMany({'bYear' : {$gte : curYear-15}}).exec(function(err){
        //     if (err) return res.status(400).json(err);
        //     res.json();
        // })
    }

};