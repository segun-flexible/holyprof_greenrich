let submit, cbText;

document.addEventListener("DOMContentLoaded", () => {

    //PROFILE
    document.querySelector("form#basic-settings").addEventListener("submit", e => {
        e.preventDefault();
        const obj = {
            fullname: e.currentTarget.querySelector("input#fullname").value,
            address: e.currentTarget.querySelector("input#address").value,
            city: e.currentTarget.querySelector("input#city").value,
            state: e.currentTarget.querySelector("input#state").value

        };


        submit = e.currentTarget.querySelector("button");
        fetchResourse(obj, window.location.href, "POST", "reload")
    });

    //AVATAR
    document.querySelector("form#avatar-form").addEventListener("submit", e => {
        e.preventDefault();

        const obj3 = new FormData();
        obj3.append("avatar", e.currentTarget.querySelector("input#avatar").files[0])
        
        submit = e.currentTarget.querySelector("button");
        loadingState(submit,true)
        fetch(`${window.location.href}` , {
                    method:"POST",
                    credentials: "include",
                    mode: "cors",
                    body: obj3
                })
            .then(res => res.json())
            .then(res => {
                if (res) {
                    return swal({
                        title: res.message,
                        icon:"success"
                    }).then(res => window.location.reload())
                } else {
                    
                    return swal({
                        title: res.message,
                        icon:"error"
                    })

                }
            }).catch(err => {
                
                return swal({
                        title: err.message,
                        icon:"error"
                    })

            })
        
    })
})