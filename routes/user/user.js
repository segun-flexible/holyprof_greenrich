const { admingGetSenderMerge, admingGetReceiverMerge } = require("../../controllers/admin/history/investmentMergeHistory");
const { activationFeePost } = require("../../controllers/user/activation");
const { userDashboardGet } = require("../../controllers/user/dashboard");
const { userInvestmentHistoryGet } = require("../../controllers/user/history/investmentHistory");
const { userReferralHistory } = require("../../controllers/user/history/referralHistory");
const { userWithdrawalHistory, userApproveTheWithdrawal } = require("../../controllers/user/history/withdrawalHistory");
const { userPlansGet, userPlanMergeGet, userPlanMergePost } = require("../../controllers/user/plans");
const { userReportGet, userReportPost, userReportListGet, userDeleteReportDelete } = require("../../controllers/user/report");
const { userProfileGet, userSettingsPost, userSecurityGet } = require("../../controllers/user/settings");
const { testimonyGet, testimonyPost, testimonyPut, testimonyDelete } = require("../../controllers/user/testimony");
const { userTopupGet } = require("../../controllers/user/topup");
const { userWalletGet, userWalletPost } = require("../../controllers/user/wallet");
const { userMakeWithdrawalGet, userMakeWithdrawalPost } = require("../../controllers/user/withdrawal");
const { extras } = require("../../middleware/extras");
const { generalData } = require("../../middleware/generalData");
const { isUserLogin, isUserVerified, denyAdmin } = require("../../middleware/isAuth");
const { userDetails } = require("../../middleware/userInfo");
const { activationFeeMulter, mergeMulter, userAvatarMulter } = require("../../multer/multerMiddleware");

const userRoute = require("express").Router();

//<!-----------------DASHBOARD------------------>
//DASHBOARD
userRoute.route("/dashboard").get(isUserLogin, generalData, userDetails, isUserVerified, denyAdmin, extras, userDashboardGet)

//<!-----------------PLANS------------------>
//PLANS
userRoute.route("/plans").get(isUserLogin, generalData, userDetails, isUserVerified, denyAdmin, extras, userPlansGet)

//PLAN MERGE
userRoute.route("/plan/merge").get(isUserLogin, generalData, userDetails, isUserVerified, denyAdmin, extras, userPlanMergeGet).post(isUserLogin, isUserVerified, denyAdmin, extras, mergeMulter.any(), userPlanMergePost)

//<!-----------------ACTIVATION FEEE------------------>
//PLANS
userRoute.route("/activation").post(isUserLogin, denyAdmin, activationFeeMulter.any(), activationFeePost)

//<!-----------------HISTORY------------------>
//INVESTMENT HISTORY
userRoute.route("/history/investment").get(isUserLogin, generalData, userDetails, isUserVerified, denyAdmin, extras, userInvestmentHistoryGet)

//WITHDRAWAL HISTORY
userRoute.route("/history/withdrawal").get(isUserLogin, generalData, userDetails, isUserVerified, denyAdmin, extras, userWithdrawalHistory).post(isUserLogin, isUserVerified, denyAdmin, extras, userApproveTheWithdrawal);

//REFERRAL HISTORY
userRoute.route("/history/referrals").get(isUserLogin, generalData, userDetails, isUserVerified, denyAdmin, extras, userReferralHistory);

//<!-----------------WITHDRAWAL------------------>
//WITHDRAWAL
userRoute.route("/withdrawal").get(isUserLogin, generalData, userDetails, isUserVerified, denyAdmin, extras, userMakeWithdrawalGet).post(isUserLogin, isUserVerified, denyAdmin, extras, userMakeWithdrawalPost)

//<!-----------------WALLET------------------>
//WALLET
userRoute.route("/wallet").get(isUserLogin, generalData, userDetails, isUserVerified, denyAdmin, extras, userWalletGet).post(isUserLogin, isUserVerified, denyAdmin, extras, userWalletPost)

//<!-----------------TOPUP------------------>
//WALLET
userRoute.route("/topup").get(isUserLogin, generalData, userDetails, isUserVerified, denyAdmin, extras, userTopupGet).post(isUserLogin, isUserVerified, denyAdmin, extras, userWalletPost)


//<!-----------------USER------------------>
//GET USER (SENDER MERGE)
userRoute.route("/getuser").post(isUserLogin, isUserVerified, denyAdmin, extras, admingGetSenderMerge)

//GET USER (RECIEVER MERGE)
userRoute.route("/getreciever").post(isUserLogin, isUserVerified, denyAdmin, extras, admingGetReceiverMerge)


//<!-----------------SETTINGS------------------>
//PROFILE
userRoute.route("/settings/profile").get(isUserLogin, generalData, userDetails, isUserVerified, denyAdmin, extras, userProfileGet).post(isUserLogin, isUserVerified, denyAdmin, extras, userAvatarMulter.single("avatar"), userSettingsPost)

//SECURITY
userRoute.route("/settings/security").get(isUserLogin, generalData, userDetails, isUserVerified, denyAdmin, extras, userSecurityGet).post(isUserLogin, isUserVerified, denyAdmin, extras, userSettingsPost)

//<!-----------------REPORT------------------>
//REPORT
userRoute.route("/report").get(isUserLogin, generalData, userDetails, isUserVerified, denyAdmin, extras, userReportGet).post(isUserLogin, isUserVerified, denyAdmin, extras, userReportPost)

//REPORT LIST HISTORY
userRoute.route("/report/history").get(isUserLogin, generalData, userDetails, isUserVerified, denyAdmin, extras, userReportListGet).delete(isUserLogin, isUserVerified, denyAdmin, extras, userDeleteReportDelete)

//<!-----------------TESTIMONY------------------>
//TESTIMONY
userRoute.route("/testimony").get(isUserLogin, generalData, userDetails, isUserVerified, denyAdmin, extras, testimonyGet).post(isUserLogin, isUserVerified, denyAdmin, extras, testimonyPost).put(isUserLogin, isUserVerified, denyAdmin, extras, testimonyPut).delete(isUserLogin, isUserVerified, denyAdmin, extras, testimonyDelete)

module.exports = userRoute