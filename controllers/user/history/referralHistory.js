const asyncHandler = require("../../../helpers/asyncHandler");
const { getUserReferralHistory } = require("../../../helpers/history");
const { openToken } = require("../../../helpers/jwt");
const { getNextOffset, paginateData } = require("../../../helpers/pagination");

exports.userReferralHistory = asyncHandler(async (req, res, next) => {
    const { id } = await openToken(req.signedCookies[process.env.TOKEN_NAME]);

    const limit = req.query.limit || parseInt(process.env.LIMIT),currentPage = parseInt(req.query.page)|| 1;
    
    //Pagination VAR
    let paginationArr,link,prevBtn = null, nextBtn = null;

    const history = await getUserReferralHistory(id, limit, getNextOffset(currentPage, limit));
   

    //Pagination
    const pageData = await getUserReferralHistory(id, 9999999999, 0);
    paginationArr = paginateData(limit, pageData.length);
  
    //Prev
    if (currentPage > 1) {
        prevBtn = currentPage - 1;
    }

    //Next
    if (currentPage !== "" && paginationArr[paginationArr.length - 1] > currentPage) {
        nextBtn = currentPage + 1
    };

    //Pagination Link
    link = `/user/history/referral?`

    res.render("user/pages/history/referral", {
        title: "Referrals History",
        history,
        paginationArr,
        link,
        currentPage,
        prevBtn,
        nextBtn
    })


})