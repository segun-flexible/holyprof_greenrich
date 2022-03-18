const { calculatePercentage } = require("../helpers/calculation");
const { completeAllUserInvestmentHistory } = require("../helpers/history");
const { getAllInvestmentRecords, editInvestmentRecordsById, deleteInvestmentRecordsById, getUserInvestmentRecords } = require("../helpers/investment");
const { jobCreditUsers, creditRoiBalance } = require("../helpers/mics");
const db = require("../models/db");
const CronJob = require('cron').CronJob;

//This Job Running Every 12 oclock
new CronJob('0 1 * * *', async function () {
    
    const investment = await getAllInvestmentRecords();
   
    for (let i = 0; i < investment.length; i++) {
       
        if (investment[i].r_duration <= 1) {

            //Credit ROI and Capital
            jobCreditUsers(investment[i],true);
            
            completeAllUserInvestmentHistory(investment[i].r_history_id)
            //Delete Record
            deleteInvestmentRecordsById(investment[i].r_id);

        } else {
            
            //Credit ROI Only
            jobCreditUsers(investment[i], false);
           
            //Deduct Duration
            editInvestmentRecordsById(investment[i].r_id, { r_duration: investment[i].r_duration - 1 });
            
        }

    }
    /* await investment.forEach(async inv => {
        
        //Check If 1 Days Left
  
        if (inv.r_duration === 1) {

            //Credit ROI and Capital
            jobCreditUsers(inv,true);
            
            completeAllUserInvestmentHistory(inv.r_history_id)
            //Delete Record
            deleteInvestmentRecordsById(inv.r_id);

        } else {
            
            //Credit ROI Only
            jobCreditUsers(inv, false);
           
            //Deduct Duration
            editInvestmentRecordsById(inv.r_id, { r_duration: inv.r_duration - 1 });
            
        }
        
    }); */
}, null, true, "Africa/Lagos");


