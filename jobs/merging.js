
const { notifyAwaitMergeSender } = require("../email/mails/awaitingMerge");
const { getPendingMerge, updateMergeById } = require("../helpers/merge");
const { userGetPlanById } = require("../helpers/plans");
const { getUserById } = require("../helpers/user");
const CronJob = require('cron').CronJob;

//This Job Running Every 10Mins oclock
new CronJob('* * * * *', async function () {
    
    const merges = await getPendingMerge();
   
    await merges.forEach(async mg => {
        //Update The Merge
        await updateMergeById(mg.mt_id, { mt_status: 1 });

        //Get The Plan Price
        const { plan_price } = await userGetPlanById(mg.mt_plan_id);
        const user = await getUserById(mg.mt_sender_id);
        
        user.amount = plan_price;

        notifyAwaitMergeSender(user);

    });
}, null, true, "Africa/Lagos");


