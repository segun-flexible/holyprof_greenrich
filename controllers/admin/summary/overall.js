const { getAllAdmins } = require("../../../helpers/admin");
const asyncHandler = require("../../../helpers/asyncHandler");
const { getAdminInvestmentAmount } = require("../../../helpers/investment");
const { getAdminWithdrawalAmount } = require("../../../helpers/withdrawal");


//<!--------------OVERALL-------->

exports.overallListGet = asyncHandler(async (req, res, next) => {
    
    //Get Admins
    const admins = await getAllAdmins();
    for (i = 0; i < admins.length; i++){
        admins[i].totalInvestment = await getAdminInvestmentAmount(admins[i].uid)
        admins[i].totalWithdrawal = await getAdminWithdrawalAmount(admins[i].uid)
    }

    res.render("admin/pages/summary/overall", {
        title: "Overall Summary",
        admins
    })
})