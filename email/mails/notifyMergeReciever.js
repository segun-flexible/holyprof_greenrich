const transporter = require("../transporter");
const ejs = require("ejs")
const path = require("path");
const { getWebSettings } = require("../../helpers/settings");
const logger = require("../../helpers/logger");



exports.notifyMergeRecieverMailer = async (obj) => {

    //GET Site Email
    const {website_title, website_email, website_url, website_currency,website_logo} = await getWebSettings()
    //Get The Template
    const html = await ejs.renderFile(path.join(process.cwd(),"email","templates","notifyMergeRecieverMailer.ejs"),{obj,website_title,website_url,website_currency,website_logo});

    const mailOptions = {
    from: `${website_title} <${website_email}>`,
    to: obj.email,
    subject: 'You Have Been Merge With A User!',
    html
    };

    transporter.sendMail(mailOptions, (err, result) => {
        if (err) {
            console.log(err)
            logger.debug(err)
        } else {
            console.log(result)
        }
    })

    
}

exports.notifyAdminMergeRecieverMailer = async (obj) => {

    //GET Site Email
    const {website_title, website_email, website_url, website_currency,website_logo} = await getWebSettings()
    //Get The Template
    const html = await ejs.renderFile(path.join(process.cwd(),"email","templates","notifyAdminMergeRecieverMailer.ejs"),{obj,website_title,website_url,website_currency,website_logo});

    const mailOptions = {
    from: `${website_title} <${website_email}>`,
    to: obj.email,
    subject: `A User Has Sent You ${website_currency}${obj.amount} For Investment Plan!`,
    html
    };

    transporter.sendMail(mailOptions, (err, result) => {
        if (err) {
            console.log(err)
            logger.debug(err)
        } else {
            console.log(result)
        }
    })

    
}


exports.notifyMergeSenderMailer = async (obj,plan) => {

    //GET Site Email
    const {website_title, website_email, website_url, website_currency,website_logo} = await getWebSettings()
    //Get The Template
    const html = await ejs.renderFile(path.join(process.cwd(),"email","templates","notifyMergeSenderMailer.ejs"),{obj,website_title,website_url,website_currency,website_logo,plan});

    const mailOptions = {
    from: `${website_title} <${website_email}>`,
    to: obj.email,
    subject: 'Your Investment Plan Have Started!',
    html
    };

    transporter.sendMail(mailOptions, (err, result) => {
        if (err) {
            console.log(err)
            logger.debug(err)
        } else {
            console.log(result)
        }
    })

    
}