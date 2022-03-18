const asyncHandler = require("../../helpers/asyncHandler");
const { completeAllUserInvestmentHistory } = require("../../helpers/history");
const { getAllInvestmentRecords, editInvestmentRecordsById, deleteInvestmentRecordsById } = require("../../helpers/investment");
const { jobCreditUsers } = require("../../helpers/mics");

exports.investJobGet = asyncHandler(async (req, res, next) => {
    
    if (req.query.allow === "yes") {
        
        const investment = await getAllInvestmentRecords();
     
   
        for (let i = 0; i < investment.length; i++) {
        
            if (investment[i].r_duration <= 1) {

                //Credit ROI and Capital
                await jobCreditUsers(investment[i],true);
                
                await completeAllUserInvestmentHistory(investment[i].r_history_id)
                //Delete Record
                await deleteInvestmentRecordsById(investment[i].r_id);

            } else {
                
                //Credit ROI Only
                await jobCreditUsers(investment[i], false);
            
                //Deduct Duration
                await editInvestmentRecordsById(investment[i].r_id, { r_duration: investment[i].r_duration - 1 });
                
            }

        }

        return res.json({ status: "Done" })
        
    
    }
    
})


