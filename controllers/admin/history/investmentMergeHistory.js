const { notifyMergeSenderMailer } = require("../../../email/mails/notifyMergeReciever");
const { getAdminById } = require("../../../helpers/admin");
const asyncHandler = require("../../../helpers/asyncHandler");
const { getDateFormatForPost } = require("../../../helpers/dateTime");
const { getInvestmentHistoryById, getAdminInvestmentHistory, deleteInvestmentHistoryById, getUserInvestmentHistoryByUserid } = require("../../../helpers/history");
const { setupInvestment } = require("../../../helpers/investment");
const { paginateData, getNextOffset } = require("../../../helpers/pagination");
const { userGetPlanById } = require("../../../helpers/plans");
const { getUserById, editUserById } = require("../../../helpers/user");
const { editWithdrawalByInvId, getWithdrawalByInvId, setWithdrawalByInvIdToNull } = require("../../../helpers/withdrawal");

//MERGE INVESTMENT HISTORY
exports.adminInvestmentMergeHistoryGet = asyncHandler(async (req, res, next) => {
    
    const transID = req.query.trans, limit = req.query.limit || parseInt(process.env.LIMIT), currentPage = parseInt(req.query.page) || 1;
    
    //Pagination VAR
    let link, prevBtn = null, nextBtn = null;
    

    let type = {};

    if (req.params.type.toLocaleLowerCase() === "pending") {
        type = {
            status: 0,
            text: "Pending"
        }
    } else if (req.params.type.toLocaleLowerCase() === "approved") {
        
        type = {
            status: 1,
            text: "Approved"
        }

    } else if (req.params.type.toLocaleLowerCase() === "completed") {
        
        type = {
            status: 2,
            text: "Completed"
        }

    }
   
    let history = await getAdminInvestmentHistory(transID, type.status, limit, getNextOffset(currentPage, limit));
    
    await history.map(h => {
        h.h_created_at = getDateFormatForPost(h.h_created_at)
    })

    
    let pageList = await getAdminInvestmentHistory(transID, type.status, 999999999, 0);
    

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
    
    if (transID) {
        link = `/admin/history/merge/${req.params.type.toLocaleLowerCase()}?trans=${transID}&`
    } else {
        link = `/admin/history/merge/${req.params.type.toLocaleLowerCase()}?`
    }
    
    
    res.render("admin/pages/history/investmentMergeHistory", {
        title: `${type.text} Investment Merge`,
        history,
        prevBtn,
        nextBtn,
        link,
        status: type.status
    })


});


//MERGE INVESTMENT (POST)
exports.admingPostMerge = asyncHandler(async (req, res, next) => {
    //If === 1 (ADMIN)
  
    const investment = await getInvestmentHistoryById(req.body.investmentId);

    //FIrst Check If There Is A Data From DB
    if (!investment) {
        return res.json({status:false,message:"Investment Not Found",text:"Other Admin Might Have Process It"})
    }

    //Then Check If The Investment Has Been Already Process
    if (investment.h_status !== 0) {
        return res.json({status:false,message:"Investment Have Already Been Process",text:"You Can't Process It Twice"})
    }
    //Then Check If Its Reciever Is Admin Or User
    if (investment.h_user_type == 1) {

        await setupInvestment(investment);
        
       
    }

    //IF RECEIEVER IS A MEMBER
    else {
        await setupInvestment(investment);

        //HERE, i change the reciever status to true
        //That shows that his withdrawal has been paid
        await editWithdrawalByInvId(investment.h_id, {
            h_status: 1
        });

        //After Turn The Status To DOne
        //Deduct The AMount The Reciever Request For
        const withdrawal = await getWithdrawalByInvId(investment.h_id)
        if (withdrawal) {
            
            await editUserById(withdrawal.h_receiver_id, {
                referral_balance: 0,
                roi_balance: 0
            });

        }
        
    }
    //Get Sender (NEW INVESTOR)
    const user = await getUserById(investment.h_sender_id);

    //CHeck If Sender (New Investor) Has Investment before
    //Then that means he wanna pay for recommitment, 
    //Else That means he is a new investor, so dont allow him to withdraw
    const hasInvestBefore = await getUserInvestmentHistoryByUserid(user.uid, "", 1, 0);
    if (hasInvestBefore.length) await editUserById(user.uid, {
        can_withdraw: 1
    });
            
    

    //Send MAil TO THe Payment Sender (New Investor WHo Wanna Invest)
    
    const plan = await userGetPlanById(investment.h_plan_id);

    user.year = new Date().getFullYear()
    
    notifyMergeSenderMailer(user,plan)

    return res.json({status:true,message:"Investment Successfully Setup"})
})

//DELETE INVESTMENT HISTORY
exports.adminDeleteInvestmentHistory = asyncHandler(async (req, res, next) => {
    
    await setWithdrawalByInvIdToNull(req.body.id);

    await deleteInvestmentHistoryById(req.body.id);
    return res.json({status:true,message:"Investment Deleted"})
    
})


//GET MERGE SENDER
exports.admingGetSenderMerge = asyncHandler(async (req, res, next) => {
    
    if (parseInt(req.body.type) === 1) {
        const user = await getAdminById(req.body.userId || 0);
        user && (user.type = "Sender");
        return res.json(user)
    }
    //IF ===2 (USER)
    else {
        const user = await getUserById(req.body.userId || 0);
        user && (user.type = "Sender");
        return res.json(user)
    }
    
})

//GET MERGE RECIEVER
exports.admingGetReceiverMerge = asyncHandler(async (req, res, next) => {
    //If === 1 (ADMIN)

    if (parseInt(req.body.type) === 1) {
        const user = await getAdminById(req.body.userId || 0);
        user && (user.type = "Reciever");
        return res.json(user)
    }
    //IF ===2 (USER)
    else {
        const user = await getUserById(req.body.userId || 0);
        user && (user.type = "Reciever");
        return res.json(user)
    }
})