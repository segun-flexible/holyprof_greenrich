let submit, cbText;

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("form#uploadproof").addEventListener("submit", e => {
        e.preventDefault();
        const obj = {
            token: e.currentTarget.querySelector("input#token").value
        }

      

        
        const obj2 = new FormData();
        obj2.append("proof", e.currentTarget.querySelector("input#customFileLang").files[0]);

        

        submit = e.currentTarget.querySelector("button#send");
            
        loadingState(submit, true)
            
            fetch(window.location.href, {
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
                            
                            fetch(`${window.location.origin + window.location.pathname}?invId=${res.invId}&withId=${res.withdrawalId}`, {
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
                    }).then(res => window.location.href = "/user/history/investment")
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
                    }).then(res => window.location.href = "/user/history/investment")
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