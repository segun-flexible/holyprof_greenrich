let submit, cbText;

document.addEventListener("DOMContentLoaded", () => {

    document.querySelector("form#search").addEventListener("submit", e => {
        e.preventDefault();
        const value = e.currentTarget.querySelector("input").value;

        window.location.href = `${window.location.origin + window.location.pathname}?trans=${value}`
    })

    document.querySelector("select#type").addEventListener("change", e => {

        if (e.target.value) {
            window.location.href = `/admin/history/merge/${e.target.value}`
        }
    })

    document.querySelector("a#reset").addEventListener("click", e => window.location.href = `${window.location.origin + window.location.pathname}`)
    

    window.fetchSender = function (senderId,btn) {
        
       
        submit = btn;
        loadingState(submit, true);
        
        fetch("/admin/get-merge-user/send", {
                method:"POST",
                credentials: "include",
                mode: "cors",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({userId:senderId})
                })
            .then(res => res.json())
            .then(res => {
                
                loadingState(submit, false);
                
                if (res && res.username) {
                    
                    document.querySelector("ul#user-modal").innerHTML = `
                    
                    <li class="list-group-item dark-bg">
                    <img class="senderAvatar" src="${res.avatar || '/img/avatar.jpg' }"/>
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
                            ${res.role ? 'Admin':"Member"}
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

    window.fetchReciever = function (senderId, type, btn) {
        
       
        submit = btn;
        loadingState(submit, true);
        
        fetch("/admin/get-merge-user/recieve", {
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
                
                if (res && res.username) {
                    
                    document.querySelector("ul#user-modal").innerHTML = `
                    
                    <li class="list-group-item dark-bg">
                    <img class="senderAvatar" src="${res.avatar || '/img/avatar.jpg'}"/>
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

                    document.querySelector("a#userModal").click()
                    return
                } else {
                    swal({
                        title: "No User Found",
                        icon: "error"
                    })
                }
            })
        
    };

    //APPROVE MERGE
    window.approveMerge = function (id, btn) {
        
        submit = btn
        fetchResourse({investmentId:id},window.location.href, "POST", "reload")
        
    }
    
    //DECLINE MERGE
    window.declineMerge = function (id, btn) {
        
        submit = btn
        fetchResourse({id},window.location.href, "DELETE", "reload")
        
    }
})

