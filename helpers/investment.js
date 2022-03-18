const db = require("../models/db");
const { editInvestmentHistoryById } = require("./history");
const { userGetPlanById } = require("./plans");
const { creditReferrer } = require("./referral");
const { editUserById, getUserById } = require("./user");


//CREATE NEW INVESTMENT RECORDS
exports.createInvestmentRecords = (obj) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO f_investment_records SET ?",obj, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
};

//SETUP INVESTMENT
exports.setupInvestment = async(investment) => {
    return new Promise(async (resolve, reject) => {
        
         //Set Investment Datas
        const plan = await userGetPlanById(investment.h_plan_id);

        //Check If There Is Plan
        if (!plan) {
            return res.json({status:false,message:"Plan Not Found",text:"The Plan This User Invest On, Might Have Been Deleted Or Moved"})
        };

        await this.createInvestmentRecords({
            r_user_id: investment.h_sender_id,
            r_history_id: investment.h_id,
            r_plan_name: plan.plan_name,
            r_plan_price: plan.plan_price,
            r_roi: plan.plan_roi,
            r_duration: plan.plan_duration,
            r_total_duration: plan.plan_duration
        });

        //Turn Investment Status To Approved ;
        await editInvestmentHistoryById(investment.h_id, {
            h_status: 1
        });

        //Deduct His Activation Fee
        const user = await getUserById(investment.h_sender_id);

        await editUserById(investment.h_sender_id, {
            /* current_activation_fee: user.current_activation_fee - plan.plan_activation_fee, */
            return_cycle: user.return_cycle + 1,
            previous_plan: plan.plan_price
        });

        //Credit Referral
        await creditReferrer(investment.h_sender_id,plan.plan_price,plan.plan_referral)

        //SEND NOTICE MAILER

        //Respond 
        return resolve()

    })
};



//GET USER NEW INVESTMENT RECORDS
exports.getUserInvestmentRecords = (userId) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM f_investment_records WHERE r_user_id = ?",parseInt(userId), (err, data) => {
            if (err) reject(err)
            else resolve(data[0])
        })
    })
};

//GET ALL INVESTMENT RECORDS
exports.getAllInvestmentRecords = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM f_investment_records",(err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
};

//GET ALL INVESTMENT RECORDS COUNT
exports.getAllInvestmentRecordsCount = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT COUNT(*) AS total FROM f_investment_records",(err, data) => {
            if (err) reject(err)
            else resolve(data[0].total || 0)
        })
    })
};

//GET ALL INVESTMENT RECORDS AMOUNT
exports.getAllInvestmentAmount = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT SUM(h_amount) AS total FROM f_investment_history WHERE NOT h_status = 0",(err, data) => {
            if (err) reject(err)
            else resolve(data[0].total || 0)
        })
    })
};

//GET ADMIN INVESTMENT RECORDS AMOUNT
//MONEY THAT COMES INTO HIS BANK
exports.getAdminInvestmentAmount = (adminId) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT SUM(h_amount) AS total FROM f_investment_history WHERE NOT h_status = 0 AND h_receiver_id = ? AND h_user_type = 1", parseInt(adminId), (err, data) => {
            if (err) reject(err)
            else resolve(data[0].total || 0)
        })
    })
};


//GET ALL INVESTMENT RECORDS
exports.editInvestmentRecordsById = (record_id,obj) => {
    return new Promise((resolve, reject) => {
        db.query("UPDATE f_investment_records SET ? WHERE r_id = ?",[obj,parseInt(record_id)],(err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
};

//DELETE INVESTMENT RECORDS BY ID
exports.deleteInvestmentRecordsById = (record_id) => {console.log(record_id)
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM f_investment_records WHERE r_id = ?",parseInt(record_id),(err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
};


//FOR REPORTING

//GET INVESTMENT BY ID (TRANS ID)
exports.getInvestmentForReport = (transID) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM f_investment_history WHERE h_trans = '${transID}' AND h_status = 0 LIMIT 1`,(err, data) => {
            if (err) reject(err)
            else resolve(data[0])
        })
    })
}

//GET TOP INVESTORS
exports.getTopInvestors = (limit) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM f_investment_records A JOIN f_users B ON A.r_user_id = B.uid ORDER BY A.r_plan_price DESC LIMIT ?",parseInt(limit),(err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
};