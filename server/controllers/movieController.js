const {Movie} = require('../models')
const axios = require('axios')

class MovieController {
    static getMovies(req,res){
        Movie.findAll(
            // {where: {
            //     UserId: req.user.id
            // }, 
            // order: [['id','ASC']]}
        )
        .then(movies=>{
            res.status(200).json({movies})
        })
        .catch(err=>{
            res.status(500).json(err)
        })
    }

    static createMovie(req,res){
        const {title,status,date,genre,rating,year,quote,UserId} = req.body
        Movie.create({title,status,date,genre,rating,year,quote,UserId})
        .then(movie=>{
            res.status(201).json({movie})
        })
        .catch(err=>{
            if (err.name === 'SequelizeValidationError') {
                let msg = []

                err.errors.forEach(el => {
                    msg.push(el.message)
                });

                res.status(400).json({
                    message: msg.join(', ')
                })
            } else {
                res.status(500).json(err)
            }
        })
    }

    static getMovie(req,res){
        Movie.findByPk(req.params.id)
        .then(movie=>{
            if (movie) {
                res.status(200).json({movie})
            } else {
                res.status(404).json({
                    message: 'Movie not found'
                })
            }
        })
        .catch(err=>{
            res.status(500).json(err)
        })
    }

    static updateMovie(req,res){
        const {status,date} = req.body
        Movie.update({
            status,date
        },{where: {id: req.params.id}})
        .then(movie=>{
            if (movie) {
                return Movie.findByPk(req.params.id)
            } else {
                res.status(404).json({
                    message: 'Movie not found'
                })
            }
        })
        .then(edited=>{
            res.status(200).json({edited})
        })
        .catch(err=>{
            if (err.name === 'SequelizeValidationError') {
                let msg = []

                err.errors.forEach(el=>{
                    msg.push(el.message)
                });
            } else {
                res.status(500).json(err)
            }
        })
    }

    static destroyMovie(req,res){
        let deleted = {}
        Movie.findByPk(req.params.id)
        .then(result=>{
            deleted = result

            return Movie.destroy({where: {
                id: req.params.id
                // ,UserId: req.user.id
            }})
        })
        .then(result=>{
            if(result) {
                res.status(200).json(deleted)
            } else {
                res.status(404).json({
                    message: 'Movie not found'
                })
            }
        })
        .catch(err=>{
            res.status(500).json(err)
        })
    }

    static searchMovie(req, res) {
        let genreList = null
        MovieController.getMovieGenres().then(genres => {
            genreList = genres
            return axios.get('https://api.themoviedb.org/3/search/movie', {
                    params: {
                        api_key: process.env.TMDB_API_KEY,
                        query: req.body.query
                    }
                }
            )
        }).then((response) => {
            let showData = response.data.results.map((movie) => {
                let genreName = genreList.find(genre => genre.id === movie.genre_ids[0])
                if(genreName) {
                    genreName = genreName.name
                } else {
                    genreName = 'Unknown'
                }
                return {
                    title: movie.title,
                    genre: genreName,
                    rating: movie.vote_average,
                    year: new Date(movie.release_date).getFullYear()
                }
            })
            res.status(200).json(showData)
        }).catch(err => {
            console.log(err)
            res.status(500).json({error: err})
        })
    }

    static getMovieGenres() {
        return axios.get('https://api.themoviedb.org/3/genre/movie/list', {
            params: {
                api_key: process.env.TMDB_API_KEY
            }
        }).then(response => {
            return response.data.genres
        })
    }
}

module.exports = MovieController