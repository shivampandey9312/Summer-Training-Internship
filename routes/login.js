const express = require('express');
const loginRouter = express.Router();
const path = require('path');
const userModel = require('../models/user');


loginRouter.route('/')
.get((req,res,next)=>{
    res.sendFile(path.join(__dirname, '../public/login.html'));
})
.post((req,res,next)=>{
    if(!req.session.user) {
        
        var username = req.body.phone;
        var password = req.body.password;
      
        userModel.findOne({phone: username})
        .then((user) => {
          if (user === null) {
            var err = new Error('User ' + username + ' does not exist!');
            err.status = 403;
            res.render('login',{
                err:{
                    msg1:"User not found, please register ===>",
                    msg2:"NOT FOUND"
                }
            });
          }
          else if (user.password !== password) {
            var err = new Error('Incorrect Password!');
            err.status = 403;
            res.render('login',{
                err:{
                    msg1:"",
                    msg2:err.message
                }
            });
          }
          else if (user.phone === username && user.password === password) {
            req.session.user = 'authenticated';
            req.session.phone = user.phone;
            res.statusCode = 200;
            res.redirect('/donate');
          }
        })
        .catch((err) => next(err));
      }
      else {
        res.statusCode = 200;
        res.redirect('/donate')
      }
})


module.exports = loginRouter;