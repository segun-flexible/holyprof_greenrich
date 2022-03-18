const { getUserInvestmentRecords } = require("../helpers/investment");
const { openToken } = require("../helpers/jwt");
const manipulateDate = require("../helpers/manipulateDate");
const { checkIfHasProcessWithdrawal } = require("../helpers/withdrawal");
const db = require("../models/db")


exports.userDetails = async (req, res, next) => {
        if (req.signedCookies[process.env.TOKEN_NAME]) {
        const token = await openToken(req.signedCookies[process.env.TOKEN_NAME]);
        
            if (token.role && token.role === "admin") {
            
            db.query("SELECT * FROM f_admins WHERE uid = ? LIMIT 1", parseInt(token.id), async (err, user) => {
            if (err) {
                return next(err)
            } else {
                let u = user[0];
                
                
                
                if (!u) {
                    res.clearCookie(process.env.TOKEN_NAME);
                return res.redirect("/admin/login")
                }


                if (u.role === 1) u.role = "Admin"
                else if (u.role === 2) u.role = "Moderator"
                else if (u.role === 3) u.role = "Marketer"

                res.locals.user = u
                next()
            }
        })
        } else {
            
           db.query("SELECT * FROM f_users WHERE uid = ? LIMIT 1", parseInt(token.id), async (err, user) => {
            if (err) {
                return next(err)
            } else {
                let u = user[0];
                
                if (!u) {
                    res.clearCookie(process.env.TOKEN_NAME);
                return res.redirect("/login")
                }

                u.role = "User"
                //Get Investment Records
                const investment = await getUserInvestmentRecords(token.id);

                u.created_at = manipulateDate(u.created_at)
                

                res.locals.user = u
                res.locals.investment = investment || {}
                next()
            }
        }) 
        }
        
        } else {
            res.locals.user = null
            next()
        }
        
        
    }

exports.moreInfo = (app) => {
  
    return async (req, res, next) => {
        if (req.signedCookies[process.env.TOKEN_NAME]) {
        const {id} = await openToken(req.signedCookies[process.env.TOKEN_NAME]);
        
        
        const processWithdrawal = await checkIfHasProcessWithdrawal(id);
        
        app.locals.processWithdrawal = processWithdrawal
        app.locals.timeUp = {}
        next()
        
        } else {
            next()
        }
        
        
    }
}

