const { Router } = require('express');
const userRouter = Router();
const UserController = require('../controllers/user');

userRouter.post('/register', UserController.register);
userRouter.post('/login', UserController.login);
userRouter.post('/google-sign-in', UserController.loginWithGoogle);

module.exports = userRouter;