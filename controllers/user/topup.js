const { sendPaymentRequest } = require("../../email/mails/payment");
const asyncHandler = require("../../helpers/asyncHandler");
const { getAllDepositMethods, getDepositMethodById, createNewDeposit, editDepositById } = require("../../helpers/deposit");
const { openToken } = require("../../helpers/jwt");
const { getUniqueID } = require("../../helpers/uniqueID");
const { getUserById } = require("../../helpers/user");

exports.userTopupGet = asyncHandler(async (req, res, next) => {
   
    
    res.render("user/pages/topup/topup", {
        title: "Topup Activation",
    });

});

