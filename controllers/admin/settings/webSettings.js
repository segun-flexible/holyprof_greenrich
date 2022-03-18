const asyncHandler = require("../../../helpers/asyncHandler");
const { saveSettings } = require("../../../helpers/settings");


//WEB SETTINGS
exports.adminWebSettingsGet = asyncHandler(async (req, res, next) => {
    res.render("admin/pages/settings/webSettings", {
        title: "Web Settings"
    })
})

//SOCIAL SETTINGS
exports.adminSocialSettingsGet = asyncHandler(async (req, res, next) => {
    res.render("admin/pages/settings/socialSettings", {
        title: "Social Media Settings"
    })
})

//RECURRING SETTINGS
exports.adminRecurringSettingsGet = asyncHandler(async (req, res, next) => {
    res.render("admin/pages/settings/recurringSettings", {
        title: "Recurring Settings"
    })
})

//MERGING ACTIVATION SETTINGS
exports.adminMergingActivationSettingsGet = asyncHandler(async (req, res, next) => {
    res.render("admin/pages/settings/mergeActivation", {
        title: "Merging & Activation Settings"
    })
})


//IDENTITY SETTINGS
exports.adminIdentitySettingsGet = asyncHandler(async (req, res, next) => {
    res.render("admin/pages/settings/identitySettings", {
        title: "Identity Settings"
    })
})

//WITHDRAWAL SETTINGS
exports.adminWithdrawalSettingsGet = asyncHandler(async (req, res, next) => {
    res.render("admin/pages/settings/withdrawalSettings", {
        title: "Withdrawal Settings"
    })
})


//ADMIN SETTING SAVED (POST)
exports.adminSettingsPost = asyncHandler(async (req, res, next) => {
    if (!req.imageName) {
      await saveSettings(req.body);  
    } else {

        await req.files.forEach(async img => {
            
            await saveSettings({[img.fieldname]:""}); 
            await saveSettings({ [img.fieldname]: `/img/identity/${img.filename}` });
            
        });
        
        
    }
    
    return res.json({status:true,message:"Changes Saved"})
})