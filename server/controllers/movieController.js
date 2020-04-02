const { Movie } = require('../models')

class MovieController {
    static getMovies(req, res) {
        Movie.findAll(
            {
                where: {
                    UserId: req.userID
                },
                order: [['id', 'ASC']]
            }
        )
            .then(movies => {
                res.status(200).json({ movies })
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }

    static createMovie(req, res) {
        const { title, status, date, genre, rating, year, quote, UserId } = req.body
        Movie.create({ title, status, date, genre, rating, year, quote, UserId: req.userID })
            .then(movie => {
                res.status(201).json({ movie })
            })
            .catch(err => {
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

    static getMovie(req, res) {
        Movie.findByPk(req.params.id)
            .then(movie => {
                if (movie) {
                    res.status(200).json({ movie })
                } else {
                    res.status(404).json({
                        message: 'Movie not found'
                    })
                }
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }

    static updateMovie(req, res) {
        const { status, date } = req.body
        Movie.update({
            status, date
        }, { where: { id: req.params.id } })
            .then(movie => {
                if (movie) {
                    return Movie.findByPk(req.params.id)
                } else {
                    res.status(404).json({
                        message: 'Movie not found'
                    })
                }
            })
            .then(edited => {
                res.status(200).json({ edited })
            })
            .catch(err => {
                if (err.name === 'SequelizeValidationError') {
                    let msg = []

                    err.errors.forEach(el => {
                        msg.push(el.message)
                    });
                } else {
                    res.status(500).json(err)
                }
            })
    }

    static destroyMovie(req, res) {
        let deleted = {}
        Movie.findByPk(req.params.id)
            .then(result => {
                deleted = result

                return Movie.destroy({
                    where: {
                        id: req.params.id
                        // ,UserId: req.user.id
                    }
                })
            })
            .then(result => {
                if (result) {
                    res.status(200).json(deleted)
                } else {
                    res.status(404).json({
                        message: 'Movie not found'
                    })
                }
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }

}

module.exports = MovieController