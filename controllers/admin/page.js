const asyncHandler = require("../../helpers/asyncHandler");
const { getDateFormatForPost } = require("../../helpers/dateTime");
const { openToken } = require("../../helpers/jwt");
const { adminGetPage, editPageById, deletePageById, createNewPage, admimGetPageById } = require("../../helpers/pages");
const { getNextOffset, paginateData } = require("../../helpers/pagination");

exports.adminPageGet = asyncHandler(async (req, res, next) => {
    const limit = req.query.limit || parseInt(process.env.LIMIT),currentPage = parseInt(req.query.page)|| 1;
    
    //Pagination VAR
    let link, prevBtn = null, nextBtn = null;
    


    let pages = await adminGetPage(limit, getNextOffset(currentPage, limit));
    
    await pages.map(p => {
        p.page_created_at = getDateFormatForPost(p.page_created_at)
    })
    

    let pageList = await adminGetPage(999999999, 0);
    
    //PAGINATION
    const pageData = paginateData(limit, pageList.length);

    //Prev
    if (currentPage > 1) {
        prevBtn = currentPage - 1;
    }

    //Next
    if (currentPage !== "" && pageData[pageData.length - 1] > currentPage) {
        nextBtn = currentPage + 1
    };

    
    res.render("admin/pages/pages/pageList", {
        title: "Pages ",
        pages,
        prevBtn,
        nextBtn,
        link
    })

})

//EDIT PAGE (PUT)
exports.adminPagePut = asyncHandler(async (req, res, next) => {

    await editPageById(req.query.id, req.body);
    return res.json({status:true,message:"Changes Saved"})

})

//DELETE PAGE (DELETE)
exports.adminPageDelete = asyncHandler(async (req, res, next) => {

    await deletePageById(req.query.id);
    return res.json({status:true,message:"Page  Deleted"})

})

//ADD PAGE (POST)
exports.adminPagePost = asyncHandler(async (req, res, next) => {

    const { id } = await openToken(req.signedCookies[process.env.TOKEN_NAME])

    //Assign Author
    req.body.page_author = id;
    
    await createNewPage(req.body);
    return res.json({status:true,message:"Page Created"})

})


//GET PAGE FOR EDIT
exports.adminGetPageForEdit = asyncHandler(async (req, res, next) => {

    const page = await admimGetPageById(req.params.id);
    if (!page) {
        return res.render("error/error", {
        title: "Page Not Found",
        status: "404",
        heading: "The page you are looking for has been broken",
        text:"",
        button:{}
    })
    }

    res.render("admin/pages/pages/getPageForEdit", {
        title: `Edit ${page.page_title}`,
        pg:page
    })

})