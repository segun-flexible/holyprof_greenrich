const db = require("../models/db");

exports.createNewReport = (obj) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO f_reports SET ?", obj,(err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}

exports.deleteReportById = (reportId, userId) => {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM f_reports WHERE rp_id = ? AND rp_user = ?", [parseInt(reportId),parseInt(userId)],(err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}

exports.adminDeleteReportById = (reportId) => {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM f_reports WHERE rp_id = ?",parseInt(reportId),(err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}



//GET USER REPORT LIST BY ID
exports.getUserReportList = (userId,status,limit,offset) => {
    return new Promise((resolve, reject) => {
        let query;
        
        if (status) {
            query = `SELECT * FROM f_reports WHERE rp_user = ${parseInt(userId)} AND rp_status = ${parseInt(status)} LIMIT ${limit} OFFSET ${offset}`
        } else {
            query = `SELECT * FROM f_reports WHERE rp_user = ${parseInt(userId)} LIMIT ${limit} OFFSET ${offset}`
        }
        db.query(query, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}

//ADMIN REPORT LIST HISTORY
exports.adminGetUserReportList = (status,limit,offset) => {
    return new Promise((resolve, reject) => {
        let query;
        
        if (status) {
            query = `SELECT * FROM f_reports A JOIN f_users B ON A.rp_user = B.uid WHERE rp_status = ${parseInt(status)} LIMIT ${limit} OFFSET ${offset}`
        } else {
            query = `SELECT * FROM f_reports A JOIN f_users B ON A.rp_user = B.uid LIMIT ${limit} OFFSET ${offset}`
        }
        db.query(query, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}

//ADMIN REPORT LIST HISTORY COUNT
exports.adminGetUserReportListCount = () => {
    return new Promise((resolve, reject) => {
        db.query( `SELECT COUNT(*) AS total FROM f_reports WHERE rp_status = 0`, (err, data) => {
            if (err) reject(err)
            else resolve(data[0].total || 0)
        })
    })
}