const { getAdminById } = require("../helpers/admin")
const { openToken } = require("../helpers/jwt")
const logger = require("../helpers/logger")
const { getUserById } = require("../helpers/user")
const db = require("../models/db")



exports.isAuthUser = async(req, res, next) => {
    if (req.signedCookies[process.env.TOKEN_NAME]) {
        const token = await openToken(req.signedCookies[process.env.TOKEN_NAME]);
        
        if (token.role && token.role === "admin") {
            return res.redirect("/admin/dashboard")
        } else {
            return res.redirect("/user/dashboard")
        }
        
    } else {
        next()
    }
    
}

exports.isUserLogin = async(req, res, next) => {
    if (req.signedCookies[process.env.TOKEN_NAME]) {
        next()
    } else {
        //Check If URL Contain The Word "ADMIN"
        if (req.originalUrl.includes("admin")) {
            return res.redirect("/admin/login")
        } else {
            return res.redirect("/login")
        }
        

    }
    
}


exports.isAdmin = async (req, res, next) => {

    const { id,role:theRole } = await openToken(req.signedCookies[process.env.TOKEN_NAME]);

    if (theRole !== "admin") {
        
        return res.render("error/error", {
            title: "Not Allowed",
            text: "You are not allow to enter this page",
            button: {
                link: "/",
                text: "Back To Homepage"
            }
        });

        
    }

    
    db.query("SELECT role FROM f_admins WHERE uid = ? LIMIT 1", id, (err, role) => {
        if (err) logger.debug(err)
        else {
            let data = role[0];
            
            if (!data) {
                res.render("error/error", {
        title: "Not Allowed",
        text: "You are not allow to enter this page",
        button: {
            link: "/",
            text:"Back To Homepage"
        }
        
    })
            } else {
                next()
            }
        }
    })
    
}



exports.isRoleAllow = (role) => async (req, res, next) => {
    const { id } = await openToken(req.signedCookies[process.env.TOKEN_NAME]);
    const user = await getAdminById(id);

    if (role instanceof Array) {
        const check = role.some(rl => rl === user.role);
        if (check) {
            next()
        } else {
            if (req.method.toLowerCase() === "get") {
                res.render("error/error", {
        title: "Not Allowed",
        text: "You are not allow to enter this page",
        button: {
            link: "/",
            text:"Back To Homepage"
        }
        
    })
            } else {
                res.json({status:false,message:"Not Allowed",text:"You are not allow to enter this page"})
            }
            
        }
    }else{
        if (user.role === role) {
       next() 
    } else {
        
        if (req.method.toLowerCase() === "get") {
                res.render("error/error", {
        title: "Not Allowed",
        text: "You are not allow to enter this page",
        button: {
            link: "/",
            text:"Back To Homepage"
        }
        
    })
            } else {
                res.json({status:false,message:"Not Allowed",text:"You are not allow to enter this page"})
            }
    }
    }
    
}


//CHeck User Is Already Verify
exports.isUserVerified = async (req, res, next) => {
    const { id } = await openToken(req.signedCookies[process.env.TOKEN_NAME]);

    //Get User Info
    const { is_verify, is_lock } = await getUserById(id);
    
    if (!is_verify) {
        return res.render("auth/verify/verify", {
            title: "Unverified Account"
        })
    }

    //Check If Lock
    if (is_lock) {
        return res.render("auth/locked/locked", {
            title: "Locked Account"
        })
    }


    //If Verified, Allow Him To His Destination
    next()
    
};

//DENY ADMIN FROM ENTERING USER
exports.denyAdmin = async (req, res, next) => {
    const token = await openToken(req.signedCookies[process.env.TOKEN_NAME]);
  
    
    
    if (token && token.role === "admin") {
        return res.render("error/error", {
            title: "You Are Not Allowed To Enter Member Area",
            text: `Sorry Sir, You Are Not Allowed Here, Kindly Navigate Back!`
        })
    }

    //If He IS A USer, Allow Him
    next()
    
};