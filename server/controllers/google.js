const { User } = require('../models')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwt = require('jsonwebtoken');

require('dotenv').config()
let sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

class Google {
    static login(req, res) {
        const token = req.body.token
        let check = false
        let newUser = {}
        client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        })
            .then(data => {
                const payload = data.getPayload()
                newUser.name = payload.name
                newUser.email = payload.email
                newUser.password = 'password@123'

                return User.findOne({
                    where: { email: payload.email }
                })
            })
            .then(userData => {
                if (userData) {
                    return userData
                } else {
                    check = true
                    return User.create(newUser)
                }
            })
            .then(newData => {
                let objUser = {
                    userId: newData.id,
                    name: newData.name,
                    email: newData.email,
                }
                console.log(check)
                if (check) {
                    let request = sg.emptyRequest({
                        method: 'POST',
                        path: '/v3/mail/send',
                        body: {
                            personalizations: [
                                {
                                    to: [
                                        {
                                            email: newData.email
                                        }
                                    ],
                                    subject: 'Watch List'
                                }
                            ],
                            from: {
                                email: 'noreply@example.com'
                            },
                            content: [
                                {
                                    type: 'text/plain',
                                    value: `Terima kasih sudah bergabung dengan movielist`
                                }
                            ]
                        }
                    });

                    sg.API(request)
                        .then(function (response) {
                            console.log(response.statusCode);
                            console.log(response.body);
                            console.log(response.headers);
                        })
                }

                const accessToken = jwt.sign(objUser, 'secret')
                res.status(201).json({ accessToken })
            })
            .catch(err => {
                res.status(500).json({ err })
            })
    }
}

module.exports = Google