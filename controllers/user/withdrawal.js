const asyncHandler = require("../../helpers/asyncHandler");
const { getUserBank } = require("../../helpers/bank");
const { getUserInvestmentRecords } = require("../../helpers/investment");
const { openToken } = require("../../helpers/jwt");
const { getWebSettings } = require("../../helpers/settings");
const { getUniqueID } = require("../../helpers/uniqueID");
const { getUserById } = require("../../helpers/user");
const { insertIntoWithdrawalHistory, checkIfHasPendingWithdrawal } = require("../../helpers/withdrawal");

exports.userMakeWithdrawalGet = asyncHandler(async (req, res, next) => {
    res.render("user/pages/withdrawal/makeWithdrawal", {
        title: "Withdrawal"
    })
})

//WITHDRAWAL POST
exports.userMakeWithdrawalPost = asyncHandler(async (req, res, next) => {
    const { id } = await openToken(req.signedCookies[process.env.TOKEN_NAME])

    const { roi_balance, referral_balance, referral_total_count } = await getUserById(id);


    const amountRequested = parseInt(req.body.amount)

    //Check If Has A Wallet
    const bank = await getUserBank(id);
    if (!bank) {
        return res.json({status:false, message:"Wallet Not Found",text:"You need to setup your wallet before you can make withdrawal"})
    }
    

    
    //Check If Has Pending Withdrawal
    const hasPendingWithdrawal = await checkIfHasPendingWithdrawal(id);
    
    if (hasPendingWithdrawal) {
        return res.json({status:false, message:"Unable To Make Withdrawal",text:"You already have a pending withdrawal on the system, kindly wait while the system paid you before you can make another withdrawal"})
    }

    /* //Check If Requested For ROI ANd He Has A Pending Plan
    if (req.body.type === "all" || req.body.type === "roi") {
        
        //CHeck If Has Active Plan
        const investment = await getUserInvestmentRecords(id);
        if (investment) {
            return res.json({status:false, message:"Unable To Make Withdrawal",text:"You cannot withdraw your ROI and Referral balance while you have an active plan, you need to wait until your investment has completed."})
        }
    } */

    //Check If Amount Requested Is Greater Than The Type Of WIthdrawal
    if (amountRequested <= 0) {
        return res.json({status:false, message:`Withdrawal Amount Must Be Greater Than ${amountRequested}`})
    };

    
    //Web Settings
    const { website_min_roi_withdrawal, website_min_ref_withdrawal, website_withdrawal_status, website_currency, website_min_ref, website_recommitment_status } = await getWebSettings();

    //Check If Withdrawal Status Is Open
    if(!website_withdrawal_status) return res.json({status:false, message:"Withdrawal Has Been Temporary Closed"})

    if (req.body.type === "roi") {
        
        if (roi_balance < amountRequested) {
            return res.json({status:false, message:"Insufficient R.O.I Balance"})
        }
        
        if (roi_balance < website_min_roi_withdrawal) {
            return res.json({status:false, message:`Minimum R.O.I Withdrawal Is ${website_currency + website_min_roi_withdrawal.toLocaleString()}`})
        }

        

    } else if (req.body.type === "ref") {
        //Checking Downline
        if (referral_total_count < website_min_ref) return res.json({ status: false, message: `Action Denied`, text: `You need minimum of ${website_min_ref} downlines before you can withdraw referral earnings and you already have ${referral_total_count} ${referral_total_count > 1 ? 'Downlines' : 'Downline'}` });

        //Checking Minimum Balance
        if(referral_balance < website_min_ref_withdrawal) return res.json({ status: false, message: `Action Denied`, text: `You can only withdraw the minimum referral bonus of ${website_currency + website_min_ref_withdrawal} and Above` });

        
        if (referral_balance < amountRequested) {
            return res.json({status:false, message:"Insufficient Referral Balance"})
        }

    } 

    //Check If Has Active Plan (RECOMMITMENT)
    //Check If Has Investment Records
    const hasActiveInvestment = await getUserInvestmentRecords(id);
    const user = await getUserById(id);
    
    if (website_recommitment_status && !hasActiveInvestment) {

        return res.json({
            status:false,
            message: "Recommitment is required",
            text: `Sorry ${user.username}, you cannot withdraw until you recommit back to the system, purchase a plan of N${user.previous_plan} Or higher, your account will be available for withdrawal after Recommitment!`
        })
    }

    //CHeck If Can Withdraw
    if (!user.can_withdraw) return res.json({
        status: false,
        message: "Action Failed",
        text: `You cannot withdraw at the moment, Either wait for your investment to matured or you just withdraw frequently!`
    })

    //Insert Into Withdrawal History
    await insertIntoWithdrawalHistory({
        h_trans: "TRX" + getUniqueID(),
        h_withdrawal_type: req.body.type,
        h_receiver_id: id,
        h_amount_requested: amountRequested
    });


    //Response To Client
    return res.json({status:true, message:"Withdrawal Successful",text:"You have successfully make a withdrawal, kindly wait while we merge you to an investor or the system pay you directly",goto:"/user/history/withdrawal"})
})