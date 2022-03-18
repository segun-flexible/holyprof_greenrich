const db = require("../models/db");

//GET CAMPAIGN
exports.getCampaign = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM f_mailer WHERE mail_status = 1", (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
};

exports.updateCampaign = (obj) => {
    return new Promise((resolve, reject) => {
        db.query("UPDATE f_mailer SET ?", obj,(err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
};

