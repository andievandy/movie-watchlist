const route = require('express').Router()
const movieRoute = require('./movieRoute')

route.use('/movies',movieRoute)

module.exports = route