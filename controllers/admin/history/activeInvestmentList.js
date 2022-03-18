const asyncHandler = require("../../../helpers/asyncHandler");
const { adminActiveInvestmentFunc } = require("../../../helpers/history");
const { getNextOffset, paginateData } = require("../../../helpers/pagination");


//USERS LIST
exports.adminActiveInvestmentHistory = asyncHandler(async (req, res, next) => {
    const limit = req.query.limit || parseInt(process.env.LIMIT),currentPage = parseInt(req.query.page)|| 1;
    
    //Pagination VAR
    let link, prevBtn = null, nextBtn = null;
    


    let history = await adminActiveInvestmentFunc(limit, getNextOffset(currentPage, limit));


    let pageList = await adminActiveInvestmentFunc(999999999, 0);
    

    //PAGINATION
    const pageData = paginateData(limit, pageList.length);

    //Prev
    if (currentPage > 1) {
        prevBtn = currentPage - 1;
    }

    //Next
    if (currentPage !== "" && pageData[pageData.length - 1] > currentPage) {
        nextBtn = currentPage + 1
    };

    link = `/admin/history/active-investment?`
    
    res.render("admin/pages/history/activeInvestmentList", {
        title: "Active Investment List ",
        history,
        prevBtn,
        nextBtn,
        link
    })
})