const { sendCampaign } = require("../email/mails/sendCampaign");
const { getCampaign, updateCampaign } = require("../helpers/campaign");
const CronJob = require('cron').CronJob;

//This Job Running Every 12 oclock
new CronJob('* * * * *', async function () {
    const campaigns = await getCampaign();

    let emails = JSON.parse(campaigns[0].mail_rec);
    

    
    if (emails.length) {
            
       
        let receievers = emails.splice(0, 2).reduce((acc, cur) => {
                acc.push(cur);
                return acc
        }, []);

        //Send Mail
        for (i = 0; i < receievers.length;i++){
            
            sendCampaign({
                user: receievers[i]
            })
            
        }
        
        
        //Save The Unreciever Mailer
        await updateCampaign({ mail_rec: JSON.stringify(emails) })
        
            
        
    }
    
    
}, null, true, "Africa/Lagos");
