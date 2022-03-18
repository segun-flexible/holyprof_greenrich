const asyncHandler = require("../../helpers/asyncHandler");
const { openToken } = require("../../helpers/jwt");
const { getUserTestimony, createUserTestimony, editUserTestimony, deleteUserTestimony } = require("../../helpers/testimony");


exports.testimonyGet = asyncHandler(async (req, res, next) => {
    const { id } = await openToken(req.signedCookies[process.env.TOKEN_NAME]);

    const testimony = await getUserTestimony(id);

    return res.render("user/pages/testimony/testimony", {
        title: "My Testimony",
        testimony
    })

})

exports.testimonyPost = asyncHandler(async (req, res, next) => {
    const { id } = await openToken(req.signedCookies[process.env.TOKEN_NAME]);

    //Assign Author
    req.body.t_user_id = id;
    
    await createUserTestimony(req.body);
    return res.json({ status: true, message: "Testimony Created Successfully" })
});



exports.testimonyPut = asyncHandler(async (req, res, next) => {

    
    await editUserTestimony(req.query.id, req.body);

    return res.json({ status: true, message: "Testimony Edited Successfully" })
})

exports.testimonyDelete = asyncHandler(async (req, res, next) => {

    
    await deleteUserTestimony(req.query.id);

    return res.json({ status: true, message: "Testimony Deleted Successfully" })
})