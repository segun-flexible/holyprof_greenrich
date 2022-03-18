const { updateAdminById } = require("../../../helpers/admin")
const asyncHandler = require("../../../helpers/asyncHandler")
const { getAdminBankById, getAllBank, verifyBankDetails, adminCreateNewBank, adminEditBank } = require("../../../helpers/bank")
const { openToken } = require("../../../helpers/jwt")
const { hashPassword } = require("../../../helpers/password")

//PROFILE & PASSWORD SETTINGS
exports.adminProfileSettingsGet = asyncHandler(async (req, res, next) => {
    const { id } = await openToken(req.signedCookies[process.env.TOKEN_NAME])

    const bank = await getAdminBankById(id);
    
    //Get Bank
    const bankList = await getAllBank();

    res.render("admin/pages/settings/profileSettings", {
        title: "Admin Profile Settings",
        bank,
        bankList
    })
})


//SAVE UPDATE
exports.adminProfileSettingsPost = asyncHandler(async (req, res, next) => {
    const { id } = await openToken(req.signedCookies[process.env.TOKEN_NAME])
    
    if (req.imageName) {

        await updateAdminById(id, { avatar: req.imageName });
        
    } else if (req.body && req.body.password) {

        req.body.password = await hashPassword(req.body.password);
        await updateAdminById(id, req.body);

    } else {
        
        await updateAdminById(id, req.body);

    }

    

    return res.json({ status: true, message: "Changes Saved" })
});


exports.adminWalletSettingsPost = asyncHandler(async (req, res, next) => {
    const { id } = await openToken(req.signedCookies[process.env.TOKEN_NAME])
    
    const verifyDetails = await verifyBankDetails(req.body.number, req.body.bank);

    if (!verifyDetails.status) {
        return res.json({status:false, message:"You've Done Something Went Wrong",text:verifyDetails.message})
    };

    //Get The BAnk Name
    const banks = await getAllBank();

    const bankName = await banks.find(bk => bk.id === verifyDetails.data.bank_id)

    if (!bankName) {
        return res.json({status:false, message:"Something Went Wrong",text:"The system is unable to verify these details, kindly try a new bank details"})
    };


    if (req.body.type === "new") {
        //Create New Bank
        await adminCreateNewBank({
            bank_user_id: id,
            bank_account_type: bankName.name,
            bank_account_name: verifyDetails.data.account_name,
            bank_account_number: verifyDetails.data.account_number
        });
    } else {
        await adminEditBank(id, {
            bank_account_type: bankName.name,
            bank_account_name: verifyDetails.data.account_name,
            bank_account_number: verifyDetails.data.account_number
        })
    }
    

    //Response To Client
    return res.json({status:true, message:"Success",text:`Your wallet has been ${req.body.type === "new" ? 'created' : 'edited'} successfully`})

});