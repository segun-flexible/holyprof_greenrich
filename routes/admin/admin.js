
const { adminDashboardGet } = require("../../controllers/admin/dashboard");

const { isAdmin, isUserLogin, isRoleAllow } = require("../../middleware/isAuth");
const { identityMulter, userAvatarMulter } = require("../../multer/multerMiddleware");

const { adminActivationFeeGet, adminActivationFeePut, adminActivationFeeDelete } = require("../../controllers/admin/activationFee");
const { adminInvestmentMergeHistoryGet, admingGetSenderMerge, admingGetReceiverMerge, admingPostMerge, adminDeleteInvestmentHistory } = require("../../controllers/admin/history/investmentMergeHistory");
const { adminListPlanGet, adminCreatePlanPost, adminEditPlanPut, adminDeletePlanDelete } = require("../../controllers/admin/packages");
const { adminUsersListGet, adminUserPut, adminUserDelete } = require("../../controllers/admin/members");
const { adminWithdrawaltListGet, adminWithdrawalApprovedPut, adminWithdrawalDeletedDelete } = require("../../controllers/admin/withdrawal");
const { adminActiveInvestmentHistory } = require("../../controllers/admin/history/activeInvestmentList");
const { adminSettingsPost, adminWebSettingsGet, adminSocialSettingsGet, adminIdentitySettingsGet, adminMergingActivationSettingsGet, adminWithdrawalSettingsGet } = require("../../controllers/admin/settings/webSettings");
const { adminProfileSettingsGet, adminProfileSettingsPost, adminWalletSettingsPost } = require("../../controllers/admin/settings/profile");
const { adminPageGet, adminPagePost, adminPagePut, adminPageDelete, adminGetPageForEdit } = require("../../controllers/admin/page");
const { adminReportListGet, adminReportListDelete } = require("../../controllers/admin/report");
const { adminNoticeGet, adminNoticePost, adminNoticePut } = require("../../controllers/admin/notice");
const { generalData } = require("../../middleware/generalData");
const { userDetails } = require("../../middleware/userInfo");
const { adminModeratorListGet, adminModeratorPost, adminModeratorPut, adminModeratorDelete } = require("../../controllers/admin/moderator");
const { overallListGet } = require("../../controllers/admin/summary/overall");
const { adminTestimoniesDelete, adminTestimoniesGet, adminTestimoniesPut  } = require("../../controllers/admin/testimony");

const adminRoute = require("express").Router();

//ADMIN DASHBOARD
adminRoute.route("/dashboard").get(generalData, isRoleAllow([1,2,3]), userDetails, adminDashboardGet);

//<!---------------------ACTIVATION FEE------------------------>
//ADMIN PACKAGES
adminRoute.route("/activation").get(generalData, isRoleAllow([1,2,3]), userDetails, adminActivationFeeGet).put(isRoleAllow([1,2,3]),adminActivationFeePut).delete(isRoleAllow([1,2,3]),isAdmin,adminActivationFeeDelete);


//<!---------------------HISTORY------------------------>
//INVESTMENT MERGE
adminRoute.route("/history/merge/:type").get(generalData, isRoleAllow([1,2]), userDetails, adminInvestmentMergeHistoryGet).post(admingPostMerge).delete(adminDeleteInvestmentHistory);

//ACTIVE INVESTMENT
adminRoute.route("/history/active-investment").get(generalData, isRoleAllow([1,2]), userDetails, adminActiveInvestmentHistory)

//FETCH MERGE USER
adminRoute.route("/get-merge-user/send").post(admingGetSenderMerge)
adminRoute.route("/get-merge-user/recieve").post(admingGetReceiverMerge)

//<!---------------------PACKAGES------------------------>
//ADMIN PACKAGES
adminRoute.route("/packages").get(generalData, userDetails, adminListPlanGet).post(adminCreatePlanPost).put(adminEditPlanPut
).delete(adminDeletePlanDelete);

