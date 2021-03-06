const asyncHandler = require("../../helpers/asyncHandler");
const { getDataFromObject } = require("../../helpers/dataManipulator");
const { openToken } = require("../../helpers/jwt");
const { hashPassword, comparePassword } = require("../../helpers/password");
const { editUserById, getUserById } = require("../../helpers/user");
const fs = require("fs");

exports.userProfileGet = asyncHandler(async (req, res, next) => {
    
    res.render("user/pages/profile/profileSettings", {
        title: "Edit Profile"
    });
    
})

//
exports.userProfilePut = asyncHandler(async (req, res, next) => {
    const { id } = await openToken(req.signedCookies[process.env.TOKEN_NAME])


    
    
    try {
        if (!req.imageName) {
        const obj = getDataFromObject(req.body, ["fullname", "email", "phone_number", "state", "city", "zipcode", "address"]);
        await editUserById(id,obj)
    } else {
        //Delete The Current Image
        await editUserById(id,{avatar:""})
        
        //NEW IMAGE
        await editUserById(id,{avatar:req.imageName})
    }

    } catch (error) {
        let message;
        if (error.sqlMessage.includes("phone")) {
            message = "Phone Number Already Taken"
        } else if (error.sqlMessage.includes("email")) {
            message = "Email Already Taken"
        }else if (error.sqlMessage.includes("username")) {
            message = "Username Already Taken"
        };

        return res.json({status:false,message})
    }

    

    return res.json({status:true,message:"Changes Saved"})
})


exports.userPasswordGet = asyncHandler(async (req, res, next) => {
    
    res.render("user/pages/profile/password", {
        title: "Change Password"
    });
    
})

exports.userPasswordPost = asyncHandler(async (req, res, next) => {
    const { id } = await openToken(req.signedCookies[process.env.TOKEN_NAME])

    const { password } = await getUserById(id);

    //Compare Old Password
    const isSame = await comparePassword(req.body.oldPassword, password);
    if (!isSame) {
        return res.json({status:false,message:"Incorrect Current Password"})
    }

        req.body.password = await hashPassword(req.body.password);
        //Save Password
        await editUserById(id, { password: req.body.password });

        //Response To User
        return res.json({status:true,message:"Password Changed"})

    
})
