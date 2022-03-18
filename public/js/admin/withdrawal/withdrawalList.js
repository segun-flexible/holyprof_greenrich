let submit, cbText;

document.addEventListener("DOMContentLoaded", () => {
    
    try {
        //Mark One Mark All
    document.querySelector("input#mark-head").addEventListener("change", e => {
        document.querySelectorAll("input#mark").forEach(m => {
            m.checked = e.currentTarget.checked
        })
    });
    } catch (error) {
        console.log(error)
    }


    try {
    //Mark Request
    document.querySelector('a#approved-marked').addEventListener("click", e => {
        let obj = {
            type: "mark_all",
            data: []

        };
        document.querySelectorAll("input#mark").forEach(m => {
            if (m.parentNode.firstElementChild.checked) {
                
                obj.data.push({
                    withdrawalId: m.dataset.withdrawal_id
                });
            }
        });

        
        submit = document.querySelector("a#approved-marked")
        fetchResourse(obj,"/admin/withdrawal/approved","PUT","reload") 

    })
        
    //DELETE Request
    document.querySelector('a#delete-all').addEventListener("click", e => {
        let obj = {
            type: "mark_all",
            data: []

        };
        document.querySelectorAll("input#mark").forEach(m => {
            if (m.parentNode.firstElementChild.checked) {
                
                obj.data.push({
                    id: m.dataset.withdrawal_id
                });
            }
        });
        
        submit = document.querySelector("a#delete-all")
        swal({
                title: "Are you sure?",
                text: "You cannot recover this once deleted!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then(wilDelete => {
                if (wilDelete) {
                    fetchResourse(obj,"/admin/withdrawal/delete","DELETE","reload") 
                }
            })
        
        

    })
        
    } catch (error) {
        
    };

    
    //APPROVE WITHDRAWAL
    window.approvePayment = function (withdrawalId, btn) {
        
        submit = btn;
        
        swal({
                title: "Are you sure you want to approve this withdrawal?",
                text: "You cannot revert this once done!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then(wilDelete => {
                if (wilDelete) {
                    fetchResourse({withdrawalId},"/admin/withdrawal/approved","PUT","reload") 
                }
            })
        
    }
    
    //DECLINE WITHDRAWAL
    window.declinePayment = function (withdrawalId, btn) {
        
        submit = btn;

        swal({
                title: "Are you sure?",
                text: "You cannot recover this once deleted!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then(wilDelete => {
                if (wilDelete) {
                    fetchResourse({id:withdrawalId},"/admin/withdrawal/delete","DELETE","reload") 
                }
            })
        
    }




    window.fetchSender = function (senderId,type,btn) {
        
       
        submit = btn;
        loadingState(submit, true);
        
        fetch("/admin/get-merge-user/send", {
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


    try {
        document.querySelector("form#search").addEventListener("submit", e => {
            e.preventDefault();
            const value = e.currentTarget.querySelector("input").value;

            if (value) {
                window.location.href = `${location.origin + location.pathname}?trans=${value}`
            }
        })
    } catch (error) {
        
    }

    
})