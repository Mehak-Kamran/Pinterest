const mongoose=require("mongoose");
const plm=require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/pinterest")

const userSchema=mongoose.Schema({
  username:String,
  name:String,
  password:String,
  email:String,
  contact:Number,
  profileImage:String,
  board:{
    type:Array,
    default: []
  }
});

userSchema.plugin(plm);

const usermodel=mongoose.model("usermodel",userSchema);
module.exports=usermodel;