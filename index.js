const express=require('express');
const { Mongoose, default: mongoose } = require('mongoose');
const productRouter = require("./routes/product");
const authRouter=require('./routes/auth');
const adminRouter=require('./middleware/admin');
const userRouter=require('./routes/user');
// init
const  port=process.env.PORT || 8123;
var  ip="192.168.77.225";
var app =express();
const user = require("../server/models/user");
//middleware
app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);

const DB_uri="mongodb+srv://krishna:mahakaal000@cluster0.zlt8n3l.mongodb.net/?retryWrites=true&w=majority"
mongoose.set('strictQuery', true);
mongoose.connect(DB_uri).then(
    ()=>console.log("Connected to DB sucessfully")
    ).catch(
        (e)=>{console.log(e);}
        )  


app.listen(port,()=>{
    console.log(`Connected at port ${port}`);
})  
  