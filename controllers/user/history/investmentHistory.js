const asyncHandler = require("../../../helpers/asyncHandler");
const { getDateFormatForPost, extractTime } = require("../../../helpers/dateTime");
const { getUserInvestmentHistoryByUserid } = require("../../../helpers/history");
const { openToken } = require("../../../helpers/jwt");
const { getNextOffset, paginateData } = require("../../../helpers/pagination");

exports.userInvestmentHistoryGet = asyncHandler(async (req, res, next) => {
    const { id } = await openToken(req.signedCookies[process.env.TOKEN_NAME]);
    const limit = req.query.limit || parseInt(process.env.LIMIT),currentPage = parseInt(req.query.page)|| 1, status = req.query.status;
    
    //Pagination VAR
    let paginationArr,link,prevBtn = null, nextBtn = null;

    const history = await getUserInvestmentHistoryByUserid(id, status, limit, getNextOffset(currentPage, limit));
    
    await history.map(h => {
        h.h_created_at = getDateFormatForPost(h.h_created_at)
    });

    //Pagination
    const pageData = await getUserInvestmentHistoryByUserid(id, status, 9999999999, 0);
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
    if (status) {
        link = `/user/history/investment?status=${status}&`
    } else {
        link = `/user/history/investment?`
    }

    res.render("user/pages/history/investment", {
        title: "Investment History",
        history,
        paginationArr,
        link,
        currentPage,
        prevBtn,
        nextBtn
    })


})