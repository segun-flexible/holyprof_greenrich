const db = require("../models/db")
const { calculatePercentage } = require("./calculation")
const { editUserById, getUserById } = require("./user")

//GET REFERRAL FOOTPRINT BY ID
exports.getReferralFootprintById = (uid) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM f_referrals_footprint WHERE ref_uid = ?", parseInt(uid),(err, data) => {
            if (err) reject(err)
            else resolve(data[0])
        })
    })
}

//GET REFERRAL DETAILS BY DOWNLINE (REFERREE)
exports.editReferralDetails = (referralID,obj) => {
    return new Promise((resolve, reject) => {
        db.query("UPDATE f_referrals SET ? WHERE r_id = ?", [obj, parseInt(referralID)],(err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}

//GET REFERRAL DETAILS BY DOWNLINE (REFERREE)
exports.getReferralDetails = (downlineId) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM f_referrals WHERE r2_id = ?", parseInt(downlineId),(err, data) => {
            if (err) reject(err)
            else resolve(data[0])
        })
    })
}


//CREDIT REFERRAL
exports.creditReferrer = async (downlineUserId,amountToCredit,referralPercent) => {
    return new Promise(async (resolve, reject) => {

        const details = await this.getReferralDetails(downlineUserId);
        
        //Check If Downline Has An Upline ANd Has Been Credited
        if (!details /* || details.r_status === 1 */) {
            return resolve()
        }
        
        //Credit Referrer
        const amount = calculatePercentage(referralPercent, amountToCredit);

        //GET REFERRER USER OBJECT
        const referrerUser = await getUserById(details.r1_id);

        await editUserById(details.r1_id, {
            referral_total_count: referrerUser.referral_total_count + 1,
            referral_balance: referrerUser.referral_balance + amount
        });

        //Turn Referral History To Approved
        await this.editReferralDetails(details.r_id, {
            r_amount: amount,
            r_status: 1
        });

        return resolve()
    })
}
