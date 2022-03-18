const asyncHandler = require("../../helpers/asyncHandler");
const { getDateFormatForPost } = require("../../helpers/dateTime");
const { getModeratorsList, editModeratorById, deleteModeratorById, createNewModerator } = require("../../helpers/moderator");
const { paginateData, getNextOffset } = require("../../helpers/pagination");
const { hashPassword } = require("../../helpers/password");
const { getUsersList, editUserById, deleteUserById } = require("../../helpers/user");

//USERS LIST
exports.adminModeratorListGet = asyncHandler(async (req, res, next) => {
    const search = req.query.search, limit = req.query.limit || parseInt(process.env.LIMIT),currentPage = parseInt(req.query.page)|| 1;
    
    //Pagination VAR
    let link, prevBtn = null, nextBtn = null;
    


    let users = await getModeratorsList(search, limit, getNextOffset(currentPage, limit));

        await users.map(u => {
            u.created_at = getDateFormatForPost(u.created_at)
        })

    let pageList = await getModeratorsList(search, 999999999, 0);
    

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

    if (search) {
        link = `/admin/moderators?search=${search}&`
    } else {
        link = `/admin/moderators?`
    }
    
    res.render("admin/pages/moderators/userList", {
        title: "Moderators ",
        users,
        prevBtn,
        nextBtn,
        link
    })
})

//CREATE MODERATOR
exports.adminModeratorPost = asyncHandler(async (req, res, next) => {
    
    req.body.password = await hashPassword(req.body.password)

    try {
      await createNewModerator(req.body);
    } catch (error) {
        let message;
        if (error.sqlMessage.includes("phone")) {
            message = "Phone Number Already Taken"
        } else if (error.sqlMessage.includes("email")) {
            message = "Email Already Taken"
        }else if (error.sqlMessage.includes("username")) {
            message = "Username Already Taken"
        };

        return res.json({status:false,message})
    }

    

    return res.json({ status: true, message: "Moderator Created Successfully"})
    

})

//EDIT USER
exports.adminModeratorPut = asyncHandler(async (req, res, next) => {
    
    
    try {
      await editModeratorById(req.query.id, req.body);  
    } catch (error) {
        let message;
        if (error.sqlMessage.includes("phone")) {
            message = "Phone Number Already Taken"
        } else if (error.sqlMessage.includes("email")) {
            message = "Email Already Taken"
        }else if (error.sqlMessage.includes("username")) {
            message = "Username Already Taken"
        };

        return res.json({status:false,message})
    }
    return res.json({ status: true, message: "Moderator Edited Successfully"})
    

})

//DELETE USER
exports.adminModeratorDelete = asyncHandler(async (req, res, next) => {
    
    if (req.body.type === "mark_all") {
        await req.body.data.forEach(async d => {
            await deleteModeratorById(d.id)
        });
        return res.json({ status: true, message: `${req.body.data.length} Moderator(s) Deleted`})
    } else {
        
        await deleteModeratorById(req.query.id)
        return res.json({ status: true, message: "Moderator Deleted"})
    }
    
    
    

})
