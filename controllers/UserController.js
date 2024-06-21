const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')//authentication
const jwtSecret = "mynameiskhan"
const Token = require('../models/tokenModel')
const crypto = require('crypto')
const sendEmail = require('../utils/setEmail')
const { expressjwt } = require("express-jwt")  //authorization


exports.createUser = async (req, res) => {
    const salt = await bcrypt.genSalt(10)
    let secPassword = await bcrypt.hash(req.body.password, salt)
    let user = new User({
        name: req.body.name,
        location: req.body.location,
        email: req.body.email,
        password: secPassword,
        //image: req.file.path,

    })
    //check if email is unique or not
    User.findOne({ email: user.email })
        .then(async data => {
            if (data) {
                return res.status(400).json({ error: 'Used email' })
            } else {
                user = await user.save()
                if (!user) {
                    return res.status(400).json({ error: 'not uploaded' })
                }
                //send token to database
                let token = new Token({
                    token: crypto.randomBytes(16).toString('hex'),
                    userId: user._id
                })
                token = await token.save()
                if (!token) {
                    return res.status(400).json({ error: 'failed to generate token' })
                }

                const url = process.env.FRONTEND_URL + '\/email\/confirmation\/' + token.token
                //send email
                sendEmail({
                    from: 'no-reply@foody.com',
                    to: user.email,
                    subject: "Email Verification Link",
                    text: `Hello \n Please verify your email by clicking below \n\n
                    http://${req.headers.host}/api/confirmation/${token.token} `,
                    html: `
                    <h1>Verify your Email</h1>
                    <a href='${url}'>Click to verify your email</a>`

                })
                res.send(user)
            }
        })
        .catch(err => {
            return res.status(400).json({ error: err })
        })

}

//email Confirmation

exports.postEmailConfirmation = (req, res) => {
    //at first find the valid or matching token

    Token.findOne({ token: req.params.token })
        .then(token => {
            if (!token) {
                return res.status(400).json({ error: 'invalid or expired token' })
            }
            //if valid token is found then find the valid user of that token
            User.findOne({ _id: token.userId })
                .then(user => {
                    if (!user) {
                        return res.status(403).json({ error: 'invalid user for the token' })
                    }
                    // check if user is already verified or not
                    if (user.isVerified) {
                        return res.status(400).json({ error: 'Email is already verified' })
                    }
                    // save the verified user

                    user.isVerified = true
                    user.save()
                        .then(user => {
                            if (!user) {
                                return res.status(400).json({ error: 'failed to verify' })
                            } else {
                                res.json({ message: 'Email Verified' })
                            }
                        }).catch(err => {
                            return res.status(400).json({ err: err })
                        })

                }).catch(err => {
                    return res.status(400).json({ err: err })
                })
        }).catch(err => {
            return res.status(400).json({ err: err })
        })

}



//login 

exports.login = async (req, res) => {
    let email = req.body.email
    try {
        let userData = await User.findOne({ email })
        if (!userData) {
            return res.status(400).json({ error: 'Invalid Email' })
        }
        const pwdCompare = await bcrypt.compare(req.body.password, userData.password)
        if (!pwdCompare) {

            return res.status(400).json({ error: 'Invalid password' })
        }
        if (!userData.isVerified) {
            return res.status(400).json({ error: "verify your email" })
        }
        const data = {
            user: {
                id: userData.id,
                role: userData.role

            }
        }
        const authToken = jwt.sign({ data }, jwtSecret)

        return (

            res.json({
                authToken: authToken,
                role: userData.role,
                id: userData._id,
                email: userData.email,
                name: userData.name

            }
                //         //localStorage.setItem("authToken",authToken))
            ))

    } catch (error) {
        console.log(error, "Provide valid information")

    }
}


//SignOut
exports.signOut = (req, res) => {
    res.clearCookie('myCookie')
    res.json({ message: 'Signed out Successfully' })
}




//forget password 

