const { getUserById } = require("../../helpers/user");
const asyncHandler = require("../../helpers/asyncHandler");
const { getUserBank, getAdminBank, getAdminBankById } = require("../../helpers/bank");
const { openToken, signObjToken } = require("../../helpers/jwt");
const { getMergesByAmount, getMergeTrackByRecieverId, createMergeTrack, getMergesAfterNull, deleteMergeTrackByBothId, getMergeTrackBySenderId } = require("../../helpers/merge");
const { userGetPlans, userGetPlanById } = require("../../helpers/plans");
const { chooseRandom } = require("../../helpers/randomizer");
const { getWebSettings } = require("../../helpers/settings");
const { getDateFormatForPost, extractTime } = require("../../helpers/dateTime");
const { editWithdrawalById, hasPendingWithdrawalSentOut } = require("../../helpers/withdrawal");
const { editInvestmentHistoryById, insertIntoInvestmentHistory, getUserInvestmentHistoryByUserid } = require("../../helpers/history");
const { getAdminById } = require("../../helpers/admin");
const { getUniqueID } = require("../../helpers/uniqueID");
const { getUserInvestmentRecords, deleteInvestmentRecordsById } = require("../../helpers/investment");
const { notifyMergeRecieverMailer, notifyAdminMergeRecieverMailer } = require("../../email/mails/notifyMergeReciever");

//PACKAGE LIST
exports.userPlansGet = asyncHandler(async (req, res, next) => {
    const { id } = await openToken(req.signedCookies[process.env.TOKEN_NAME])

    //Check If Already Merge
    const mergeTrack = await getMergeTrackBySenderId(id);
    
    if (mergeTrack && mergeTrack.mt_sender_id === id) {
        return res.redirect(`/user/plan/merge?id=${mergeTrack.mt_plan_id}`)
    };

    const plans = await userGetPlans();

    return res.render("user/pages/plans/plans", {
        title: "Packages",
        plans
    });

});

