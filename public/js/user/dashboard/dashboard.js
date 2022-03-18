document.addEventListener("DOMContentLoaded", () => {
    
    
    window.viewReciever = function (senderId, type, btn) {
        
       
        submit = btn;
        loadingState(submit, true);
        
        fetch("/user/getreciever", {
            method: "POST",
            credentials: "include",
            mode: "cors",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ userId: senderId, type })
        })
            .then(res => res.json())
            .then(res => {
                
                loadingState(submit, false);
                
                if (res) {
                    
                    document.querySelector("ul#user-modal").innerHTML = `
                    
                    <li class="list-group-item dark-bg">
                    <img style="width: 100%;" class="senderAvatar" src="${res.avatar || '/img/avatar.jpg'}"/>
                    </li>

                    <li class="list-group-item dark-bg">FullName: <span
                            class="deposit-amount font-weight-bold text-dark">
                            ${res.fullname}
                        </span></li>
                    <li class="list-group-item dark-bg">Username: <span
                            class="deposit-amount font-weight-bold text-dark">
                            ${res.username}
                        </span></li>
                    <li class="list-group-item dark-bg">Email: <span
                            class="deposit-amount font-weight-bold text-dark">
                            ${res.email}
                        </span></li>
                    <li class="list-group-item dark-bg">Phone Number: <span
                            class="deposit-amount font-weight-bold text-dark">
                            ${res.phone_number}
                        </span></li>
                    <li class="list-group-item dark-bg">Role: <span
                            class="deposit-amount font-weight-bold text-dark">
                            ${res.role ? 'Admin' : "Member"}
                        </span></li>
                    `;

                    document.querySelector("a#userModal").click();
                    return
                } else {
                    swal({
                        title: "No User Found",
                        icon: "error"
                    })
                }
            })
        
    };


    document.querySelector("form.referral").addEventListener("submit", e => {
        e.preventDefault()
        const input = e.currentTarget.querySelector("input");
        input.select();
        document.execCommand("copy");
        input.blur()

        swal({
            title: "Referral Link Copied",
            icon: "success"
        });

        
    })


})