const asyncHandler = require("../../helpers/asyncHandler");
const { days_between, getDateFormatForPost } = require("../../helpers/dateTime");
const { getInvestmentForReport } = require("../../helpers/investment");
const { openToken } = require("../../helpers/jwt");
const { getNextOffset, paginateData } = require("../../helpers/pagination");
const { createNewReport, getUserReportList, deleteReportById } = require("../../helpers/report");
const { getWithdrawalForReport } = require("../../helpers/withdrawal");



exports.userReportGet = asyncHandler(async (req, res, next) => {
    
    const trans = req.query.trans, type = parseInt(req.query.type);

    //Check If They Are Empty
    if (trans === "" || type === "") {
        
        return res.render("error/error", {
            title: "Something Went Wrong",
            text:"Some Parameter Cannot Be Empty"
        })

    }

    //Check If The History Is In DB
    let history;

    if (type === 1) {
        
        history = await getInvestmentForReport(trans);

    } else if (type === 2) {
        
        history = await getWithdrawalForReport(trans);
       

    } else {
        
        return res.render("error/error", {
            title: "Something Went Wrong",
            text:"Unknown Parameter In URL"
        })

    }

    //Check If History Is Found
    if (!history) {
        
        return res.render("error/error", {
            title: "Something Went Wrong",
            text:`We Cannot Process This ${type === 1 ? 'Investment':'Withdrawal'} Report At The Moment`
        })

    }
    

    //Check If Its Has Pass 24 hrs
    if (days_between(history.h_created || history.h_created_at) <= 0) {
        
        return res.render("error/error", {
            title: "Hi Chief, You Cannot Report This Merge At The Moment",
            text:`You are unavailable to report this merge until after 24hrs, till then you can call or email the other user, you might fix the issue PEER 2 PEER`
        })

    }
    
    return res.render("user/pages/report/report", {
        title: `Report ${type === 1 ? 'Investment' : 'Withdrawal'} Merge`,
        trans,
        type
    });

});

exports.userReportPost = asyncHandler(async (req, res, next) => {
    
    const trans = req.query.trans, type = parseInt(req.query.type);

    //Check If They Are Empty
    if (trans === "" || type === "") {
        
        return res.json({status:false,message:"Something Went Wrong",text:"Some Parameter Cannot Be Empty"})

    }
    
    //Check If The History Is In DB
    let history;

    if (type === 1) {
        
        history = await getInvestmentForReport(trans);

    } else if (type === 2) {
      
        history = await getWithdrawalForReport(trans);
       

    } else {
        return res.json({ status: false, message: "Something Went Wrong", text: "Unkndown Parameter In URL" })
        
    }

    //Check If History Is Not Found
    if (!history) {
        return res.json({ status: false, message: "Something Went Wrong", text: `We Cannot Process This ${type === 1 ? 'Investment':'Withdrawal'} Report At The Moment` })
    }
    
    //Check If Its Has Pass 24 hrs
    if (days_between(history.h_created || history.h_created_at) <= 0) {
        
        return res.json({ status: false, message: "Hi Investor, You Cannot Report This Payment At The Moment", text: `You cannot report this merge until after 24hrs, till then you can call or email the merged user, you might fix the issue PEER 2 PEER` })

    }

    const { id } = await openToken(req.signedCookies[process.env.TOKEN_NAME])
    
    
    //Insert Into Report History
    await createNewReport({
        rp_type: type,
        rp_trx_id: trans,
        rp_user: id,
        rp_message: req.body.message

    });

    
    return res.json({status:true,message:"Report Sent Successfully",text:"We have recieve your report, we might call you or email soon",goto:"/user/report/history"})
    

});



//REFERRAL LIST
exports.userReportListGet = asyncHandler(async (req, res, next) => {
    const { id } = await openToken(req.signedCookies[process.env.TOKEN_NAME]);

    const limit = req.query.limit || parseInt(process.env.LIMIT),currentPage = parseInt(req.query.page)|| 1, status = req.query.status;
    
    //Pagination VAR
    let paginationArr,link,prevBtn = null, nextBtn = null;

    const report = await getUserReportList(id, status, limit, getNextOffset(currentPage, limit));
    
    await report.map(h => {
        h.rp_created_at = getDateFormatForPost(h.rp_created_at)
    });

    //Pagination
    const pageData = await getUserReportList(id, status, 9999999999, 0);
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
        link = `/user/report/history?status=${status}&`
    } else {
        link = `/user/report/history?`
    }

    res.render("user/pages/report/reportList", {
        title: "Report History",
        report,
        paginationArr,
        link,
        currentPage,
        prevBtn,
        nextBtn
    })


})



//DELETE REPORT
exports.userDeleteReportDelete = asyncHandler(async (req, res, next) => {
 
    const { id } = await openToken(req.signedCookies[process.env.TOKEN_NAME]);

    await deleteReportById(req.body.reportId,id)
    return res.json({status:true,message:"Report Deleted Successfully"})
    
})

