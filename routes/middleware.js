function authentication(req,res,next){
    console.log(req.session.userid)
    if(req.session.userid) {
      req.user = true;
       next();
    }
    else {
      res.render('login',{msg:'Wrong Credentials'})
      next()
    }
  }


  module.exports = {
    authentication
  }