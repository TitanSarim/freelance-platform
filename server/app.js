const cookieParser = require("cookie-parser");
const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const errorMiddleware = require("./middleware/error")

const path = require('path')

const app  = express();


// config
if(process.env.NODE_ENV !== "PRODUCTION"){
    require("dotenv").config({path:"server/config.env"})
}

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'storage/images')));
app.use('/profileImages', express.static(path.join(__dirname, 'profileImages')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Route Imports
const user = require("./routes/userRoute");
const avatar = require("./routes/avatarRoute");
const project = require("./routes/projectRoute");
const setting = require('./routes/accountRoute');
const profile = require("./routes/profileRoute");
const wallet = require("./routes/walletRoute");
const order = require("./routes/orderRoute");
const category = require("./routes/categoryRoute");

app.use("/api/v1", user);
app.use("/api/v1", avatar);
app.use("/api/v1", project);
app.use("/api/v1", setting);
app.use("/api/v1", profile);
app.use("/api/v1", wallet);
app.use("/api/v1", order);
app.use("/api/v1", category);

// app.use(express.static(path.join(__dirname,"../frontend/build")));

// app.get("*", (req, res)=>{
//     res.sendFile(path.resolve(__dirname,"../frontend/build/index.html"))
// })

// Middleware for erroe
app.use(errorMiddleware)


module.exports = app