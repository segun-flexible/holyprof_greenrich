const db = require("../models/db");
const { calculatePercentage } = require("./calculation");
const { editUserById } = require("./user");

//JOB CREDIT USER
exports.jobCreditUsers = (inv,lastDay) => {
    return new Promise(async(resolve, reject) => {
        const dailyRoi = calculatePercentage((inv.r_roi / inv.r_total_duration), inv.r_plan_price);

        if (lastDay) {
            await this.creditRoiBalance(inv.r_user_id, (dailyRoi + inv.r_plan_price))
        } else {
            await this.creditRoiBalance(inv.r_user_id, dailyRoi)
        }

        resolve()
        
    })
};


exports.creditRoiBalance = (userId,amount) => {
    return new Promise(async(resolve, reject) => {
        db.query(`UPDATE f_users SET roi_balance = roi_balance + ${amount} WHERE uid = ${userId}`, (err, data) => {
            if (err) reject(err)
            else resolve()
        })
        
    })
};
