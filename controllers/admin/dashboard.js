const { activationList } = require("../../helpers/activation");
const { getAdminById } = require("../../helpers/admin");
const asyncHandler = require("../../helpers/asyncHandler");
const { getDateFormatForPost } = require("../../helpers/dateTime");
const formatNumber = require("../../helpers/formatNumber");
const { getAdminInvestmentHistory } = require("../../helpers/history");
const { getAllInvestmentRecordsCount, getTopInvestors, getAllInvestmentAmount, getAdminInvestmentAmount } = require("../../helpers/investment");
const { openToken } = require("../../helpers/jwt");
const { adminGetActivePlans } = require("../../helpers/plans");
const { adminGetUserReportListCount } = require("../../helpers/report");
const { adminGetAllMember, getTopReferral } = require("../../helpers/user");
const { getAllWithdrawalAmount, getAdminWithdrawalAmount } = require("../../helpers/withdrawal");


exports.adminDashboardGet = asyncHandler(async (req, res, next) => {
    const { id } = await openToken(req.signedCookies[process.env.TOKEN_NAME])
    
    //CHeck If User Is A Marketer
    const admin = await getAdminById(id);
    if (admin.role === 3) return res.redirect(301,"/admin/activation/")
    
    //BASIC STATS
    const members = formatNumber(await adminGetAllMember());
    const activeInvestment = formatNumber(await getAllInvestmentRecordsCount());
    const totalInvestmentAmount = await getAllInvestmentAmount();
    const totalWithdrawalAmount = await getAllWithdrawalAmount()

    //Get The Total Money That Comes Into My Accout
    const personalInvestment = await getAdminInvestmentAmount(id);
   
    //Get The Total Money That Goes Out Of My Accout
    const personalWithdrawal = await getAdminWithdrawalAmount(id);
  
    const packages = formatNumber(await adminGetActivePlans());
    const reports = formatNumber(await adminGetUserReportListCount());

    //PENDING FEEE
    let pendingActivation = await activationList('0', undefined, 10, 0);
    await pendingActivation.map(h => {
        h.h_created = getDateFormatForPost(h.h_created)
    })

    //PENDING INVESTMENT MERGE
    let pendingInvestment = await getAdminInvestmentHistory(undefined, "0", 10, 0);
    
    await pendingInvestment.map(h => {
        h.h_created_at = getDateFormatForPost(h.h_created_at)
    })
    

    //TOP REFERRAL
    const referral = await getTopReferral();
    
    //TOP INVESTORS
    const topInvestors = await getTopInvestors(10);
    
    return res.render("admin/pages/dashboard", {
        title: "Admin Dashboard",
        members,
        activeInvestment,
        packages,
        reports,
        pendingActivation,
        pendingInvestment,
        referral,
        topInvestors,
        totalInvestmentAmount,
        totalWithdrawalAmount,
        personalInvestment,
        personalWithdrawal
       
    })
})