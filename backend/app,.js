// SxiPEzRGicxqjaKl
// mongodb+srv://armantuto58:<password>@apisauces.6xfhnxh.mongodb.net/?retryWrites=true&w=majority

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path")

const souceRoutes = require("./routes/routerSouce")
const userRoutes = require("./routes/routerUser");

const app = express();

mongoose.connect("mongodb+srv://armantuto58:SxiPEzRGicxqjaKl@apisauces.6xfhnxh.mongodb.net/?retryWrites=true&w=majority")
.then(() =>{
    console.log("succesfully conected to mongoDb atlas");
})
.catch((error) =>{
    console.log("unable to connect to mongo db atlas")
    console.error(error)
});


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


  app.use(bodyParser.json());

  
  app.use("/images", express.static(path.join(__dirname,"images")))
  
  app.use("/api/sauces",souceRoutes)
  app.use("/api/auth", userRoutes );

module.exports = app;