//<!---------------------USERS------------------------>
//ADMIN USERS LIST (APPROVED,DELETE)
adminRoute.route("/users").get(generalData, userDetails, adminUsersListGet).put(adminUserPut).delete(adminUserDelete);

//<!---------------------MODERATOR------------------------>
//ADMIN MODERATOR LIST (APPROVED,DELETE)
adminRoute.route("/moderators").get(generalData, isRoleAllow([1]), isRoleAllow([1]),  userDetails, adminModeratorListGet).post(adminModeratorPost).put(isRoleAllow([1]),adminModeratorPut).delete(isRoleAllow([1]),adminModeratorDelete);

//ADMIN WITHDRAWAL HISTORY (APPROVED,DELETE)
adminRoute.route("/withdrawal/:type").get(generalData, userDetails, adminWithdrawaltListGet).put(adminWithdrawalApprovedPut
).delete(adminWithdrawalDeletedDelete);



//<!---------------------SETTINGS & PROFILE------------------------>
//ADMIN SAVE SETTINGS (GENERAL)
adminRoute.route("/settings/saved").post(identityMulter.any(),  adminSettingsPost)

//ADMIN WEB SETTINGS
adminRoute.route("/settings/websettings").get(isRoleAllow([1]), generalData, isRoleAllow([1]), userDetails, adminWebSettingsGet)

//ADMIN SOCIAL SETTINGS
adminRoute.route("/settings/social").get(generalData, isRoleAllow([1]), userDetails, adminSocialSettingsGet)


//ADMIN IDENTITY SETTINGS
adminRoute.route("/settings/identity").get(generalData, isRoleAllow([1]), userDetails, adminIdentitySettingsGet)

//ADMIN MERGING & ACTIVATION SETTINGS
adminRoute.route("/settings/merge-activation").get(generalData, isRoleAllow([1]), userDetails, adminMergingActivationSettingsGet)

//ADMIN WITHDRAWAL SETTINGS
adminRoute.route("/settings/withdrawal").get(generalData, isRoleAllow([1]), userDetails, adminWithdrawalSettingsGet)

//ADMIN PROFILE
adminRoute.route("/settings/profile").get(generalData, userDetails, adminProfileSettingsGet).put(userAvatarMulter.single("avatar"), adminProfileSettingsPost)

//ADMIN WALLET SETTINGS (POST)
adminRoute.route("/settings/profile/wallet").post(adminWalletSettingsPost)


//<!---------------------PAGE------------------------>
//ADMIN PAGE
adminRoute.route("/pages").get(generalData, userDetails, isRoleAllow([1,2]), adminPageGet).post(adminPagePost).put(adminPagePut).delete(adminPageDelete)

//ADMIN GET PAGE FOR EDIT
adminRoute.route("/pages/:id").get(isRoleAllow([1,2]), generalData, userDetails, adminGetPageForEdit)


//<!---------------------REPORT------------------------>
//ADMIN WITHDRAWAL HISTORY (APPROVED,DELETE)
adminRoute.route("/report/history").get(isRoleAllow([1,2]), generalData, userDetails, adminReportListGet).delete(adminReportListDelete);


//<!---------------------NOTICE------------------------>
//ADMIN NOTICE
adminRoute.route("/settings/notice").get(isRoleAllow([1,2]), generalData, userDetails, adminNoticeGet).post(adminNoticePost).put(adminNoticePut)

//<!---------------------SUMMARY------------------------>
//OVERALL SUMMARY
adminRoute.route("/summary/overall").get(isRoleAllow([1]),generalData, userDetails, overallListGet)

//<!---------------------TESTIMONY------------------------>
//TESTIMONY
adminRoute.route("/testimony").get(isRoleAllow([1]),generalData, userDetails, adminTestimoniesGet).put(isRoleAllow([1]),generalData, userDetails, adminTestimoniesPut).delete(isRoleAllow([1]),generalData, userDetails, adminTestimoniesDelete)

module.exports = adminRoute