const express = require('express');
const donateRouter = express.Router();
const userModel = require('../models/user');

donateRouter.route('/')
.get((req,res,next) => {
    userModel.findOne({phone:req.session.phone})
    .then((user) => {
        if(user == null){
          console.log("user not found");
          res.redirect('/register');
        }
        res.render('donate', {
            user: {
              name: user.name,
              amount: user.amount,
              lastDonated:
                user.createdAt - user.updatedAt == 0
                  ? 'Never.'
                  : user.updatedAt,
            }
          });
    })
    .catch((err)=>{next(err);});
    
})

.post((req,res,next)=>{
  if (req.body.amount == undefined || req.body.amount <= 0) {
    res.redirect('back');
    return;
  }
  userModel.findOne({ phone: req.session.phone }, function (err, user) {
    if (err) res.send(err);
    if (!user) {
      res.redirect('/logout');
      console.error('should not happen.');
      return;
    }
    user.amount += parseFloat(req.body.amount);
    user
      .save({
        validateBeforeSave: true,
      })
      .then(res.redirect('/donate'))
      .catch((err) => {
        res.send(err.message);
      });
  });
})

module.exports = donateRouter;