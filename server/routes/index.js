const route = require('express').Router()
const movieRoute = require('./movieRoute')
const google = require('./google')

route.use('/movies',movieRoute)
router.use('/google', google)

module.exports = route