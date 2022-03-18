let submit, cbText;

document.addEventListener("DOMContentLoaded", () => {
    
    //Profile Form
    
        document.querySelector("form#profile").addEventListener("submit", e => {
            e.preventDefault();
            const obj = {
                username: e.currentTarget.querySelector("input#username").value,
                fullname: e.currentTarget.querySelector("input#fullname").value,
                email: e.currentTarget.querySelector("input#email").value,
                phone_number: e.currentTarget.querySelector("input#phone").value,
                address: e.currentTarget.querySelector("input#address").value,
                state: e.currentTarget.querySelector("input#state").value,
                city: e.currentTarget.querySelector("input#city").value
            };

        
            submit = e.currentTarget.querySelector("button");
            fetchResourse(obj,window.location.href,"PUT","reload")
        })
    
        //EDIT Wallet
        try {
            document.querySelector("form#wallet").addEventListener("submit", e => {
            e.preventDefault();
            const obj = {
                type: "edit",
                number: e.currentTarget.querySelector("input#number").value,
                bank: e.currentTarget.querySelector("select#bank-list").value
            };

        
            submit = e.currentTarget.querySelector("button");
            fetchResourse(obj,"/admin/settings/profile/wallet","POST","reload")
        });
        } catch (error) {
            
        }
        
        //Create Wallet
        try {
            document.querySelector("form#new-wallet").addEventListener("submit", e => {
            e.preventDefault();
            const obj = {
                type: "new",
                number: e.currentTarget.querySelector("input#number").value,
                bank: e.currentTarget.querySelector("select#bank-list").value
            };

        
            submit = e.currentTarget.querySelector("button");
            fetchResourse(obj,"/admin/settings/profile/wallet","POST","reload")
        });
        } catch (error) {
            
        }
    
        
        document.querySelector("form#password").addEventListener("submit", e => {
            e.preventDefault();
            const obj = {
                password: e.currentTarget.querySelector("input#password").value
            };

            const password2 = e.currentTarget.querySelector("input#password2").value;

            if (obj.password !== password2) {
                swal({title:"New Password Mismatched",icon:"error"})
                return 
            }

        
            submit = e.currentTarget.querySelector("button");
            fetchResourse(obj,window.location.href,"PUT","reload")
        });
    

        document.querySelector("form#avatar").addEventListener("submit", e => {
        e.preventDefault();

        const obj3 = new FormData();
        obj3.append("avatar", e.currentTarget.querySelector("input#avatar").files[0])
        
        submit = e.currentTarget.querySelector("button");
        loadingState(submit,true)
        fetch(`${window.location.href}` , {
                    method:"PUT",
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