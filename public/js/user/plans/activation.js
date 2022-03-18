let submit, cbText;

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("form#activation").forEach(form => {
        
        form.addEventListener("submit", e => {
        e.preventDefault();
        const obj = {
            fee: e.currentTarget.querySelector("input#fee").dataset.amount || e.currentTarget.querySelector("input#fee").value
        }

        
        const obj2 = new FormData();
        obj2.append("proof", e.currentTarget.querySelector("input#proof").files[0]);

        

        //Insert Post To BK
        submit = e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector("button#send");
            
        loadingState(submit, true)
            
            fetch(`/user/activation`, {
                    method:"POST",
                    credentials: "include",
                    mode: "cors",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(obj)
                })
            .then(res => res.json())
                .then(res => {
                loadingState(submit, false)
                    if (res.status) {
                    
                        if (!(obj2.get("proof") === "undefined")) {
                            
                            fetch(`/user/activation?id=${res.id}`, {
                                method: "POST",
                                credentials: "include",
                                mode: "cors",
                                body: obj2
                            }).then(res => res.json())
                            .then(res =>{
                                if (res.status) {
                                    swal({
                        title: res.message,
                        text: res.text && res.text,
                        icon: "success"
                    }).then(res => window.location.reload())
                                } else {
                                    swal({
                        title: res.message,
                        text: res.text && res.text,
                        icon: "error"
                    })
                                }
                            })
                            
                        } else {
                            swal({
                        title: res.message,
                        text:res.text && res.text,
                        icon: "success"
                    }).then(res => window.location.reload())
                        }
                    } else {
                       swal({
                        title: res.message,
                        text:res.text && res.text,
                        icon: "error"
                       })
                        loadingState(submit, false)
                    }
                })
            
        })
        
    })
})