//PURCHASE PACKAGE AND MERGING (AUTO OR MANUAL)
exports.userPlanMergeGet = asyncHandler(async (req, res, next) => {
    const { id } = await openToken(req.signedCookies[process.env.TOKEN_NAME])

    //Check If Has A Wallet
    const bank = await getUserBank(id);
    if (!bank) {
        return res.render("error/walletError", {
            title: "Wallet Is Required",
            text: "You need to setup your wallet before you can Invest!"
        })
    }

    //First Get The Plan
    const plan = await userGetPlanById(req.query.id);

    //Check if Plan Selected Is Below Previous Plan
    const user = await getUserById(id);
    
    if (user.previous_plan > 0) {
        if(user.previous_plan > plan.plan_price) return res.render("error/error", {
            title: "Action Failed",
            text: "The package is below your previous plan, kindly subscribe to higher package!"
        })
        
    }

    //Check If Has Pending PAyment Receiver Need To Confirm
    let pendingMerge = await getUserInvestmentHistoryByUserid(id, "0", 1, 0);

    let pendingMerge2 = await hasPendingWithdrawalSentOut(id);

    if (pendingMerge.length || pendingMerge2.length) {
        return res.render("error/error", {
            title: "Action Not Available",
            text: "You have been merged with a user and you have made payment already, Kindly wait while the receiver approve the payment, until then you cannot perform this action!"
        })
    }
    
    
    if (!plan) {
        return res.render("error/error", {
            title: "Package Not Found",
            text: "The Package You Requested For Cannot Be Found!"
        })
    }

    //CHECK IF Activation fee is Activated
    //CHECK IF HE HAS SUFFICIENT FEE TO OPEN THE PACKAGE
    const { website_activation_fee } = await getWebSettings();
    const { current_activation_fee, username } = await getUserById(id);

    if (website_activation_fee) {
    if (current_activation_fee < plan.plan_activation_fee) {
        return res.render("error/error", {
            title: "Insufficient Activation Fee",
            text: `Sorry ${username}, You have insufficient activation fee to open this package, kindly top up your activation fee!`
        })
    }
        
    }

    
    //Check If Has Investment Records
    const hasActiveInvestment = await getUserInvestmentRecords(id);
    if (hasActiveInvestment) {
        return res.render("error/error", {
            title: "You Already Have An Active Investment Plan",
            text: `Sorry ${username}, Currently you have a running investment plan on the system, you need to wait till the current investment expired!`
        })
    }

    //Merge User
    let mergeUser,mergeAdmin,signObj = {};

    //Check The Merging State
    const { website_merging } = await getWebSettings();
    
    if (website_merging === "auto") {
        
        //Check If There Is A Pending Withdrawal Of The Same Amount
        //The ID in the params means, excluding this Person who wanna invest

        //This Function Check if there is withdrawal history, based on the plan price and excluding the sender id.
        //Checking Withdrawal For User
        mergeUser = await getMergesByAmount(plan.plan_price, id);

        if (!mergeUser) {
            //For Sending To Admin
            //Checking Withdrawal For Admin
            const hasMerged = await getMergeTrackBySenderId(id);

            if (hasMerged && hasMerged.mt_user_type === "admin") {

                //Get The Receieve Who is Admin details
                mergeAdmin = await getAdminBankById(hasMerged.mt_reciever_id)
                mergeAdmin.h_amount_requested = plan.plan_price;

            } else {

                //Get Admin Own
                mergeAdmin = chooseRandom(await getAdminBank());
                mergeAdmin.h_amount_requested = plan.plan_price;
                //Create Track
                await createMergeTrack({
                    mt_sender_id: id,
                    mt_plan_id: req.query.id,
                    mt_reciever_id: mergeAdmin.uid,
                    mt_user_type: "admin"
                });

            }

            
            
            

            //SIgn Obj
            signObj.receiverId = mergeAdmin.uid;
            signObj.userType = 1;
            signObj.amount = plan.plan_price;
            signObj.planId = req.query.id
            

        } else {

            //Check If The Person Is Not Temporary Merge
            //That is, if there is network issue and the sender have already pay, maybe just wating for alert or proof .
            //This function fetch a Merge track by the Receiever Id
            //its use to show if the person (MergeUser) has been merged
            const mergeTrack = await getMergeTrackByRecieverId(mergeUser.uid);

            //If There Is Not Merge Track, Then Create New One
            if (!mergeTrack) {
                await createMergeTrack({
                    mt_sender_id: id,
                    mt_plan_id: req.query.id,
                    mt_reciever_id: mergeUser.uid,
                    mt_user_type: "user"
                })
            } else {
                //FIrst Check If Its The Same Person Same Transaction
                if (mergeTrack.mt_sender_id !== id) {
                    
                    //Check If There Is A WIthdrawal Of Same Amount
                    //And Different User
                    const findNewMerge = await getMergesAfterNull(plan.plan_price, mergeUser.uid, id);

                    //If There Is No New One
                    if (!findNewMerge) {
                        
                        //Get Admin Own
                        mergeAdmin = chooseRandom(await getAdminBank());
                        mergeAdmin.h_amount_requested = plan.plan_price;
                        
                        //Create Track
                        await createMergeTrack({
                            mt_sender_id: id,
                            mt_plan_id: req.query.id,
                            mt_reciever_id: mergeAdmin.uid,
                            mt_user_type: "admin"
                        });
                        
                        //SIgn Obj
                        signObj.receiverId = mergeAdmin.uid;
                        signObj.userType = 1;
                        signObj.amount = plan.plan_price;
                        signObj.planId = req.query.id
            
                        mergeUser = undefined
                    }

                    //If There Is Another Withdrawal
                    //New Create Track
                    else {
                    
                        
                    mergeUser = {...mergeUser,...findNewMerge};
                    
                    await createMergeTrack({
                        mt_sender_id: id,
                        mt_plan_id: req.query.id,
                        mt_reciever_id: mergeUser.uid,
                        mt_user_type: "user"
                    })
                        
                    //Sign Obj FOr Merge User
                    signObj.receiverId = mergeUser.uid;
                    signObj.userType = 2;
                    signObj.amount = plan.plan_price;
                    signObj.planId = req.query.id;
                    signObj.withdrawalId = mergeUser.h_id
                    }
                    
                }
                //If Its The Same Transaction
                else {
                    //Sign Obj FOr Merge User
                    signObj.receiverId = mergeUser.uid;
                    signObj.userType = 2;
                    signObj.amount = plan.plan_price;
                    signObj.planId = req.query.id;
                    signObj.withdrawalId = mergeUser.h_id
                }
                

                
            }

            //Manipulate Date
            if(mergeUser){
            mergeUser.time = extractTime(mergeUser.h_created,"hh:mm A");
            mergeUser.h_created = getDateFormatForPost(mergeUser.h_created);
            
            const mergeTrack = await getMergeTrackByRecieverId(mergeUser.uid);
            mergeUser.countdown = mergeTrack.mt_created_at
            }
            
            
        }
        
        
    
    }
    //Else, That Is "MANUAL", Sending To The System Only
    else {
        const hasMerged = await getMergeTrackBySenderId(id);

        if (hasMerged && hasMerged.mt_user_type === "admin") {

            //Get The Receieve Who is Admin details
            mergeAdmin = await getAdminBankById(hasMerged.mt_reciever_id)
            mergeAdmin.h_amount_requested = plan.plan_price;

        } else {
            
            mergeAdmin = chooseRandom(await getAdminBank());
            mergeAdmin.h_amount_requested = plan.plan_price;

            //Create Track
            await createMergeTrack({
                mt_sender_id: id,
                mt_plan_id: req.query.id,
                mt_reciever_id: mergeAdmin.uid,
                mt_user_type: "admin"
            });
            
        }

        

        //SIgn Obj
        signObj.receiverId = mergeAdmin.uid;
        signObj.userType = 1;
        signObj.amount = plan.plan_price;
        signObj.planId = req.query.id
    }

    //Sign The Obj
    const token = await signObjToken(signObj);
    
    res.render("user/pages/plans/merge", {
        title: "Merging",
        mergeUser,
        mergeAdmin,
        token
    })

});


