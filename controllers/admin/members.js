const asyncHandler = require("../../helpers/asyncHandler");
const { getDateFormatForPost } = require("../../helpers/dateTime");
const { paginateData, getNextOffset } = require("../../helpers/pagination");
const { getUsersList, editUserById, deleteUserById } = require("../../helpers/user");

//USERS LIST
exports.adminUsersListGet = asyncHandler(async (req, res, next) => {
    const search = req.query.search, limit = req.query.limit || parseInt(process.env.LIMIT),currentPage = parseInt(req.query.page)|| 1;
    
    //Pagination VAR
    let link, prevBtn = null, nextBtn = null;

    let users = await getUsersList(search, limit, getNextOffset(currentPage, limit));

        await users.map(u => {
            u.created_at = getDateFormatForPost(u.created_at)
        })

    let pageList = await getUsersList(search, 999999999, 0);
    

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
        link = `/admin/users?search=${search}&`
    } else {
        link = `/admin/users?`
    }
    
    res.render("admin/pages/users/userList", {
        title: "Users ",
        users,
        prevBtn,
        nextBtn,
        link
    })
})

//EDIT USER
exports.adminUserPut = asyncHandler(async (req, res, next) => {
    
    
    try {
      await editUserById(req.query.id, req.body);  
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
    return res.json({ status: true, message: "User Edited Successfully"})
    

})

//DELETE USER
exports.adminUserDelete = asyncHandler(async (req, res, next) => {
    
    if (req.body.type === "mark_all") {
        await req.body.data.forEach(async d => {
            await deleteUserById(d.id)
        });
        return res.json({ status: true, message: `${req.body.data.length} User(s) Deleted`})
    } else {
        
        await deleteUserById(req.query.id)
        return res.json({ status: true, message: "User Deleted"})
    }
    
    
    

})
