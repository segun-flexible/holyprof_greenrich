const logger = require("../helpers/logger");
const db = require("../models/db");


exports.generalData = (req,res,next) => {
    db.query("SELECT * FROM f_website_settings", async (err, datas) => {
        if (err) {
            logger.debug(err)
        } else {
            let data = datas[0];

            res.app.locals.shortUrl = req.originalUrl
            res.app.locals.longUrl = req.protocol + "://" + req.get('host') + req.originalUrl
            
            
            res.app.locals.websiteDetails = data;
            next()
        }
        })
}