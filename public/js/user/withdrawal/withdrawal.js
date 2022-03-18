let submit, cbText;

document.addEventListener("DOMContentLoaded", () => {

    //SUBMIT FORM
    document.querySelector("form#withdraw_form").addEventListener("submit", e => {
        e.preventDefault();
        const obj = {
            amount: e.currentTarget.querySelector("input#amount").value,
            type: e.currentTarget.querySelector("select#type").value
        };

        submit = e.currentTarget.querySelector("button");
        fetchResourse(obj,window.location.href,"POST",undefined)
    })
})