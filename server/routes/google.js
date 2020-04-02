const { Router } = require("express");
const router = Router();
const googleController = require('../controllers/google');

router.post('/login', googleController.login);

module.exports = router;