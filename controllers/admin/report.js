const asyncHandler = require("../../helpers/asyncHandler");
const { getDateFormatForPost } = require("../../helpers/dateTime");

const { getNextOffset, paginateData } = require("../../helpers/pagination");
const { adminGetUserReportList, adminDeleteReportById } = require("../../helpers/report");

exports.adminReportListGet = asyncHandler(async (req, res, next) => {
    const limit = req.query.limit || parseInt(process.env.LIMIT),currentPage = parseInt(req.query.page)|| 1, status = req.query.status;
    
    //Pagination VAR
    let link, prevBtn = null, nextBtn = null;
    


    let reports = await adminGetUserReportList(status, limit, getNextOffset(currentPage, limit));
    
    await reports.map(p => {
        p.rp_created_at = getDateFormatForPost(p.rp_created_at)
    })
    

    let pageList = await adminGetUserReportList(status, 999999999, 0);
    
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

    
    //Pagination Link
    if (status) {
        link = `/admin/report/history?status=${status}&`
    } else {
        link = `/admin/report/history?`
    }

    
    res.render("admin/pages/report/reportList", {
        title: "Pages ",
        reports,
        prevBtn,
        nextBtn,
        link
    })

})


//DELETE REPORT
exports.adminReportListDelete = asyncHandler(async (req, res, next) => {

    if (req.body.type === "mark_all") {
        await req.body.data.forEach(async d => {
            await adminDeleteReportById(d.reportId)
        });
        return res.json({ status: true, message: `${req.body.data.length} Report(s) Deleted`})
    } else {
        
        await adminDeleteReportById(req.body.reportId)
        return res.json({ status: true, message: "Report Deleted"})
    }
    
})