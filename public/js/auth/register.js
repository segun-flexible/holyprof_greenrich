let submit, cbText;

document.addEventListener("DOMContentLoaded", () => {
    
    //Upline Searcher
    document.querySelector("input#upline").addEventListener("change", e => {
        if(!e.target.value){
            return
        };

        const upline = document.querySelector("input#upline");

        fetch(`/register/search?upline=${e.target.value}`, {
            method: "GET",
            credentials: "include",
            mode: "cors",
            headers: {
                "content-type": "application/json"
            }
        })
            .then(res => res.json())
            .then(res => {
                if (!res.status) {
                    swal({
                        title: "Upline not found",
                        text:"Maybe you misspelt the username!",
                        icon: "error"
                    });
                    return upline.value = ""
                } else {
                    swal({
                        title: "Upline was found",
                        icon: "success"
                    });

                    return upline.value = res.upline.toLocaleUpperCase()
                }
            })
        
    });

    //SUBMIT FORM
    document.querySelector("form#register").addEventListener("submit", e => {
        e.preventDefault();
        const obj = {
            username: e.currentTarget.querySelector("input#username").value,
            fullname: e.currentTarget.querySelector("input#fullname").value,
            email: e.currentTarget.querySelector("input#email").value,
            phone_number: e.currentTarget.querySelector("input#phone_number").value,
            password: e.currentTarget.querySelector("input#password1").value,
            upline: e.currentTarget.querySelector("input#upline").value
        };

        const password2 = e.currentTarget.querySelector("input#password2").value;

        //Check Password
        if (obj.password !== password2) {
            swal({
                title: "Password Not Matched",
                icon: "error"
            });
            return
        };
        
        if (!(obj.password.length >= 6)) {
            swal({
                title: "Password Must Be 6 Character Or More",
                icon: "error"
            });
            return
        };
        
        if (obj.phone_number.length !== 11) {
            swal({
                title: "Phone Number is invalid",
                icon: "error"
            });
            return 
        };
        
        submit = e.currentTarget.querySelector("button");
        fetchResourse(obj,window.location.href,"POST","/login")
    })
})