//MERGE (POST) UPLOAD PROOF
exports.userPlanMergePost = asyncHandler(async (req, res, next) => {
    const { id } = await openToken(req.signedCookies[process.env.TOKEN_NAME])
    
    //First CHeck If Has Active Investment Records
    //Then Delete It Before Any Other Thing
    const hasActiveInvestment = await getUserInvestmentRecords(id);
    if (hasActiveInvestment) {
        await deleteInvestmentRecordsById(hasActiveInvestment.r_id);
    };
    
    //Extract Obj In TOken
    let token
    if (req.body.token) {
        token = await openToken(req.body.token)
    };

    //Upload Avatar For Withdrawal And History
    if (req.imageName) {

        //If Merging Is Auto
        try {
            if (req.query.withId) {
            //Insert Proof To Withdrawal History For The Reciver User
            
            await editWithdrawalById(req.query.withId, {
                h_proof: req.imageName,
                h_sender_id: id,
                h_user_type: 2,
                h_status: 2,
                h_inv_id: req.query.invId
            });
            
            }
        } catch (error) {
            
        }

        
        //Insert Proof To Investment History
        await editInvestmentHistoryById(req.query.invId, {
            h_proof: req.imageName
        });

        return res.json({status:true,message:"Proof of payment uploaded Successfully",text:"Kindly wait while the reciever confirmed and approved the payment, till then you can keep track of the process in your investment history in your dashboard."})
    }
    

    //Send Form
    const { insertId:invId } = await insertIntoInvestmentHistory({
        h_sender_id: id,
        h_receiver_id: token.receiverId,
        h_user_type: token.userType,
        h_amount: token.amount,
        h_plan_id: token.planId,
        h_trans: "TRX"+getUniqueID()
    });

    //Delete The Merge Track
    await deleteMergeTrackByBothId(token.receiverId,id)
    

    //Send Notification Mail To The Receiver
    //USertype === 1 ? "Admin":"USer"
    if (token.userType === 1) {
        const user = await getAdminById(token.receiverId);
        
        user.year = new Date().getFullYear();
        user.amount = token.amount;

        notifyAdminMergeRecieverMailer(user)

    } else {
        const user = await getUserById(token.receiverId);
        
        user.year = new Date().getFullYear();
        user.amount = token.amount;

        notifyMergeRecieverMailer(user)

    }

    

    return res.json({status:true,message:"Proof of payment uploaded Successfully",text:"Kindly wait while the reciever confirmed and approved the payment, till then you can keep track of the process in your investment history in your dashboard.",invId,withdrawalId:token.withdrawalId})


});