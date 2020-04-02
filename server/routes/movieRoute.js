const route = require('express').Router()
const Controller = require('../controllers/movieController')
// const authentication = require('../middlewares/authentication')
// const authorization = require('../middlewares/authorization')

route.get('/', Controller.getMovies)
route.post('/', Controller.createMovie)
route.get('/:id', Controller.getMovie)
route.put('/:id', Controller.updateMovie)
route.delete('/:id', Controller.destroyMovie)

module.exports = route