document.addEventListener("DOMContentLoaded", () => {
    
    document.querySelector("select#filterbyStatus").addEventListener("change", e => {
        const value = e.target.value;
        
        if (value) window.location.href = `/user/history/withdrawal?status=${value}`
    });


    window.confirmRequest = function (withdrawalId, btn) {
        const obj = {
            withdrawalId
        };
        submit = btn;

        swal({
                title: "Are you sure your merge has send you the money?",
                text: "You cannot revert this once deleted!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then(yes => {
                if (yes) {
                    fetchResourse(obj,window.location.href,"POST","reload")
                }
            })
        
        
    }

    window.viewSender = function (senderId,type,btn) {
        
       
        submit = btn;
        loadingState(submit, true);
        
        fetch("/user/getreciever", {
                method:"POST",
                credentials: "include",
                mode: "cors",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({userId:senderId,type})
                })
            .then(res => res.json())
            .then(res => {
                
                loadingState(submit, false);
                
                if (res && res.username) {
                    
                    document.querySelector("ul#user-modal").innerHTML = `
                

                    <li class="list-group-item dark-bg">FullName: <span
                            class="deposit-amount font-weight-bold text-dark">
                            ${res.fullname}
                        </span></li>
                    
                    <li class="list-group-item dark-bg">Phone Number: <span
                            class="deposit-amount font-weight-bold text-dark">
                            ${res.phone_number}
                        </span></li>
                    
                    `;

                    document.querySelector("a#userModal").click();
                    return
                }else {
                    swal({
                        title: "No User Found",
                        icon:"error"
                    })
                }
            })
        
    }



})