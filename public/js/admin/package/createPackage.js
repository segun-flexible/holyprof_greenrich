let submit, cbText;

document.addEventListener("DOMContentLoaded", () => {
    
    //Submit Form
    document.querySelectorAll("form#create-plan").forEach(form => {
        form.addEventListener("submit", e => {
            e.preventDefault();
            const obj = {
                plan_name: e.currentTarget.querySelector("input#name").value,
                plan_desc: e.currentTarget.querySelector("textarea#desc").value,
                plan_price: e.currentTarget.querySelector("input#price").value,
                plan_recurring_fee: e.currentTarget.querySelector("input#recurring_fee").value,
                plan_recurring_max: e.currentTarget.querySelector("input#max_earn").value,
                plan_min_withdrawal: e.currentTarget.querySelector("input#withdrawal").value
            };

            submit = e.currentTarget.querySelector("button.btn.btn-primary.waves-effect.waves-light");
            fetchResourse(obj,window.location.href,"POST","reload")
        })
    })
})