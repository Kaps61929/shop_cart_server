const express =require("express");
const authRouter=express.Router();
const User=require("../models/user");
const bcryptjs=require("bcryptjs");
const jwt=require("jsonwebtoken");
const user = require("../models/user");
const auth=require("../middleware/auth");
authRouter.post('/api/signup',async(req,res)=>{
   try{
      const {name,email,password}=req.body;
      console.log(req.body);
      const existinguser=await User.findOne({email});
      if(existinguser){
   return res.status(400).json({msg:"User already exist"});
      }
   const hasedpassword=await bcryptjs.hash(password,8);
      let user =new User({name,email,password:hasedpassword});
   user=await user.save();
   res.json({user});
   console.log(req.body);
   //version and id(like unique id of file)
   }
   catch(e){
      res.status(500).json({error:e.message})
   }
  
})

authRouter.post('/api/signin',async(req,res)=>{
   try{
     const {email,password}=req.body;
     const existinguser2=await User.findOne({email});
     if(!existinguser2){
      return res.status(400).json({msg:"User does not exist"});
         }
       const ismatch=await bcryptjs.compare(password,existinguser2.password);
       if(!ismatch){
         return res.status(400).json({msg:"Incorrect password."});
       }
       else{
       const token=jwt.sign({id:existinguser2._id},"passwordkey");
       res.json({token,...existinguser2._doc});
       }
   }
   catch(e){
      res.status(500).json({error:e.message});
   }
})
authRouter.post('/tokenIsValid',async(req,res)=>{
   try{
    const token=req.header('x-auth-token');
if(!token){
  return res.json(false);
}
const verified=jwt.verify(token,'passwordkey');
if(!verified) return res.json(false);
const user=User.findById(verified.id);
if(!user) res.json(false);
res.status(200).json(true);
   }
   catch(e){
      res.status(500).json({error:e.message});
   }
})
authRouter.get('/',auth,async(req,res)=>{
 const user=await User.findById(req.user);
 return res.json({...user._doc,token:req.token});
})
module.exports=authRouter;