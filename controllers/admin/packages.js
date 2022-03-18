const asyncHandler = require("../../helpers/asyncHandler");
const { createNewPlan, adminGetPlans, editPlanById, deletePlanById } = require("../../helpers/plans");

//<!--------------PACKAGE-------->

exports.adminListPlanGet = asyncHandler(async (req, res, next) => {
    
    //Get Packages
    const packages = await adminGetPlans();

    res.render("admin/pages/plan/listPlan", {
        title: "Investment Plans",
        packages
    })
})

//EDIT PLAN
exports.adminEditPlanPut = asyncHandler(async (req, res, next) => {
    
    await editPlanById(req.query.id, req.body);

    //Response To User
    return res.json({status:true,message:"Plan Edited Successfully"})
})

//DELETE PLAN
exports.adminDeletePlanDelete = asyncHandler(async (req, res, next) => {
    
    await deletePlanById(req.query.id);

    //Response To User
    return res.json({status:true,message:"Plan Deleted Successfully"})
})


//CREATE NEW PLAN (POST)
exports.adminCreatePlanPost = asyncHandler(async (req, res, next) => {
    
    //Insert Into DB
    await createNewPlan(req.body);

    //Response To User
    return res.json({status:true,message:"Plan Created Successfully"})
})