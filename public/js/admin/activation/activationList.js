let submit, cbText;

document.addEventListener("DOMContentLoaded", () => {
    
   //Search Member
        document.querySelector("form#trans").addEventListener("submit", e => {
            e.preventDefault();
            const search = e.currentTarget.querySelector("input").value;

            if (!search) {
                return
            }

            window.location.href = `${window.location.origin + window.location.pathname}?trans=${search}`
        });

        document.querySelector("a.reset").addEventListener("click", e => {
            window.location.href = `${window.location.origin + window.location.pathname}`
        })
    

    try {
        document.querySelector("input#mark-head").addEventListener("change", e => {
        document.querySelectorAll("input#mark").forEach(m => {
            m.checked = e.currentTarget.checked
        })
    });
    } catch (error) {
        
    }


    //APPROVE ALL
    try {
        
        document.querySelector('a#approved-marked').addEventListener("click", e => {
        let obj = {
            type: "mark_all",
            data: []

        };
        document.querySelectorAll("input#mark").forEach(m => {
            if (m.parentNode.firstElementChild.checked) {
                
                obj.data.push({
                    id: m.dataset.id,
                    userId: m.dataset.user_id,
                    amount: m.dataset.amount,
                    proof: m.dataset.proof,
                    email: m.dataset.email,
                });
            }
        });

        
        submit = document.querySelector("a#approved-marked")
        swal({
                title: "Are you sure?",
                text: "You cannot undo this action!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then(proceed => {
                if (proceed) {
                    fetchResourse(obj,`${window.location.origin + window.location.pathname}`,"PUT","reload") 
                }
            })
        
        

        })
        
    } catch (error) {
        
    }
    
    //APPROVE ONE
    try {
        
        document.querySelectorAll('a.approvedbtn').forEach(btn => {
        btn.addEventListener("click", b => {
            const obj = {
                id: b.currentTarget.dataset.id,
                userId: b.currentTarget.dataset.user_id,
                amount: b.currentTarget.dataset.amount,
                proof: b.currentTarget.dataset.proof,
                email: b.currentTarget.dataset.email,
            };

            submit = btn
        swal({
                title: "Are you sure?",
                text: "You cannot undo this action!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then(proceed => {
                if (proceed) {
                    fetchResourse(obj,`${window.location.origin + window.location.pathname}`,"PUT","reload") 
                }
            })

        })
        })
        
    } catch (error) {
        
    }

        

    //DELETE ALL
    try {
        
        document.querySelector('a#delete-marked').addEventListener("click", e => {
        let obj = {
            type: "mark_all",
            data: []

        };
        document.querySelectorAll("input#mark").forEach(m => {
            if (m.parentNode.firstElementChild.checked) {
                
                obj.data.push({
                    id: m.dataset.id,
                    userId: m.dataset.user_id,
                    amount: m.dataset.amount,
                    proof: m.dataset.proof
                });
            }
        });

        
        submit = document.querySelector("a#delete-marked")
        swal({
            title: "Are you sure?",
            text: "You cannot recover this once deleted!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(proceed => {
            if (proceed) {
                fetchResourse(obj, `${window.location.origin + window.location.pathname}`, "DELETE", "reload")
            }
        })
        
        

        });
        
    } catch (error) {
        
    }

    //DELETE ONE
    try {

       document.querySelectorAll('a#delete-one-btn').forEach(btn => {
        btn.addEventListener("click", b => {
            const obj = {
                id: b.currentTarget.dataset.id,
                userId: b.currentTarget.dataset.user_id,
                amount: b.currentTarget.dataset.amount,
                proof: b.currentTarget.dataset.proof
            };

            submit = document.querySelector('a#delete-one-btn')
        swal({
                title: "Are you sure?",
                text: "You cannot recover this once deleted!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then(proceed => {
                if (proceed) {
                    fetchResourse(obj,`${window.location.origin + window.location.pathname}`,"DELETE","reload") 
                }
            })

        })
       })
        
    } catch (error) {
        
    }


})