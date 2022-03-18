const db = require("../models/db")

//GET DEPOSIT METHODS
exports.getAllDepositMethods = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM f_deposit_methods A JOIN f_coins B ON A.d_used_coin = B.coin_id",(err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}

//GET DEPOSIT METHODS
exports.getDepositCount = (type) => {
    return new Promise((resolve, reject) => {
        let query;
        if (type === "pending") {
            query = `SELECT COUNT(h_amount_recieved) as total FROM f_deposit_history WHERE h_status = 0`
        } else {
            query = `SELECT COUNT(h_amount_recieved) as total FROM f_deposit_history WHERE h_status = 1`
        }
        db.query(query, (err, data) => {
            if (err) reject(err)
            else resolve(data[0].total ? data[0].total : 0)
        })
    })
}


//CREATE NEW DEPOSIT METHOD
exports.createNewDepositMethod = (obj) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO f_deposit_methods SET ?",obj,(err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}

//GET DEPOSIT METHOD BY ID
exports.getDepositMethodById = (depositId) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM f_deposit_methods A JOIN f_coins B ON A.d_used_coin = B.coin_id AND d_id = ?",parseInt(depositId),(err, data) => {
            if (err) reject(err)
            else resolve(data[0])
        })
    })
}

//EDIT DEPOSIT METHOD BY ID
exports.editDepositMethodById = (depositId, obj) => {
    return new Promise((resolve, reject) => {
        db.query("UPDATE f_deposit_methods SET ? WHERE d_id = ?",[obj, parseInt(depositId)],(err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}

//DELETE DEPOSIT METHOD BY ID
exports.deleteDepositMethodById = (depositId) => {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM f_deposit_methods WHERE d_id = ?", parseInt(depositId),(err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}

//CREATE NEW DEPOSIT
exports.createNewDeposit = (obj) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO f_deposit_history SET ?",obj,(err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}

//EDIT DEPOSIT BY ID
exports.editDepositById = (depositId, obj) => {
    return new Promise((resolve, reject) => {
        db.query("UPDATE f_deposit_history SET ? WHERE h_id = ?",[obj, parseInt(depositId)],(err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}


//DELETE DEPOSIT BY ID
exports.deleteDepositById = (depositId) => {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM f_deposit_history WHERE h_id = ?", parseInt(depositId),(err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}


//<!------------FOR HOMEPAGE----------->
exports.getDepositHistoryForHome = (limit) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM f_deposit_history A JOIN f_users B ON A.h_user_id = B.uid ORDER BY A.h_id DESC LIMIT ? OFFSET 0", limit,(err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}