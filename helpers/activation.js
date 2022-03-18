const db = require("../models/db")

//INSERT ACTIVATON FEE
exports.insertActivationFee = (obj) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO f_activation_fees_history SET ?",obj,(err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}

//EDIT ACTIVATON FEE BY ID
exports.editActivationFeeById = (activationID, obj) => {
    return new Promise((resolve, reject) => {
        db.query("UPDATE f_activation_fees_history SET ? WHERE h_id = ?",[obj,parseInt(activationID)],(err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}

//DELETE ACTIVATON FEE BY ID
exports.deleteActivationFeeById = (activationID) => {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM f_activation_fees_history WHERE h_id = ?",parseInt(activationID),(err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}

//INCREMENT USER ACTIVATON FEE BY ID
exports.incrementUserActivationFeeById = (userId, amount) => {
    return new Promise((resolve, reject) => {
        db.query(`UPDATE f_users SET current_activation_fee = current_activation_fee + ${parseInt(amount)} WHERE uid = ${parseInt(userId)}`,(err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}

//GET ACTIVATION FEE BY USER ID
exports.getActivationFeeByUserId = (userId) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM f_activation_fees_history WHERE h_user_id = ? AND h_status = 0",parseInt(userId),(err, data) => {
            if (err) reject(err)
            else resolve(data[0])
        })
    })
}


//<!---------------FOR ADMIN -------------->

//ACTIVATION LIST
exports.activationList = (status,transId,limit,offset) => {
    return new Promise((resolve, reject) => {
        let query;
        if (status) {
            query = `SELECT * FROM f_activation_fees_history A JOIN f_users B ON B.uid = A.h_user_id WHERE h_status = ${parseInt(status)} LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`
        }
        else if (transId) {
            query = `SELECT * FROM f_activation_fees_history A JOIN f_users B ON B.uid = A.h_user_id WHERE h_trans = '${transId}' LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`
        }
        else {
            query = `SELECT * FROM f_activation_fees_history A JOIN f_users B ON B.uid = A.h_user_id LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`
        }
        db.query(query, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}


