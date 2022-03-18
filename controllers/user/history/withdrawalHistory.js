const { notifyMergeSenderMailer } = require("../../../email/mails/notifyMergeReciever");
const { alertUserPaymentSent } = require("../../../email/mails/payment");
const asyncHandler = require("../../../helpers/asyncHandler");
const { getDateFormatForPost } = require("../../../helpers/dateTime");
const { getUserWithdrawalHistory, getInvestmentHistoryById, getUserInvestmentHistoryByUserid } = require("../../../helpers/history");
const { setupInvestment } = require("../../../helpers/investment");
const { openToken } = require("../../../helpers/jwt");
const { getNextOffset, paginateData } = require("../../../helpers/pagination");
const { userGetPlanById } = require("../../../helpers/plans");
const { getUserById, editUserById, deductUserBalance } = require("../../../helpers/user");
const { getWithdrawalByIdForApprove, editWithdrawalById } = require("../../../helpers/withdrawal");

exports.userWithdrawalHistory = asyncHandler(async (req, res, next) => {
    const { id } = await openToken(req.signedCookies[process.env.TOKEN_NAME]);

    const limit = req.query.limit || parseInt(process.env.LIMIT),currentPage = parseInt(req.query.page)|| 1, status = req.query.status;
    
    //Pagination VAR
    let paginationArr,link,prevBtn = null, nextBtn = null;

    const history = await getUserWithdrawalHistory(id, status, limit, getNextOffset(currentPage, limit));
    
    await history.map(h => {
        h.h_created = getDateFormatForPost(h.h_created)
    });

    //Pagination
    const pageData = await getUserWithdrawalHistory(id, status, 9999999999, 0);
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
        link = `/user/history/withdrawal?status=${status}&`
    } else {
        link = `/user/history/withdrawal?`
    }

    res.render("user/pages/history/withdrawalHistory", {
        title: "Withdrawal History",
        history,
        paginationArr,
        link,
        currentPage,
        prevBtn,
        nextBtn
    })


})


//USER APPROVE THE WITHDRAWAL

exports.userApproveTheWithdrawal = asyncHandler(async (req, res, next) => {
    const { id } = await openToken(req.signedCookies[process.env.TOKEN_NAME]);

    const withdrawal = await getWithdrawalByIdForApprove(req.body.withdrawalId,id);
    
    if (!withdrawal) {
        return res.json({status:false,message:"Not Authorized",text:"You are not authorized to confirm this withdrawal request"})
    };

    const investment = await getInvestmentHistoryById(withdrawal.h_inv_id);

    //SetUp The Investment For The Sender
    await setupInvestment(investment);

    //Turn Withdrawl Status To Done (1)
    await editWithdrawalById(withdrawal.h_id, {
        h_status: 1
    });

    //Deduct Balance
    await deductUserBalance(withdrawal.h_receiver_id,withdrawal.h_amount_requested,withdrawal.h_withdrawal_type)

    //Send MAil TO THe Payment Sender (New Investor WHo Wanna Invest)
    const user = await getUserById(investment.h_sender_id);
    const plan = await userGetPlanById(investment.h_plan_id);

    user.year = new Date().getFullYear()
    notifyMergeSenderMailer(user, plan)
    

    //CHeck If Sender (New Investor) Has Investment before
    //Then that means he wanna pay for recommitment, 
    //Else That means he is a new investor, so dont allow him to withdraw
    const hasInvestBefore = await getUserInvestmentHistoryByUserid(id, "", 1, 0);
    if (hasInvestBefore.length) await editUserById(user.uid, {
        can_withdraw: 1
    });

    //Set Receiver Can Withdraw to 0
    await editUserById(withdrawal.h_receiver_id, {
        can_withdraw: 0
    });
    
    //Send Mail To The Withdrawee Also
    //SEND HIM MAIL
        try {
            const withdrawee = await getUserById(withdrawal.h_receiver_id);
            withdrawee.amount = withdrawal.h_amount_requested;
            withdrawee.year = new Date().getFullYear();
            alertUserPaymentSent(withdrawee)
        } catch (error) {
            
    }
    

    return res.json({status:true,message:"Volla, You Have Confirmed The Request",text:"You successfully confirmed and approved the request"})
    

});