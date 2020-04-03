const route = require('express').Router()
const Controller = require('../controllers/movieController')
const authentication = require('../middlewares/authentication')
const authorization = require('../middlewares/authorization')

route.get('/', authentication, Controller.getMovies)
route.get('/search', Controller.searchMovie)
route.post('/', authentication, Controller.createMovie)
route.get('/:id', Controller.getMovie)
route.put('/:id', Controller.updateMovie)
route.delete('/:id', authentication, authorization, Controller.destroyMovie)
route.post('/similiar', authentication, Controller.similiar)

module.exports = route