const { alertUserPaymentSent } = require("../../email/mails/payment");
const asyncHandler = require("../../helpers/asyncHandler");
const { getDateFormatForPost } = require("../../helpers/dateTime");
const { editDepositById, deleteDepositById } = require("../../helpers/deposit");
const { getDepositHistory, getUserInvestmentHistoryByUserid } = require("../../helpers/history");
const { openToken } = require("../../helpers/jwt");
const { getNextOffset, paginateData } = require("../../helpers/pagination");
const { editUserById, updateUserDepositedBalanceById, updateUserTotalBalanceById, getUserById, deductUserBalance } = require("../../helpers/user");
const { getWithdrawaltHistory, editWithdrawalById, deleteWithdrawalById, getWithdrawalById } = require("../../helpers/withdrawal");

//Withdrawal LIST
exports.adminWithdrawaltListGet = asyncHandler(async (req, res, next) => {
    const status = req.query.status, type = req.params.type, transID = req.query.trans, limit = req.query.limit || parseInt(process.env.LIMIT),currentPage = parseInt(req.query.page)|| 1;
    
    //Pagination VAR
    let link, prevBtn = null, nextBtn = null, pageList;
    
    let history;

    if (type === "pending") {
        
        history = await getWithdrawaltHistory(transID, '0', limit, getNextOffset(currentPage, limit));

        await history.map(h => {
            h.h_created = getDateFormatForPost(h.h_created)
        })

        pageList = await getWithdrawaltHistory(transID, '0', 999999999, 0);


    } else if (type === "processing") {
        
        history = await getWithdrawaltHistory(transID, '2', limit, getNextOffset(currentPage, limit));

        await history.map(h => {
            h.h_created = getDateFormatForPost(h.h_created)
        })

        pageList = await getWithdrawaltHistory(transID, '2', 999999999, 0);

        
    } else if (type === "completed") {
        
        history = await getWithdrawaltHistory(transID, '1', limit, getNextOffset(currentPage, limit));

        await history.map(h => {
            h.h_created = getDateFormatForPost(h.h_created)
        })

        pageList = await getWithdrawaltHistory(transID, '1', 999999999, 0);


    } else {
        console.log("Not FOund")
    }

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
        link = `/admin/withdrawal/${type}?trans=${transID}&vc`;
    } else {
        link = `/admin/withdrawal/${type}?`;
    }
    
    
    res.render("admin/pages/withdrawal/withdrawalList", {
        title: "Withdrawal History",
        history,
        prevBtn,
        nextBtn,
        link,
        type
    })
})

//DEPOSIT APPROVED
exports.adminWithdrawalApprovedPut = asyncHandler(async (req, res, next) => {
    const { id } = await openToken(req.signedCookies[process.env.TOKEN_NAME]);

    //Multiple Approved
    if (req.body.type === "mark_all") {
        
        await req.body.data.map(async d => {
           
            
        //Get Withdrawal Data
        const withdrawal = await getWithdrawalById(d.withdrawalId);

        if (!withdrawal) {
            return res.json({ status: false, message: `We Can't Complete This Request`,text:"This Withdrawal Might Have Been Deleted" })
        }
        
        //Change Status To Done
        await editWithdrawalById(d.withdrawalId, { h_status: 1,h_user_type:1,h_sender_id:id});
        
        //Update User Balance
        await deductUserBalance(withdrawal.h_receiver_id,withdrawal.h_amount_requested, withdrawal.h_withdrawal_type)

        //Here The Admin Approve, So nothing for the admin
        //we only Set SENDER Can Withdraw to 0
        await editUserById(withdrawal.h_sender_id, {
            can_withdraw: 0
        });
            
        //SEND HIM MAIL
        try {
            const user = await getUserById(withdrawal.h_receiver_id);
            user.amount = withdrawal.h_amount_requested;
            user.year = new Date().getFullYear();
            alertUserPaymentSent(user)
        } catch (error) {
            
        }
            
            
        });

        //Response To User
        return res.json({status:true,message:`Good Job, You Completed ${req.body.data.length} Withdrawal`})
    }
    //One By One Approved
    else {
        //Get Withdrawal Data
        const withdrawal = await getWithdrawalById(req.body.withdrawalId);

        if (!withdrawal) {
            return res.json({ status: false, message: `We Can't Complete This Request`,text:"This Withdrawal Might Have Been Deleted" })
        }
        
        //Change Status To Done
        await editWithdrawalById(req.body.withdrawalId, { h_status: 1, h_user_type: 1, h_sender_id: id });
        
        //Update User Balance
        await deductUserBalance(withdrawal.h_receiver_id, withdrawal.h_amount_requested, withdrawal.h_withdrawal_type)
        
        //Here The Admin Approve, So nothing for the admin
        //we only Set SENDER Can Withdraw to 0
        await editUserById(withdrawal.h_sender_id, {
            can_withdraw: 0
        });

        //Response To User
        res.json({ status: true, message: `Good Job, You Completed This Withdrawal` });

        //SEND HIM MAIL
        try {
            const user = await getUserById(withdrawal.h_receiver_id);
            user.amount = withdrawal.h_amount_requested;
            user.year = new Date().getFullYear();
            alertUserPaymentSent(user)
        } catch (error) {
            
        }
        
    }
    
})


//DEPOSIT DELETE
exports.adminWithdrawalDeletedDelete = asyncHandler(async (req, res, next) => {
    //Multiple Withdrawal
    if (req.body.type === "mark_all") {
        
        await req.body.data.map(async d => {
            
            //Delete Deposit By Id
            await deleteWithdrawalById(d.id);
        });

        //Response To User
        res.json({ status: true, message: `Good Job, You Delete ${req.body.data.length} Withdrawals` });

        //SEND HIM MAIL
    }
    //One By One Withdrawal
    else {
        
         //Delete Deposit By Id
        await deleteWithdrawalById(req.body.id);

        //Response To User
        res.json({ status: true, message: `Good Job, You Delete This Withdrawal` });

        //SEND HIM MAIL
        
    }
    
})