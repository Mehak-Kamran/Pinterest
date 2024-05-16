var express = require('express');
var router = express.Router();
var passport=require("passport");
const usermodel=require("./users");
const postmodel=require("./post")
const localStrategy=require("passport-local");
const upload=require("./multer")//import multer middleware setup
passport.use(new localStrategy(usermodel.authenticate()));


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index',{nav:false});
});

router.get("/register",function(req,res){
  res.render("register",{nav:false});
})

router.get("/profile",isLoggedIn,async function(req,res){
  const user = await usermodel.findOne({username:req.session.passport.user})
  res.render("profile",{user,nav:true});
})
//add new post route
router.get("/add",isLoggedIn,async function(req,res){
  const user = await usermodel.findOne({username:req.session.passport.user})
  res.render("add",{user,nav:true});
})

//create post
router.post("/createpost",isLoggedIn,upload.single("postimage"),async function(req,res){
  const user = await usermodel.findOne({username:req.session.passport.user})
  res.render("add",{user,nav:true});
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

//fileupload route
router.post("/fileupload",isLoggedIn,upload.single("image"),async (req,res,next)=>{
  //  if(!req.file){
  //   return res.status(400).send("No files were uploaded");
  //  }

   const user = await usermodel.findOne({username:req.session.passport.user})//through this we have find user
   user.profileImage=req.file.filename
   await user.save();
   res.redirect("/profile");
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
