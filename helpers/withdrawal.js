const db = require("../models/db");

//EDIT USER BY ID
exports.insertIntoWithdrawalHistory = (obj) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO f_withdrawal_history SET ?", obj, (err, user) => {
            if (err) reject(err)
            else resolve(user)
        })
    })
};

//CHECK IF HAS PENDING WITHDRAWAL
exports.checkIfHasPendingWithdrawal = (userId) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM f_withdrawal_history WHERE h_receiver_id = ? AND h_status = 0", parseInt(userId), (err, data) => {
            if (err) reject(err)
            else {
                if (data.length) {
                    return resolve(true)
                } else {
                    return resolve(false)
                }
            }
        })
    })
};

//CHECK IF HAS PROCESS WITHDRAWAL (WHEN SOMONE SENT HIM MONEY AND HE HAVE NOT PROCESS IT (2 In DB))
exports.checkIfHasProcessWithdrawal = (userId) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM f_withdrawal_history WHERE h_receiver_id = ? AND h_status = 2", parseInt(userId), (err, data) => {
            if (err) reject(err)
            else {
                if (data.length) {
                    return resolve(true)
                } else {
                    return resolve(false)
                }
            }
        })
    })
};


//CHECK IF HAS PENDING WITHDRAWAL PAYMENT HE SENT TO SOMEONE
exports.hasPendingWithdrawalSentOut = (userId) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM f_withdrawal_history WHERE h_sender_id = ? AND h_status = 0", parseInt(userId), (err, data) => {
            if (err) reject(err)
            else {
                resolve(data)
            }
        })
    })
};


//EDIT WITHDRAWAL BY ID
exports.editWithdrawalById = (withdrawalId, obj) => {
    return new Promise((resolve, reject) => {
        db.query("UPDATE f_withdrawal_history SET ? WHERE h_id = ?",[obj, parseInt(withdrawalId)],(err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}

//GET WITHDRAWAL BY ID
exports.getWithdrawalById = (withdrawalId) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM f_withdrawal_history WHERE h_id = ?",parseInt(withdrawalId),(err, data) => {
            if (err) reject(err)
            else resolve(data[0])
        })
    })
}

//EDIT WITHDRAWAL BY INVESTMENT ID (INV_ID)
exports.editWithdrawalByInvId = (invID, obj) => {
    return new Promise((resolve, reject) => {
        db.query("UPDATE f_withdrawal_history SET ? WHERE h_inv_id = ?",[obj, parseInt(invID)],(err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}

//SET WITHDRAWAL BY INVESTMENT ID (INV_ID) TO NULL
exports.setWithdrawalByInvIdToNull = (invID) => {
    return new Promise((resolve, reject) => {
        db.query("UPDATE f_withdrawal_history SET h_user_type = NULL, h_sender_id = NULL, h_status = 0 WHERE h_inv_id = ?",parseInt(invID),(err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}

//GET WITHDRAWAL BY ID (INV_ID)
exports.getWithdrawalByInvId = (invID) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM f_withdrawal_history WHERE h_inv_id = ${parseInt(invID)} `,(err, data) => {
            if (err) reject(err)
            else resolve(data[0])
        })
    })
}

//GET WITHDRAWAL BY ID 
exports.getWithdrawalByIdForApprove = (withdrawalId,userId) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM f_withdrawal_history WHERE h_id = ${parseInt(withdrawalId)} AND h_status = 2 AND h_receiver_id = ${parseInt(userId)}`,(err, data) => {
            if (err) reject(err)
            else resolve(data[0])
        })
    })
}


//GET ALL WITHDRAWAL AMOUNT
exports.getAllWithdrawalAmount = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT SUM(h_amount_requested) AS total FROM  f_withdrawal_history WHERE NOT h_status = 0",(err, data) => {
            if (err) reject(err)
            else resolve(data[0].total || 0)
        })
    })
};

//GET ALL WITHDRAWAL AMOUNT
//TOTAL MONEY THAT HE PAYS OUT
exports.getAdminWithdrawalAmount = (adminId) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT SUM(h_amount_requested) AS total FROM  f_withdrawal_history WHERE NOT h_status = 0 AND h_sender_id = ? AND h_user_type = 1", parseInt(adminId),(err, data) => {
            if (err) reject(err)
            else resolve(data[0].total || 0)
        })
    })
};


//FOR REPORTING

//GET WITHDRAWAL BY ID (TRANS ID)
exports.getWithdrawalForReport = (transID) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM f_withdrawal_history WHERE h_trans = '${transID}' AND h_status = 2 LIMIT 1`,(err, data) => {
            if (err) reject(err)
            else resolve(data[0])
        })
    })
}







//END HERE

//GET ALL DEPOSIT HISTORY
exports.getWithdrawaltHistory = (trxId,status,limit,offset) => {
    return new Promise((resolve, reject) => {
        let query;

        if (trxId) {
            query = `SELECT * FROM f_withdrawal_history A JOIN f_users B ON A.h_receiver_id = B.uid LEFT JOIN f_bank C ON C.bank_user_id = B.uid WHERE A.h_trans = '${trxId}' AND A.h_status = ${parseInt(status)} LIMIT ${limit} OFFSET ${offset}`

        }
        else {
            query = `SELECT * FROM f_withdrawal_history A JOIN f_users B ON A.h_receiver_id = B.uid LEFT JOIN f_bank C ON C.bank_user_id = B.uid WHERE A.h_status = ${parseInt(status)}  LIMIT ${limit} OFFSET ${offset}`
        }
        db.query(query, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}



//DELETE WITHDRAWAL BY ID
exports.deleteWithdrawalById = (withdrawalId) => {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM f_withdrawal_history WHERE h_id = ?", parseInt(withdrawalId),(err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}

//GET WITHDRAWAL FOR HOMEPAGE
exports.getWithdrawalForHome = (limit) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM f_withdrawal_history A JOIN f_users B ON A.h_user_id = B.uid ORDER BY A.h_id DESC LIMIT ${limit} OFFSET 0`,(err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}

//GET ALL WITHDRAWAL
exports.getWithdrawCount = (type) => {
    return new Promise((resolve, reject) => {
        let query;
        if (type === "pending") {
            query = `SELECT SUM(h_amount_recieved) as total FROM f_withdrawal_history WHERE h_status = 0`
        } else {
            query = `SELECT SUM(h_amount_recieved) as total FROM f_withdrawal_history WHERE h_status = 1`
        }
        db.query(query, (err, data) => {
            if (err) reject(err)
            else resolve(data[0].total ? data[0].total : 0)
        })
    })
}


