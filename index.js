// IMPORTS FROM PACKAGES
const express = require("express");
const mongoose = require("mongoose");
const adminRouter = require("./routes/admin");
// IMPORTS FROM OTHER FILES
const authRouter = require("./routes/auth");
const productRouter = require("./routes/product");
const userRouter = require("./routes/user");
const cluster = require("node:cluster");
const totalCPUs = require("node:os").cpus().length;

// INIT
const PORT = process.env.PORT || 3000;

const DB =
  "mongodb+srv://krishna:mahakaal000@cluster0.zlt8n3l.mongodb.net/?retryWrites=true&w=majority";
if (cluster.isMaster) {
  console.log(`Number of CPUs is ${totalCPUs}`);
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  //totalCPUs=1;
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster.fork();
  });
} else {
  const app = express();
  // middleware
  app.use(express.json());
  app.use(authRouter);
  app.use(adminRouter);
  app.use(productRouter);
  app.use(userRouter);
  app.get('/api/test',(req,res)=>{
    try{
    var sum=0;
    while(sum<1000000){
      sum++;
    }
    res.status(400).json({answer:sum});
  }catch(e){
    res.status(500).json(e);
  }
  })
  // Connections
  mongoose.set("strictQuery", false);
  mongoose
    .connect(DB)
    .then(() => {
      console.log("Connection Successful");
    })
    .catch((e) => {
      console.log(e);
    });

  app.listen(PORT, () => {
    console.log(`connected at port ${PORT}`);
  });
}
