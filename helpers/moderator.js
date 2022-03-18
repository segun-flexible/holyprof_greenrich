const db = require("../models/db");

//CREATE USER
exports.createNewModerator = (obj) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO f_admins SET ?", obj, (err, user) => {
            if (err) reject(err)
            else resolve(user)
        })
    })
};


exports.getModeratorById = (userId) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM f_admins WHERE uid = ? AND NOT role = 1 LIMIT 1", parseInt(userId), (err, user) => {
            if (err) reject(err)
            else resolve(user[0])
        })
    })
};

//GET USER BY USERNAME
exports.getModeratorByUsername = (username) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM f_admins WHERE username = ? AND NOT role = 1 LIMIT 1",username, (err, user) => {
            if (err) reject(err)
            else resolve(user[0])
        })
    })
}


//EDIT USER BY ID
exports.editModeratorById = (userId,obj) => {
    return new Promise((resolve, reject) => {
        db.query("UPDATE f_admins SET ? WHERE uid = ? AND NOT role = 1", [obj, parseInt(userId)], (err, user) => {
            if (err) reject(err)
            else resolve(user)
        })
    })
};

//DELETE USER BY ID
exports.deleteModeratorById = (userId) => {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM f_admins WHERE uid = ? AND NOT role = 1", parseInt(userId), (err, user) => {
            if (err) reject(err)
            else resolve(user)
        })
    })
};




//GET USER LIST
exports.getModeratorsList = (search,limit,offset) => {
    return new Promise((resolve, reject) => {
        let query;
        if (search) {
            query = `SELECT * FROM f_admins A WHERE (A.fullname LIKE '%${search}%' OR username LIKE '%${search}%') AND NOT A.role = 1 LIMIT ${limit} OFFSET ${offset}`
        } else {
            query = `SELECT * FROM f_admins A WHERE NOT A.role = 1 LIMIT ${limit} OFFSET ${offset}`
        }
        db.query(query, (err, user) => {
            if (err) reject(err)
            else resolve(user)
        })
    })
}