const transporter = require("../transporter");
const ejs = require("ejs")
const path = require("path");
const { getWebSettings } = require("../../helpers/settings");
const logger = require("../../helpers/logger");



exports.notifyAwaitMergeSender = async (obj) => {

    //GET Site Email
    const {website_title, website_email, website_url, website_currency,website_logo} = await getWebSettings()
    //Get The Template
    const html = await ejs.renderFile(path.join(process.cwd(),"email","templates","notifyAwaitingMerge.ejs"),{obj,website_title,website_url,website_currency,website_logo});

    const mailOptions = {
    from: `${website_title} <${website_email}>`,
    to: obj.email,
    subject: 'You Have Been Merge With A Receiver!',
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