const mongoose=require('mongoose');
const { productSchema } = require('./product');


const userschema=mongoose.Schema({
    name:{
        required:true,
        type:String,
        trim:true
    },
    email:{
        required:true,
        type:String,
        trim:true,
        validate:{
            validator:(value)=>{
                const re=/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;  
              //  return value.match(re);
            }
           ,
           message:"Please enter a valid email address"
         }},
        password:{
            required:true,
            type:String,
        },
        address:{
            default:"",
            type:String
        },
        type:{
           type:String,
           default:"user"
        }
        ,
        cart:[
{
    product:productSchema,
    quatity:{
        type:Number,
        required:true
    }
}
        ]
    
    }
);
const user=mongoose.model("User",userschema);
module.exports=user;