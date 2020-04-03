const route = require('express').Router()
const movieRoute = require('./movieRoute')
const google = require('./google')
const userRouter = require('./user')

route.use('/movies', movieRoute)
route.use('/google', google)
route.use('/user', userRouter)

module.exports = route