require('dotenv').config()
const jwt = require('jsonwebtoken')

const authentication = function (req, res, next) {
    try {
        const { token } = req.headers
        if (!token) {
            res.status(401).json({
                message: 'You must log in to access this endpoint'
            })
        } else {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decoded
            req.userID = decoded.userId
            req.emailUser = decoded.email
            next()
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'authentication error' })
    }
}

module.exports = authentication