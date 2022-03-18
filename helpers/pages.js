const db = require("../models/db");

//GET PAGE
exports.adminGetPage = (limit,offset) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM f_pages LIMIT ${limit} OFFSET ${offset}`, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
};

//CREATE NEW PAGE
exports.createNewPage = (obj) => {
    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO f_pages SET ?`,obj, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
};

//EDIT PAGE BY ID
exports.editPageById = (pageId,obj) => {
    return new Promise((resolve, reject) => {
        db.query(`UPDATE f_pages SET ? WHERE page_id = ?`,[obj,parseInt(pageId)], (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
};

//DELETE PAGE BY ID
exports.deletePageById = (pageId) => {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM f_pages WHERE page_id = ?`,parseInt(pageId), (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
};


//GET PAGE BY ID
exports.getPageById = (pageId) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM f_pages WHERE page_id = ? AND page_status = 1`,parseInt(pageId), (err, data) => {
            if (err) reject(err)
            else resolve(data[0])
        })
    })
};

//ADMI GET PAGE BY ID
exports.admimGetPageById = (pageId) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM f_pages WHERE page_id = ?`,parseInt(pageId), (err, data) => {
            if (err) reject(err)
            else resolve(data[0])
        })
    })
};

//GET PAGE BY SLUG
exports.getPageBySlug = (pageSlug) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM f_pages A JOIN f_admins B ON A.page_author = B.uid WHERE page_slug = '${pageSlug}' AND page_status = 1`, (err, data) => {
            if (err) reject(err)
            else resolve(data[0])
        })
    })
};