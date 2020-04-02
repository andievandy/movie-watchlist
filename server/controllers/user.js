const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENTID);

class UserController {
    static register(req, res) {
        const field = req.body;
        User.create({
            name: field.name,
            password: field.password,
            email: field.email
        }).then(() => {
            res.status(201).json({
                message: 'User created'
            })
        }).catch(err => {
            res.status(500).json({error: err});
        })
    }

    static login(req, res) {
        const field = req.body;
        User.findOne({
            where: {
                email: field.email
            }
        }).then(data => {
            let validAccount = false;
            if(data) {
                if(data.checkPassword(field.password)) {
                    let token = UserController.jwtSignUser(data);
                    res.status(201).json({
                        accessToken: token
                    });
                    validAccount = true;
                }
            }
            if(!validAccount) {
                res.status(400).json({error: 'Invalid username/password'});
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({error: 'Internal server error'});
        });
    }

    static loginWithGoogle(req, res) {
        const idToken = req.body.idToken;
        let payload = null;
        client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENTID
        }).then(data => {
            payload = data.getPayload();
            const userEmail = payload.email;
            return User.findOne({
                where: {
                    email: userEmail
                }
            });
        }).then(user => {
            if(user) {
                return user;
            } else {
                let password = crypto.randomBytes(256).toString('hex');
                User.create({
                    name: payload.name,
                    email: payload.email,
                    password: password
                });
            }
        }).then(user => {
            let token = UserController.jwtSignUser(user);
            res.status(201).json({
                accessToken: token
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({error: 'Internal server error'});
        })
    }

    static jwtSignUser(user) {
        return jwt.sign({
            id: user.id,
            name: user.name,
            email: user.email
        }, process.env.JWT_SECRETKEY);
    }
}

module.exports = UserController;