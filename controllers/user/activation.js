const { getActivationFeeByUserId, insertActivationFee, editActivationFeeById } = require("../../helpers/activation");
const asyncHandler = require("../../helpers/asyncHandler");
const { openToken } = require("../../helpers/jwt");
const { getWebSettings } = require("../../helpers/settings");
const { getUniqueID } = require("../../helpers/uniqueID");


//ACTIVATION FEE
exports.activationFeePost = asyncHandler(async (req, res, next) => {
    const { id } = await openToken(req.signedCookies[process.env.TOKEN_NAME])
    
    //Get Activation Fee Price
    const { website_activation_fee_price } = await getWebSettings()
    
    //Save Activation Request
    await insertActivationFee({
        h_trans: 'TRX' + getUniqueID(),
        h_user_id: id,
        h_amount: website_activation_fee_price,
        h_proof: req.imageName
    });

    return res.json({ status: true, message: "Activation Fee Request Submitted", text: "You have send activation fee request to the system, and it will be process soon, once we are done, the system will notify you via your E-mail address, do not resend the form twice."})
    
});

