const jwt = require('jsonwebtoken');
const { User } = require('../models');

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

    static jwtSignUser(user) {
        return jwt.sign({
            userId: user.id,
            name: user.name,
            email: user.email
        }, process.env.JWT_SECRET);
    }
}

module.exports = UserController;