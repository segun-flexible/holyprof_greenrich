const asyncHandler = require("../../helpers/asyncHandler");
const { getNotice, editNoticeById, createNewNotice } = require("../../helpers/notice");

//NOTICE (GET)
exports.adminNoticeGet = asyncHandler(async (req, res, next) => {
    
    const notice = await getNotice();

    res.render("admin/pages/notice/notice", {
        title: "Notice Board",
        notice
    })
});

//ADMIN NOTICE (POST)
exports.adminNoticePost = asyncHandler(async (req, res, next) => {
    
    await createNewNotice(req.body);
    return res.json({status:true,message:"Notice Created"})
});

//ADMIN NOTICE (PUT)
exports.adminNoticePut = asyncHandler(async (req, res, next) => {
    
    await editNoticeById(req.body);
    return res.json({status:true,message:"Changes Saved"})
});


