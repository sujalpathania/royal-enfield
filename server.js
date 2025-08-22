const express=require("express");
const app=express();
const authroute=require("./routes/authroutes")

const path=require("path");
const session = require("express-session");
app.use(express.json())
app.use(express.urlencoded())

app.use(session({
    secret: "tfgyhunjkml",
    resave: false,
    saveUninitialized: true
}));


 app.use(express.static(path.join(__dirname, "public")));

 app.use('/',authroute);
 
app.listen(3001,()=>{
console.log("server started...")
})