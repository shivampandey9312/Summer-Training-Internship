var express = require('express');
var registerRouter = express.Router();
var userModel = require('../models/user');
const path = require('path');



registerRouter.route('/')
.get((req,res,next) => {
    res.sendFile(path.join(__dirname, '../public/register.html'));
})
.post((req, res, next) => {
    userModel.findOne({phone:req.body.phone})
    .then((user) => {
        if(user == null){
            new userModel({
                name: req.body.name.toUpperCase(),
                bloodGroup: req.body.blood.toUpperCase() + req.body.rh,
                city: req.body.city.toUpperCase(),
                phone: req.body.phone,
                amount: req.body.amount || 0,
                address: req.body.address,
                password:req.body.password
              })
                .save()
                .then((user)=>{
                    req.session.user = "authenticated";
                    req.session.phone = user.phone;
                    res.statusCode = 200;
                    res.redirect('/donate');
                })
                .catch((err) => {next(err);});
        }
        else {
            var err = new Error('User ' + req.body.phone + ' already exists!');
            res.status = 403;
            res.render('register',{msg:err.message});
        }
    })
    .catch((err) => {next(err);});
})

module.exports = registerRouter;