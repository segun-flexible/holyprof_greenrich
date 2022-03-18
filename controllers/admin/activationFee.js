const { activationList, editActivationFeeById, incrementUserActivationFeeById, deleteActivationFeeById } = require("../../helpers/activation");
const asyncHandler = require("../../helpers/asyncHandler");
const { getDateFormatForPost } = require("../../helpers/dateTime");
const { getNextOffset, paginateData } = require("../../helpers/pagination");
const fs = require("fs");
const { activationFeeMailer } = require("../../email/mails/activationFeeMail");

//ACTIVATION FEE LIST
exports.adminActivationFeeGet = asyncHandler(async (req, res, next) => {
    
    const status = req.query.status, transID = req.query.trans, limit = req.query.limit || parseInt(process.env.LIMIT), currentPage = parseInt(req.query.page) || 1;
    
    const type = req.query.status && parseInt(req.query.status) === 1 ? 'Completed' : 'Pending';
   
    //Pagination VAR
    let link, prevBtn = null, nextBtn = null;
    

    const hType = req.query.status && parseInt(req.query.status) === 1 ? '1' : '0';

    let history = await activationList(hType, transID, limit, getNextOffset(currentPage, limit));
    
    await history.map(h => {
        h.h_created = getDateFormatForPost(h.h_created)
    })

    
    let pageList = await activationList(hType, transID, 999999999, 0);
    

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
  
    if (transID) {
        link = `/admin/activation?trans=${transID}&`
    }
    else if (status) {
        link = `/admin/activation?status=${status}&`
    } else {
        link = `/admin/activation?`
    }

    

    res.render(`admin/pages/activation/${type}ActivationList`, {
        title: `${type} Activation Fee`,
        history,
        prevBtn,
        nextBtn,
        link
    })
});

//APPROVING ACTIVATION FEE
exports.adminActivationFeePut = asyncHandler(async (req, res, next) => {
    //Multiple Approved
    if (req.body.type === "mark_all") {
        
        await req.body.data.map(async d => {
            
            //Credit The User
            await incrementUserActivationFeeById(d.userId,d.amount)
            //Change The Status To DOne (1)
            await editActivationFeeById(d.id, { h_status: 1 });

            //Send Mail
            const obj = {
                email: d.email,
                amount: d.amount,
                year: new Date().getFullYear()
            };
            activationFeeMailer(obj);
            
            //Delete The Proof
            try {
                fs.unlinkSync(`public${d.proof}`)
            } catch (error) {
                
            }
        });

        //Response To User
        return res.json({ status: true, message: `Good Job, You Completed ${req.body.data.length} Activation Fee` })
        
    }
    //One By One Approved
    else {
        
        //Credit The User
            await incrementUserActivationFeeById(req.body.userId,req.body.amount)
            //Change The Status To DOne (1)
            await editActivationFeeById(req.body.id, { h_status: 1 });
            
            //Send Mail
            const obj = {
                email: req.body.email,
                amount: req.body.amount,
                year: new Date().getFullYear()
            };
            activationFeeMailer(obj);
            
            //Delete The Proof
            try {
                fs.unlinkSync(`public${req.body.proof}`)
            } catch (error) {
                
            }

        //Response To User
        return res.json({ status: true, message: `Good Job, You Completed This Activation Fee` })
        
    }
    
})


//DELETING ACTIVATION FEE
exports.adminActivationFeeDelete = asyncHandler(async (req, res, next) => {
    //Multiple Delete
    if (req.body.type === "mark_all") {
        
        await req.body.data.map(async d => {
        
            //Delete From History
            await deleteActivationFeeById(d.id);

            //Delete The Proof
            try {
                fs.unlinkSync(`public${d.proof}`)
            } catch (error) {
                
            }
        });

        //Response To User
        return res.json({ status: true, message: `Good Job, You Deleted ${req.body.data.length} Activation Fee` })
        
    }
    //One By One Deleting
    else {
        
        //Delete From History
        await deleteActivationFeeById(req.body.id);
        
        //Delete The Proof
        try {
            fs.unlinkSync(`public${req.body.proof}`)
        } catch (error) {
            
        }

        //Response To User
        return res.json({ status: true, message: `Good Job, You Deleted This Activation Fee` })
        
    }
    
})