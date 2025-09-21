const express=require('express')
const cors = require("cors");
const User=require('./Models/userModel.js')
const UserRoute=require('./Routes/route.js')
const connectDb=require('./config/db.js')



connectDb();
const app =express()
app.use(express.json())
app.use(
  cors({
    origin: "http://localhost:5173",  // React dev server URL
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true
  })
);

app.use(express.urlencoded({extended:false}))

app.use("/api",UserRoute);
app.get('/',(req,res)=>{
    res.send("hellon")
})




app.listen(3000,()=>{
    console.log("server is running")
})

