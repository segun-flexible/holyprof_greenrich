
let submit, cbText;

document.addEventListener("DOMContentLoaded", () => {
    
    //Submit Form
    document.querySelectorAll("form#settings").forEach(form => {
        form.addEventListener("submit", e => {
            e.preventDefault();
            const obj = {
                website_withdrawal_status: e.currentTarget.querySelector("select#status").value,
                website_min_roi_withdrawal: e.currentTarget.querySelector("input#min_roi").value,
                website_min_ref_withdrawal: e.currentTarget.querySelector("input#min_ref").value,
                website_min_ref: e.currentTarget.querySelector("input#min_downline").value,
                website_recommitment_status: e.currentTarget.querySelector("select#recomit").value
                
                
            };
            
          
            submit = e.currentTarget.querySelector("button");
            fetchResourse(filterEmptyObj(obj),"/admin/settings/saved","POST","reload")
        })
    })
})