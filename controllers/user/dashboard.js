const asyncHandler = require("../../helpers/asyncHandler");
const { getDateFormatForPost } = require("../../helpers/dateTime");
const { getUserReferralHistory, getUserInvestmentHistoryByUserid } = require("../../helpers/history");
const { openToken } = require("../../helpers/jwt");
const { getNotice } = require("../../helpers/notice");


exports.userDashboardGet = asyncHandler(async (req, res, next) => {
    const { id } = await openToken(req.signedCookies[process.env.TOKEN_NAME]);
    
    
    //Referral History
    const referralHistory = await getUserReferralHistory(id, 10, 0);

    //Investment History
    const investmentHistory = await getUserInvestmentHistoryByUserid(id, undefined, 10, 0);

    await investmentHistory.map(h => {
        h.h_created_at = getDateFormatForPost(h.h_created_at)
    });
    

    //Notice
    const notice = await getNotice();
    notice && (notice.updated_at ? (notice.updated_at = getDateFormatForPost(notice.updated_at)) : (notice.created_at = getDateFormatForPost(notice.created_at)));

    //Get URL

    
    res.render("user/pages/dashboard/dashboard", {
        title: "My Dashboard",
        referralHistory,
        investmentHistory,
        notice
    })
})