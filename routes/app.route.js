const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
var moment = require('moment');
//--------------------Dummy Database-----------------------------------
// users = [];

// function User(id, userName, password, firstName, lastName, role, createdAt, updateAt) {
//     return {
//         id,
//         userName,
//         password,
//         firstName,
//         lastName,
//         role,
//         createdAt,
//         updateAt
//     }
// }
// router.post('/login', (req, res) => {
//     if (req.body.userName === "admin" && req.body.password === "12345678") {
//         const accessToken = jwt.sign(req.body.username, process.env.PRIVATEKEY_ACCESSTOKEN);
//         res.json({ accessToken: accessToken })
//     } else {
//         res.sendStatus(401)
//     }
// })

// router.get('/users', verifyToken, (req, res) => {
//     const user_arr = users.map(user => {
//         return user.firstName + " " + user.lastName + "_" + user.role;
//     })
//     res.send(user_arr)
// })

// router.post('/users', verifyToken, (req, res) => {
//     const new_user = new User(req.body.id, req.body.userName, req.body.password, req.body.firstName, req.body.lastName, req.body.role, req.body.createAt, req.body.updateAt)
//     users.push(new_user);
//     res.json("Create success")
// })

// router.get('/users/:id', verifyToken, (req, res) => {
//     const user = users.find(element => element = req.params.id)

//     console.log(user)
//     res.send(user.firstName + " " + user.lastName + "_" + user.role);
// })

// router.put('/users/:id', verifyToken, (req, res) => {
//     const update_user = users.find(element => element = req.params.id)
//     const user_index = users.findIndex(element => element == req.params.id)

//     if (req.body.userName) {
//         update_user.userName = req.body.userName;
//     }
//     if (req.body.password) {
//         update_user.password = req.body.password;
//     }
//     if (req.body.firstName) {
//         update_user.firstName = req.body.firstName;
//     }
//     if (req.body.lastName) {
//         update_user.lastName = req.body.lastName;
//     }
//     if (req.body.role) {
//         update_user.role = req.body.role;
//     }
//     if (req.body.createdAt) {
//         update_user.createdAt = req.body.createdAt;
//     }
//     if (req.body.updateAt) {
//         update_user.updateAt = req.body.updateAt;
//     }
//     users[user_index] = update_user;
//     res.send(update_user)
// })

// router.delete('/users/:id', verifyToken, (req, res) => {
//     const user_index = users.findIndex(element => element == req.params.id)
//     users.splice(user_index, 1)
//     res.send(users)

// })

//--------------------Mongodb Database-----------------------------------
const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    userName: String,
    password: String,
    firstName: String,
    lastName: String,
    role: String,
    createdAt: Date,
    updateAt: Date,
})
const User = mongoose.model('User', userSchema);

router.post('/login', (req, res) => {
    if (req.body.userName === "admin" && req.body.password === "12345678") {
        const accessToken = jwt.sign(req.body.username, process.env.PRIVATEKEY_ACCESSTOKEN);
        res.json({ accessToken: accessToken })
    } else {
        res.sendStatus(401)
    }
})

router.get('/users', verifyToken, (req, res) => {
    User.find()
        .then(user => res.json(user))
        .catch(err => {
            res.sendStatus(500)
        })
})

router.post('/users', verifyToken, (req, res) => {
    const user = new User({
        userName: req.body.userName,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        role: req.body.role,
        createdAt: req.body.createdAt,
        updateAt: req.body.updateAt,
    })
    user.save()
        .then(() => res.send("Create success"))
        .catch(err => res.send(err))
})

router.get('/users/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => res.json(user))
        .catch(err => (res.sendStatus(500)))
})
router.put('/users/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, {
            userName: req.body.userName,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            role: req.body.role,
            createdAt: req.body.createdAt,
            updateAt: req.body.updateAt,
        })
        .then(user => res.json(user))
        .catch(err => res.sendStatus(500))
})
router.delete('/users/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id)
        .then(() => res.send("Delete success"))
        .catch(err => res.sendStatus(500))
})


function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const token = bearerHeader.split(' ')[1];
        if (token == null) return res.sendStatus(401)
        jwt.verify(token, process.env.PRIVATEKEY_ACCESSTOKEN, (err, user) => {
            if (err) return res.sendStatus(403)
            else {
                next()
            }
        })
    } else {
        res.sendStatus(403)
    }
}
module.exports = router;