const asyncHandler = require("../../helpers/asyncHandler");
const { getDataFromObject } = require("../../helpers/dataManipulator");
const { openToken } = require("../../helpers/jwt");
const { hashPassword, comparePassword } = require("../../helpers/password");
const { editUserById, getUserById } = require("../../helpers/user");

//PROFILE
exports.userProfileGet = asyncHandler(async (req, res, next) => {
    
    return res.render("user/pages/settings/profile", {
        title: "Edit Profile",
    });

});

//SECURITY
exports.userSecurityGet = asyncHandler(async (req, res, next) => {
    
    return res.render("user/pages/settings/security", {
        title: "Security",
    });

});


exports.userSettingsPost = asyncHandler(async (req, res, next) => {
    const { id } = await openToken(req.signedCookies[process.env.TOKEN_NAME])

    
    const obj = getDataFromObject(req.body, ["fullname", "email", "phone_number", "address", "state", "city", "password", "avatar","oldPassword"]);

    //Check If Its Password
    if (obj.password) {

        const { password } = await getUserById(id);

        const isSame = await comparePassword(obj.oldPassword, password);
        if (!isSame) {
            return res.json({status:false,message:"Old Password Is Incorrect"})
        };

        //Delete Old Password
        delete obj.oldPassword;

        obj.password = await hashPassword(obj.password);
        
    }

    //If Avatar
    if (req.imageName) {
        obj.avatar = req.imageName
    };


    await editUserById(id,obj);

    return res.json({status:true,message:"Changes Saved"})

});



