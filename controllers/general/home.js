const asyncHandler = require("../../helpers/asyncHandler");
const formatNumber = require("../../helpers/formatNumber");
const { getAllInvestmentAmount, getTopInvestors } = require("../../helpers/investment");
const { userGetPlansCount, userGetPlans } = require("../../helpers/plans");
const { getTestimonies } = require("../../helpers/testimony");
const { adminGetAllMember, getTopReferral } = require("../../helpers/user");
const { getAllWithdrawalAmount } = require("../../helpers/withdrawal");


exports.homePage = asyncHandler(async (req, res, next) => {
    
    /* 
    const packages = formatNumber(await userGetPlansCount());
    const totalInvested = formatNumber(await getAllInvestmentAmount());
     */
    const plans = await userGetPlans();
    const topInvestors = await getTopInvestors(12);
    const members = await adminGetAllMember()
    const withdrawalLong = await getAllWithdrawalAmount();
    const withdrawalWrap = formatNumber(withdrawalLong)
    const testimonies = await getTestimonies(10);
    
    //const topReferrer = await getTopReferral(12);

    res.render("general/page/home", {
        title: "Trustrich Investment",
        plans,
        topInvestors,
        members,
        withdrawalLong,
        withdrawalWrap,
        testimonies

    })
})
