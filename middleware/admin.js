const jwt=require('jsonwebtoken');

const User=require("../models/user");
admin=async(req,res,next)=>{
try{
const token=req.header('x-auth-token');
if(!token){
    return res.status(401).json({msg:"No auth token, access denied"});
}
const verify=jwt.verify(token,'passwordkey');
if(!verify){
    return res.status(401).json({msg:"Token verification, access denied"});
}
const user = await User.findById(verified.id);
if (user.type == "user" || user.type == "seller") {
  return res.status(401).json({ msg: "You are not an admin!" });
}
req.user = verify.id;
req.token = token;
next();

}
catch(e){
    res.status(500).json({error:e.message});
}
};
module.exports=admin;