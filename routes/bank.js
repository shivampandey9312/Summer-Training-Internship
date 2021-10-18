const express = require('express');
const bankRouter = express.Router();
const userModel = require('../models/user');

const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  };

bankRouter.route('/')
.get((req,res,next)=>{
    if(req.session == null){
        res.redirect('/register');
    }
    
    if (req.query.blood == undefined || req.query.blood == '')
    req.query.blood = '(A|B|O|AB)';

  if (req.query.rh != undefined) req.query.blood += escapeRegExp(req.query.rh);
  else req.query.blood += '[\\+-]';

  if (req.query.city == undefined) req.query.city = '';

  var page = req.query.page;
  if (page === undefined || page < 1) page = 1;

  var query = {
    $and: [
      { bloodGroup: { $regex: req.query.blood, $options: 'i' } },
      { city: { $regex: req.query.city, $options: 'i' } },
    ],
  };

  userModel.find(
    query,
    null,
    {
      sort: {
        amount: -1,
      },
      limit: 18,
      skip: (page - 1) * 18,
    },
    function (err, docs) {
      if (err) res.send(err);
      res.render('bank', { docs: docs, logged: req.session });
    }
  );
});

module.exports = bankRouter;