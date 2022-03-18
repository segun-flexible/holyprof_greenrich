const express = require('express');
const cors = require("cors");
const helmet = require("helmet");
const hpp = require("hpp");
const path = require('path');
const cookieParser = require('cookie-parser');
const errorMiddleWare = require("./middleware/errorMiddleware");
const logger = require("./helpers/logger");
const authRoute = require("./routes/auth/auth");
const userRoute = require("./routes/user/user");
const adminRoute = require("./routes/admin/admin");
const { moreInfo } = require("./middleware/userInfo");
const generalRoute = require("./routes/general/general");
const { isUserLogin } = require("./middleware/isAuth");




try {



//Require ENV
require("dotenv").config()


//Required Database
require('./models/db');

const app = express();

//Cors
app.use(cors({origin:"*",credentials:true}))


//Helmet

  app.use(helmet(
  {
    contentSecurityPolicy: false,
  }
))


//Hpp Security
app.use(hpp())

  // view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

  

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join('public')));

//JOB
require("./jobs/investment")
require("./jobs/merging")
require("./jobs/cashout")
require("./jobs/campaign")
  
//Routes
  
//GENERAL ROUTE
app.use("/",generalRoute)

//AUTH ROUTE
app.use("/",authRoute)

//USER ROUTE
app.use("/user",moreInfo(app), userRoute)

//ADMIN ROUTE
app.use("/admin", isUserLogin, adminRoute)



//Error Middleware
app.use(errorMiddleWare)


app.listen(9000,()=>console.log("App Started On Port 9k")) 
  

process.on('uncaughtException', function (err) {
  logger.debug(err)
    
});

process.on('unhandledRejection', (reason, promise) => {
  logger.debug(reason)
})




  
} catch (error) {
  logger.debug(error)
}