var express = require('express');
var router = express.Router();
var passport=require("passport");
const usermodel=require("./users")
const localStrategy=require("passport-local");
passport.use(new localStrategy(usermodel.authenticate()));


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get("/register",function(req,res){
  res.render("register");
})

router.get("/profile",isLoggedIn,function(req,res){
  res.render("profile");
})

//register
router.post("/register",function(req,res){
  var userdata=new usermodel({
    username:req.body.username,
    email:req.body.email,
    contact:req.body.contact,
  });
  usermodel.register(userdata,req.body.password)
     .then(function(registereduser){
      passport.authenticate("local")(req,res,function(){
        res.redirect("/profile");
      })
     })
});

//code for login
router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",//if user is authentic go to profile page
  failureRedirect: "/"//if not then redirect to homepage
}),function(req,res){ })

//logout
router.get('/logout',function(req,res,next){
  req.logout(function(err){//if someone want to logout , log him out
    if (err){ return next(err); }
    res.redirect("/");//and redirect him to home page
  });
});

//isloggedin middleware
function isLoggedIn(req,res,next){//protection from unreg people
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
}


module.exports = router;
