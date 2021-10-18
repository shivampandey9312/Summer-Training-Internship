const express = require('express');
const logoutRouter = express.Router();

logoutRouter.route('/')
.get((req,res,next)=>{
    if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id');
      }
      else {
        var err = new Error('You are not logged in!');
        err.status = 403;
        next(err);
      }
    res.redirect('/');
});

module.exports = logoutRouter;
