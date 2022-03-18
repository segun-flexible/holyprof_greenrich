const db = require("../models/db");

//USER GET PLANS
exports.userGetPlans = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM f_plans WHERE plan_visibility = 1", (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
};

//USER GET PLANS COUNT
exports.userGetPlansCount = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT COUNT(*) AS total FROM f_plans WHERE plan_visibility = 1", (err, data) => {
            if (err) reject(err)
            else resolve(data[0].total || 0)
        })
    })
};

//ADMIN GET ACTIVE PLANS
exports.adminGetActivePlans = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT COUNT(*) AS total FROM f_plans WHERE plan_visibility = 1", (err, data) => {
            if (err) reject(err)
            else resolve(data[0].total || 0)
        })
    })
};

//USER GET PLAN BY ID
exports.userGetPlanById = (planId) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM f_plans WHERE plan_id = ? AND plan_visibility = 1", parseInt(planId), (err, data) => {
            if (err) reject(err)
            else resolve(data[0])
        })
    })
};


//ADMIN GET PLANS
exports.adminGetPlans = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM f_plans", (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
};

//INSERT NEW PLAN TO DB
exports.createNewPlan = (obj) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO f_plans SET ?", obj, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
};

//EDIT PLAN BY ID
exports.editPlanById = (planId,obj) => {
    return new Promise((resolve, reject) => {
        db.query("UPDATE f_plans SET ? WHERE plan_id = ?", [obj, parseInt(planId)], (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
};

//DELETE PLAN BY ID
exports.deletePlanById = (planId) => {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM f_plans WHERE plan_id = ?", parseInt(planId), (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
};