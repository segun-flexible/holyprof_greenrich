const asyncHandler = require("../../helpers/asyncHandler");
const { getDateFormatForPost } = require("../../helpers/dateTime");
const { getNextOffset, paginateData } = require("../../helpers/pagination");
const { getTestimoniesForAdmin, deleteUserTestimony, editUserTestimony } = require("../../helpers/testimony");


//Get TESTIMONIES
exports.adminTestimoniesGet = asyncHandler(async (req, res, next) => {
    
    const limit = req.query.limit || parseInt(process.env.LIMIT), currentPage = parseInt(req.query.page)|| 1, status = req.query.status;
    
    //Pagination VAR
    let link, prevBtn = null, nextBtn = null;
    


    const testimony = await getTestimoniesForAdmin(status, limit, getNextOffset(currentPage, limit));
    
    
    await testimony.map(ts => {
        ts.t_created_at = getDateFormatForPost(ts.t_created_at)
    });
    

    //PAGINATION
    const pageData = paginateData(limit, testimony.length);

    //Prev
    if (currentPage > 1) {
        prevBtn = currentPage - 1;
    }

    //Next
    if (currentPage !== "" && pageData[pageData.length - 1] > currentPage) {
        nextBtn = currentPage + 1
    };

    
    res.render("admin/pages/testimony/testimony", {
        title: "Testimony ",
        testimony,
        prevBtn,
        nextBtn,
        link
    })

})

//APPROVED TESTIMONIES
exports.adminTestimoniesPut = asyncHandler(async (req, res, next) => {
    await editUserTestimony(req.body.id, {
        t_status: 1
    });

    return res.json({status:true,message:"Testimony Approved"})
})

//DELETE TESTIMONIES
exports.adminTestimoniesDelete = asyncHandler(async (req, res, next) => {
 
    await deleteUserTestimony(req.body.id);
    return res.json({status:true,message:"Testimony Deleted"})
})