exports.forgetPwd = async (req, res) => {
    let email = req.body.email
    User.findOne({ email })
        .then(async data => {
            if (!data) {
                return res.status(400).json({ error: "email not present in DB" })

            }
            let token = new Token({
                token: crypto.randomBytes(16).toString('hex'),
                userId: data._id
            })
            token = await token.save()
            if (!token) {
                res.status(400).json({ error: 'token not generated' })
            }
            const url = process.env.FRONTEND_URL + '\/resetpassword\/' + token.token
            sendEmail({
                from: 'no-reply@foody.com',
                to: data.email,
                subject: "Pwd reset link Link",
                text: `hello \n your password reset link is \n
                http://${req.headers.host}/api/resetpassword/${token.token}`,
                html: `
                <a href='${url}'>Click to reset password</a>`
            })

        },

        ).catch(err => {
            return res.status(400).json("failed", err)
        })

}


//reset password
exports.resetPwd = async (req, res) => {
    try {
        Token.findOne({ token: req.params.token })
            .then(data => {
                if (!data) {
                    return res.status(300).json({ error: "token not found" })
                }
                User.findOne({ _id: data.userId })
                    .then(async id => {
                        if (!id) {
                            return res.status(301).json({ error: "invalid email for given token" })
                        } else {
                            const salt = await bcrypt.genSalt(10)
                            let secPassword = await bcrypt.hash(req.body.password, salt)
                            id.password = secPassword
                            id.save()
                            res.json({ message: 'password  has been reset' })
                        }
                    })
                    .catch(err => {
                        return res.status(302).json({ error: "email and token not matched", e: err })
                    })


            }).catch(err => {
                return res.status(400).json({ error: err })
            })
    } catch (err) {
        res.status(500).json({ error: "internal error" })
    }
}




//Display userDetail

exports.userDetail = async (req, res) => {

    const user = await User.findById(req.params.id)
    if (!user) {
        return res.status(400).json({ error: "invalid" })
    }
    res.send(user)
}


exports.userList = async (req, res) => {

    const userList = await User.find()
    if (!userList) {
        return res.status(400).json({ error: 'List not found' })
    }
    res.send(userList)
}

//admin middleware

exports.requireAdmin = (req, res, next) => {
    //verify jwt
    expressjwt({
        secret: jwtSecret,
        algorithms: ["HS256"],
        userProperty: 'auth'  //auth ko thau ma j use garda ni hunxa

    })(req, res, (err) => {
        if (err) {
            return res.status(401).json({ error: 'unauthorized' })
        }
        //check for user role
        if (req.auth.role === "1") {
            next();
        }
        else {
            return res.status(403).json({ error: 'you are not authorized ' })
        }
    })
}

//user middleware

exports.requireUser = (req, res, next) => {
    //verify jwt
    expressjwt({
        secret: jwtSecret,
        algorithms: ["HS256"],
        userProperty: 'auth'

    })(req, res, (err) => {
        if (err) {
            return res.status(401).json({ error: 'unauthorized' })
        }
        //check for user role
        if (req.auth.role === "1") {
            next();
        }
        else {
            return res.status(403).json({ error: 'you are not authorized ' })
        }
    })
}

exports.userEdit = async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        location: req.body.location,
        email: req.body.email,
        isVerified: false

    }, { new: true }
    )

    let token = new Token({
        token: crypto.randomBytes(16).toString('hex'),
        userId: user._id
    })
    token = await token.save()
    if (!token) {
        return res.status(400).json({ error: 'failed to generate token' })
    }

    const url = process.env.FRONTEND_URL + '\/email\/confirmation\/' + token.token
    sendEmail({
        from: 'no-reply@foody.com',
        to: user.email,
        subject: "Email Verification Link",
        text: `Hello \n Please verify your email by clicking below \n\n
        http://${req.headers.host}/api/confirmation/${token.token} `,
        html: `
        <h1>Verify your Email</h1>
        <a href='${url}'>Click to verify your email</a>`

    })

    if (!user) {
        return res.status(400).json({ error: "update failed" })
    }
    res.send(user)
}

exports.deleteUser = async (req, res) => {
    const id = req.params.id
    User.findByIdAndDelete(id)
        .then((user) => {
            if (!user) {
                return res.status(403).json({ error: 'item not found' })
            }
            else {
                return res.status(200).json({ message: "item Deleted" })
            }
        }).catch(err => {
            return res.status(400).json({ error: err })
        })
}