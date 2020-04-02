const { Movie } = require('../models')

const authorization = function (req, res, next) {
    Movie.findByPk(req.params.id)
        .then(result => {
            if (!result) {
                res.status(404).json({ message: 'todo not found' })
            } else {
                if (result.UserId === req.userID) {
                    next()
                } else {
                    res.status(400).json({ message: 'access forbidden' })
                }
            }
        })
}

module.exports = authorization