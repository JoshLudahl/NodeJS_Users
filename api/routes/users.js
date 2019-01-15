const express = require("express");
const router = express.Router();
//  const settings = require('../../settings');
const mongoose = require("mongoose");
const User = require("../models/user");
//  const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
//  const jwt_check = require("../middleware/jwt_authorize");
//  Uncomment and use auth for securing an additional route
//  const auth = require('../middleware/user_check')

//  Default to load login
router.get('/', (req, res, next) => {
  res.render('pages/user/login');
});
// GET Login
router.get('/login', (req, res, next) => {
  res.render('pages/user/login');
});
//  Get Register page
router.get('/register', (req, res, next) => {
  res.render('pages/user/register');
});

//  Get ALL users
router.get("/users", (req, res, next) => {
  User.find()
    .exec()
    .then(docs => {
      res.status(200).json(docs);
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

//  Get ONE user
router.get("/:user", (req, res, next) => {
  const userId = req.params.user;
  User.findById(userId)
    .exec()
    .then(doc => {
      if (doc) {
        console.log(req.session.userId);
        res.status(200).json({
          message: "User found",
          email: doc.email,
          userId: doc._id
        });
      } else {
        res.status(404).json({
          message: "404 - Item not found."
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

//  Create ONE user (register)
router.post("/", (req, res, next) => {
  User.find({
      email: req.body.email
    })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Username/email not available"
        });
      } else {
        if (req.body.password == req.body.password2) {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({
                error: err
              });
            } else {
              const user = new User({
                _id: new mongoose.Types.ObjectId(),
                password: hash,
                email: req.body.email
              });

              //  change to async?
              User.create(user)
                .then(result => {
                  //  do something if need be, maybe log in, or whatever
                })
                .catch(err => console.log(err));
              res.status(201).json({
                message: "Okay, POST was good",
                createdUser: {
                  id: user._id,
                  email: user.email
                }
              });
            }
          });
        }
        res.status(200).json({
          message: 'passwords do not match'
        });
      }
    });
});

//  POST Login
router.post("/login", (req, res, next) => {
  User.find({
      email: req.body.email
    })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Authorizaion has failed(1)."
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Authorization has failed (2)."
          });
        }

        if (result) {
          //  Uncomment if implementing JWT
          // const token = jwt.sign({
          //     email: user[0].email,
          //     userId: user[0]._id
          //   },
          //   settings.JWT_KEY, {
          //     expiresIn: "1h"
          //   }
          // );

          //  Add userId to the session variable
          req.session.userId = user[0]._id;

          if (req.session) console.log(req.session);
          res.redirect('/admin');

          //  Uncomment if implementing JWT
          // return res.status(200).json({
          //   message: "Authorization Successful",
          //   token: token
          // });
        } else {
          res.status(401).json({
            message: "Authorization Failed(3)."
          });
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: 'Error logging in.'
      });
    });
});

//  UPDATE one user
router.patch('/:id', async (req, res, next) => {
  try {
    const updater = await User.findOneAndUpdate({
      _id: req.params.id
    }, req.body);

    if (updater != null) {

      res.status(200).json({
        message: "User Updated",
        updated: req.body
      });
    } else {
      res.status(404).json({
        message: "ERROR: Item not found."
      })
    }
  } catch (error) {
    res.status.apply(404).json({
      message: "Item not found."
    });
  }
});

//  Delete ONE user
router.delete("/:user", (req, res, next) => {
  const user = req.params.user;
  User.deleteOne({
      _id: user
    })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User removed"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;