const db = require("../models/db");


exports.editInvestmentHistoryById = (investmentId,obj) => {
    return new Promise((resolve, reject) => {
        db.query("UPDATE f_investment_history SET ? WHERE h_id = ?",[obj,parseInt(investmentId)], (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
};

exports.deleteInvestmentHistoryById = (investmentId) => {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM f_investment_history WHERE h_id = ?",parseInt(investmentId), (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
};

exports.completeAllUserInvestmentHistory = (historyId) => {
    return new Promise((resolve, reject) => {
        db.query("UPDATE f_investment_history SET h_status = 2 WHERE h_id = ?",parseInt(historyId), (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
};

exports.getInvestmentHistoryById = (investmentId) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM f_investment_history WHERE h_id = ?",parseInt(investmentId), (err, data) => {
            if (err) reject(err)
            else resolve(data[0])
        })
    })
};

exports.insertIntoInvestmentHistory = (obj) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO f_investment_history SET ?",obj, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
};


//GET USER INVESTMENT HISTORY BY ID
exports.getUserInvestmentHistoryByUserid = (userId,status,limit,offset) => {
    return new Promise((resolve, reject) => {
        let query;
        
        if (status) {
            query = `SELECT * FROM f_investment_history WHERE h_sender_id = ${parseInt(userId)} AND h_status = ${parseInt(status)} ORDER BY h_id DESC LIMIT ${limit} OFFSET ${offset}`
        } else {
            query = `SELECT * FROM f_investment_history WHERE h_sender_id = ${parseInt(userId)} ORDER BY h_id DESC LIMIT ${limit} OFFSET ${offset}`
        }
        db.query(query, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}

//GET INVESTMENT HISTORY
exports.getAdminInvestmentHistory = (transId, status, limit, offset) => {
    return new Promise((resolve, reject) => {
        let query;
        
        if(transId) {
            query = `SELECT * FROM f_investment_history WHERE h_trans = '${transId}' AND h_status = ${parseInt(status)} LIMIT ${limit} OFFSET ${offset}`
        } else {
            query = `SELECT * FROM f_investment_history WHERE h_status = ${parseInt(status)} LIMIT ${limit} OFFSET ${offset}`
        }
        db.query(query, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}


//GET USER WITHDRAWAL HISTORY BY ID
exports.getUserWithdrawalHistory = (userId,status,limit,offset) => {
    return new Promise((resolve, reject) => {
        let query;

        if (status) {
            query = `SELECT * FROM f_withdrawal_history WHERE h_receiver_id = ${parseInt(userId)} AND h_status = ${parseInt(status)} ORDER BY h_id DESC LIMIT ${limit} OFFSET ${offset}`
        } else {
            query = `SELECT * FROM f_withdrawal_history WHERE h_receiver_id = ${parseInt(userId)} ORDER BY h_id DESC LIMIT ${limit} OFFSET ${offset}`
        }
        db.query(query, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}


//GET USER REFERRAL HISTORY
exports.getUserReferralHistory = (userId,limit,offset) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM f_referrals A JOIN f_users B ON A.r2_id = B.uid WHERE A.r1_id = ${parseInt(userId)}`, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
};



//GET USER REFERRAL HISTORY
exports.adminActiveInvestmentFunc = (limit,offset) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM f_investment_records A JOIN f_users B ON A.r_user_id = B.uid LIMIT ${limit} OFFSET ${offset}`, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
};


/* SELECT * FROM f_admins WHERE uid = A.h_receiver_id


JOIN  OR SELECT * FROM f_investment_history A JOIN f_users B ON A.h_receiver_id = B.uid WHERE A.h_user_type = 2  */







/*

const db = require("../models/db");

//TOP INVESTORS
exports.editInvestmentHistoryById = (investmentId,obj) => {
    return new Promise((resolve, reject) => {
        db.query("UPDATE f_investment_history SET ? WHERE h_id = ?",[obj,parseInt(investmentId)], (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
};

exports.insertIntoInvestmentHistory = (obj) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO f_investment_history SET ?",obj, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
};


//GET USER INVESTMENT HISTORY BY ID
exports.getUserInvestmentHistoryByUserid = (userId,status,limit,offset) => {
    return new Promise((resolve, reject) => {
        let query;
        
        if (status) {
            query = `SELECT * FROM f_investment_history WHERE h_sender_id = ${parseInt(userId)} AND h_status = ${parseInt(status)} ORDER BY h_id DESC LIMIT ${limit} OFFSET ${offset}`
        } else {
            query = `SELECT * FROM f_investment_history WHERE h_sender_id = ${parseInt(userId)} ORDER BY h_id DESC LIMIT ${limit} OFFSET ${offset}`
        }
        db.query(query, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}


//GET ALL DEPOSIT HISTORY
exports.getDepositHistory = (trxId,status,limit,offset) => {
    return new Promise((resolve, reject) => {
        let query;

        if (trxId) {
            query = `SELECT * FROM f_deposit_history A JOIN f_users B ON A.h_user_id = B.uid AND h_trans = '${trxId}' ORDER BY h_id DESC LIMIT ${limit} OFFSET ${offset}`

        }
        else if (status) {
            
            query = `SELECT * FROM f_deposit_history A JOIN f_users B ON A.h_user_id = B.uid AND h_status = ${parseInt(status)} ORDER BY h_id DESC LIMIT ${limit} OFFSET ${offset}`
        }
        else {
            query = `SELECT * FROM f_deposit_history A JOIN f_users B ON A.h_user_id = B.uid ORDER BY h_id DESC LIMIT ${limit} OFFSET ${offset}`
        }
        db.query(query, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}


//INSERT INTO PURCHASE HISTORY
exports.insertIntoPurchaseHistory = (obj) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO f_purchase_history SET ?", obj, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
};

//GET USER PURCHASE HISTORY BY ID
exports.getUserPurchaseHistoryById = (userId, limit, offset) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM f_purchase_history WHERE p_user_id = ${parseInt(userId)} ORDER BY p_id DESC LIMIT ${limit} OFFSET ${offset}`, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
};


//INSERT INTO EARNING HISTORY
exports.insertIntoEarningHistory = (obj) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO f_earning_history SET ?", obj, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
};

//GET USER EARNING HISTORY BY ID
exports.getUserEarningHistoryById = (userId, limit, offset) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM f_earning_history WHERE h_user_id = ${parseInt(userId)} ORDER BY h_id DESC LIMIT ${limit} OFFSET ${offset}`, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
};






//<!------------------------ADMIN HISTORY------------------->
//GET USER EARNING HISTORY BY ID
exports.getAdminEarningHistory = (search, limit, offset) => {
    return new Promise((resolve, reject) => {
        let query;
        if (search) {
            query = `SELECT * FROM f_earning_history A LEFT JOIN f_users B ON A.h_user_id = B.uid WHERE B.username = '${search}' ORDER BY h_id DESC LIMIT ${limit} OFFSET ${offset}`
        } else {
            query = `SELECT * FROM f_earning_history A LEFT JOIN f_users B ON A.h_user_id = B.uid ORDER BY h_id DESC LIMIT ${limit} OFFSET ${offset}`
        }
        db.query(query, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
};

//GET USER PURCHASE HISTORY BY ID
exports.getAdminPurchaseHistory = (trxId, limit, offset) => {
    return new Promise((resolve, reject) => {
        let query;
        if (trxId) {
            query = `SELECT * FROM f_purchase_history A JOIN f_users B ON A.p_user_id = B.uid WHERE A.p_trans = '${trxId}' ORDER BY p_id DESC LIMIT ${limit} OFFSET ${offset}`
        } else {
            query = `SELECT * FROM f_purchase_history A JOIN f_users B ON A.p_user_id = B.uid ORDER BY p_id DESC LIMIT ${limit} OFFSET ${offset}`
        }
        db.query(query, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
};



//<!----------------FOR HOMEPAGE --------------->
//TOP INVESTORS
exports.getTopInvestorsForHome = (limit) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT p_user_id,username,avatar,p_amount FROM f_purchase_history A JOIN f_users B ON A.p_user_id = B.uid ORDER BY A.p_amount DESC LIMIT ? OFFSET 0", limit, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
};

*/