const { Router } = require("express");
const router = Router();
const google = require('./google')

router.use('/google', google)


module.exports = router