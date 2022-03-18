let submit, cbText;

document.addEventListener("DOMContentLoaded", () => {

    //PROFILE
    document.querySelector("form#security").addEventListener("submit", e => {
        e.preventDefault();
        const obj = {
            password: e.currentTarget.querySelector("input#password").value,
            oldPassword: e.currentTarget.querySelector("input#old").value
        };

        
        const password2 = e.currentTarget.querySelector("input#password2").value
        
        if (obj.password !== password2) {
            return swal({
                title: "New Password Mismatched",
                icon: "error"
            })
        }


        submit = e.currentTarget.querySelector("button");
        fetchResourse(obj, window.location.href, "POST", "reload")
    });

})