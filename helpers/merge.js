const db = require("../models/db");

//GET MERGES BY AMOUNT
exports.getMergesByAmount = (amount,requestedUserId) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM f_withdrawal_history A JOIN f_users B ON A.h_receiver_id = B.uid JOIN f_bank C ON C.bank_user_id = B.uid WHERE (h_amount_requested = ? AND h_status = 0) AND NOT A.h_receiver_id = ?", [parseInt(amount),parseInt(requestedUserId)], (err, user) => {
            if (err) reject(err)
            else resolve(user[0])
        })
    })
};

//GET MERGES BY AMOUNT
exports.getMergesAfterNull = (amount,receieverUserId,myOwnId) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM f_withdrawal_history A JOIN f_users B ON A.h_receiver_id = B.uid JOIN f_bank C ON C.bank_user_id = B.uid WHERE (h_amount_requested = ? AND h_status = 0) AND NOT A.h_receiver_id = ? AND NOT A.h_receiver_id = ?", [parseInt(amount),parseInt(receieverUserId),parseInt(myOwnId)], (err, user) => {
            if (err) reject(err)
            else resolve(user[0])
        })
    })
};

//GET MERGE TRACK BY RECIEVER ID
exports.getMergeTrackByRecieverId = (recieverId) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM f_merge_track WHERE mt_reciever_id = ?", parseInt(recieverId), (err, user) => {
            if (err) reject(err)
            else resolve(user[0])
        })
    })
};

//GET MERGE TRACK BY RECIEVER ID
exports.hasBeenMerged = (recieverId) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM f_merge_track WHERE mt_reciever_id = ? AND mt_user_type = 2", parseInt(recieverId), (err, user) => {
            if (err) reject(err)
            else resolve(user[0])
        })
    })
};

//GET MERGE TRACK BY SENDER ID
exports.getMergeTrackBySenderId = (senderId) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM f_merge_track WHERE mt_sender_id = ?", parseInt(senderId), (err, user) => {
            if (err) reject(err)
            else resolve(user[0])
        })
    })
};

//GET MERGE TRACK BY RECIEVER ID OR SENDER ID
exports.getMergeTrackByBothId = (theId) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM f_merge_track WHERE mt_reciever_id = ${parseInt(theId)} OR mt_sender_id = ${parseInt(theId)}`, (err, user) => {
            if (err) reject(err)
            else resolve(user[0])
        })
    })
};

//DELETE MERGE TRACK BY RECIEVER ID AND SENDER
exports.deleteMergeTrackByBothId = (recieverId,senderId) => {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM f_merge_track WHERE mt_reciever_id = ? AND mt_sender_id = ?", [parseInt(recieverId),parseInt(senderId)], (err, user) => {
            if (err) reject(err)
            else resolve(user)
        })
    })
};

//CREATE NEW MERGE TRACK
exports.createMergeTrack = (obj) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO f_merge_track SET ?", obj, (err, user) => {
            if (err) reject(err)
            else resolve(user)
        })
    })
};


//GET PENDING MERGE
exports.getPendingMerge = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM f_merge_track WHERE mt_status = 0", (err, user) => {
            if (err) reject(err)
            else resolve(user)
        })
    })
};

//GET PENDING MERGE
exports.updateMergeById = (mergeId,obj) => {
    return new Promise((resolve, reject) => {
        db.query("UPDATE f_merge_track SET ? WHERE mt_id = ?", [obj, parseInt(mergeId)], (err, user) => {
            if (err) reject(err)
            else resolve(user)
        })
    })
};