
let submit, cbText;

document.addEventListener("DOMContentLoaded", () => {
    
    //Submit Form
    document.querySelectorAll("form#editPlan").forEach(form => {
        form.addEventListener("submit", e => {
            e.preventDefault();
            const obj = {
                plan_name: e.currentTarget.parentElement.querySelector("input#title").value,
                plan_price: e.currentTarget.parentElement.querySelector("input#price").value,
                plan_activation_fee: e.currentTarget.parentElement.querySelector("input#activation").value,
                plan_roi: e.currentTarget.parentElement.querySelector("input#roi").value,
                plan_referral: e.currentTarget.parentElement.querySelector("input#referral").value,
                plan_duration: e.currentTarget.parentElement.querySelector("input#duration").value,
                plan_visibility: e.currentTarget.parentElement.querySelector("input[type=checkbox]").checked ? 1 : 0
            };

         

            submit = e.currentTarget.parentElement.querySelector("button#button");
            fetchResourse(obj, window.location.href + "?id=" + e.currentTarget.dataset.id, "PUT", "reload")
        })
    });

    
    //CREATE PLAN
    document.querySelector("form#create").addEventListener("submit", e => {
            e.preventDefault();
            const obj = {
                plan_name: e.currentTarget.parentElement.querySelector("input#title").value,
                plan_price: e.currentTarget.parentElement.querySelector("input#price").value,
                plan_activation_fee: e.currentTarget.parentElement.querySelector("input#activation").value,
                plan_roi: e.currentTarget.parentElement.querySelector("input#roi").value,
                plan_referral: e.currentTarget.parentElement.querySelector("input#referral").value,
                plan_duration: e.currentTarget.parentElement.querySelector("input#duration").value
            };

         

            submit = e.currentTarget.parentElement.querySelector("button#button");
            fetchResourse(obj, window.location.href, "POST", "reload")
    });
    

    //DELETE PLAN
    document.querySelectorAll("a.delete-package").forEach(btn => {
        btn.addEventListener("click", e => {
            const id = e.target.dataset.id;
            swal({
                title: "Are you sure?",
                text: "You cannot recover this once deleted!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then(wilDelete => {
                if (wilDelete) {
                    submit = e.target;
                   fetchResourse({},window.location.href + "?id=" + id,"DELETE","reload") 
                    
                }
            })
            
        })
    })
})