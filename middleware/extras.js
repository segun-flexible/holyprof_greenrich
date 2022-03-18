const { openToken } = require("../helpers/jwt");
const { getMergeTrackByBothId, deleteMergeTrackByBothId } = require("../helpers/merge");
const { editUserById, getUserById } = require("../helpers/user");

exports.extras = async (req, res, next) => {

    const { id, role } = await openToken(req.signedCookies[process.env.TOKEN_NAME]);

    //Check If Has Paid Activation Fee
    const { current_activation_fee } = await getUserById(id);
    if (!current_activation_fee) return res.render("auth/activation/activationFees",{title:"Activation Fee Is Required"})
    
    //Check If Is A  member
    //Then CHeck If He Was Merge With Someone And His Yet To Pay
    //Or Someone wanna pay him

    if (!role) {
        const merge = await getMergeTrackByBothId(id);
        if (merge) {
            //Check If Countdown Has Due
            const countDown = new Date(merge.mt_created_at);
            countDown.setDate(countDown.getDate() + 1);

            var distance = countDown - new Date().getTime();;

            var hours = Math.floor((distance % (1000 * 60 * 60 * 12)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            hours = ("00" + hours).slice(-2);
            minutes = ("00" + minutes).slice(-2);
            seconds = ("00" + seconds).slice(-2);
    
            res.locals.timeUp = { hours, seconds, minutes,id,...merge };
            
            //Lock Account If Failed To Pay Merge
            if (hours <= 0) {
                //Delete The Merge
                await deleteMergeTrackByBothId(merge.mt_reciever_id, merge.mt_sender_id);
                await editUserById(merge.mt_sender_id, {
                    is_lock: 1
                });

            }


        }
        res.locals.myMerge = merge;
    }

    next()
    

}

    


    /* const tomorrow = new Date(document.querySelector("input#countdown").value)
tomorrow.setDate(tomorrow.getDate() + 1)
// Update the count down every 1 second
var x = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();
    
  // Find the distance between now and the count down date
  var distance = tomorrow - now;
    
  // Time calculations for days, hours, minutes and seconds
  var hours = Math.floor((distance % (1000 * 60 * 60 * 12)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  hours = ("00" + hours).slice(-2);
  minutes = ("00" + minutes).slice(-2);
    seconds = ("00" + seconds).slice(-2);
    
    document.querySelector("span#hour").innerHTML = hours;
    document.querySelector("span#minute").innerHTML = minutes;
    document.querySelector("span#second").innerHTML = seconds;

   
}, 1000); */