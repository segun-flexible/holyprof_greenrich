let submit, cbText;

document.addEventListener("DOMContentLoaded", () => {

    //SUBMIT FORM
    document.querySelector("form#new-wallet").addEventListener("submit", e => {
        e.preventDefault();
        const obj = {
            number: e.currentTarget.querySelector("input#number").value,
            bank: e.currentTarget.querySelector("select#bank").value,
            type:"new"
        };


        submit = e.currentTarget.querySelector("button");
        fetchResourse(obj,window.location.href,"POST","reload")
    })
})