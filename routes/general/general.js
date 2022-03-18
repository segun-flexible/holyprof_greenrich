
const { getContact, postContact } = require("../../controllers/general/contact");
const { homePage } = require("../../controllers/general/home");
const { investJobGet } = require("../../controllers/general/job");
const { getPackagesGet } = require("../../controllers/general/packages");
const { getPageView } = require("../../controllers/general/page");
const { generalData} = require("../../middleware/generalData");
const { isAdmin } = require("../../middleware/isAuth");
const { userDetails } = require("../../middleware/userInfo");
const generalRoute = require("express").Router();

//HOMEPAGE
generalRoute.route("/").get(generalData, userDetails, homePage)

//PAGE
generalRoute.route("/page/:slug").get(generalData, userDetails, getPageView)

//CONTACT US
generalRoute.route("/contact-us").get(generalData, userDetails, getContact).post(postContact)

//PACKAGES
generalRoute.route("/packages").get(generalData, userDetails, getPackagesGet)

//INVESTMENT JOB
generalRoute.route("/job").get(isAdmin, investJobGet)


module.exports = generalRoute