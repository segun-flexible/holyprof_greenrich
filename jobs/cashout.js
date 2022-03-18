const { getAllAdmins } = require("../helpers/admin");
const CronJob = require('cron').CronJob;
const { getAdminInvestmentAmount } = require("../helpers/investment");
const { getAdminWithdrawalAmount, getWithdrawaltHistory, editWithdrawalById } = require("../helpers/withdrawal");
const { hasBeenMerged } = require("../helpers/merge");
const { notifySenderAdmin } = require("../email/mails/cashout");

//This Job Running Every 2hr oclock
new CronJob('* * * * *', async function () {
    
    const admins = await getAllAdmins();
    for (i = 0; i < admins.length; i++){
        admins[i].totalInvestment = await getAdminInvestmentAmount(admins[i].uid)
        admins[i].totalWithdrawal = await getAdminWithdrawalAmount(admins[i].uid)
        admins[i].avalBalance = admins[i].totalInvestment - admins[i].totalWithdrawal;
    }

    //GET ALL PENDING WITHDRAWAL
    const pendingWithdrawal = await getWithdrawaltHistory("", "0", 999999999999, 0);
    for (i = 0; i < pendingWithdrawal.length; i++){
        //CHeck If User Has Been Merged
        const hasMerged = await hasBeenMerged(pendingWithdrawal[i].uid);
  
        //IF USER IS NOT MERGE THEN FILL HIS WITHDRAWAL WITH AN ADMIN
        if (!hasMerged && !pendingWithdrawal[i].h_sender_id) {
            //This Function Check Admins That Have Money To Pay This Loop User
            const loadedAdmin = admins.filter(la => la.avalBalance >= pendingWithdrawal[i].h_amount_requested);

            //If Anyone Is Available
            if (loadedAdmin.length) {
                const adminToPay = loadedAdmin[Math.floor(Math.random() * loadedAdmin.length)];
                
                //Temporary Deduct The Admin Money
                adminToPay.avalBalance = adminToPay.avalBalance - pendingWithdrawal[i].h_amount_requested;

                //FIll The User With The Admin
                await editWithdrawalById(pendingWithdrawal[i].h_id, {
                    h_user_type: 1,
                    h_sender_id: adminToPay.uid
                });

                //Send Notification To The Sender (Admin)
                notifySenderAdmin({...adminToPay,amount:pendingWithdrawal[i].h_amount_requested},pendingWithdrawal[i])

            }
            
        }
    }
    

    
}, null, true, "Africa/Lagos");


