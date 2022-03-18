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
   
    //DELETE Request
    document.querySelector('a#delete-all').addEventListener("click", e => {
        let obj = {
            type: "mark_all",
            data: []

        };
        document.querySelectorAll("input#mark").forEach(m => {
            if (m.parentNode.firstElementChild.checked) {
                
                obj.data.push({
                    id: m.dataset.id
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
                    fetchResourse(obj,`${window.location.origin + window.location.pathname}`,"DELETE","reload") 
                }
            })
        
        

    })
        
    } catch (error) {
        
    };


    try {
        document.querySelectorAll("form#edit-user").forEach(form => {
            form.addEventListener("submit", e => {
                e.preventDefault();
                const obj = {
                    username: e.currentTarget.parentElement.querySelector("input#username").value,
                    fullname: e.currentTarget.parentElement.querySelector("input#fullname").value,
                    email: e.currentTarget.parentElement.querySelector("input#email").value,
                    phone_number: e.currentTarget.parentElement.querySelector("input#phone_number").value,
                    address: e.currentTarget.parentElement.querySelector("input#address").value,
                    city: e.currentTarget.parentElement.querySelector("input#city").value,
                    state: e.currentTarget.parentElement.querySelector("input#state").value,
                    role: e.currentTarget.parentElement.querySelector("select#role").value
                };
                
                const id = e.currentTarget.parentElement.querySelector("input#id").value

                submit = e.currentTarget.parentElement.querySelector("button")
                fetchResourse(filterEmptyObj(obj),`${window.location.origin + window.location.pathname}?id=${id}`,"PUT","reload")
            })
        })


        //DELETE ONE BY ONE
        document.querySelectorAll("a#delete-one").forEach(btn => {
            btn.addEventListener("click", e => {
            
               const id = e.currentTarget.dataset.id
                submit = e.currentTarget;

                swal({
                title: "Are you sure?",
                text: "You cannot recover this once deleted!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then(wilDelete => {
                if (wilDelete) {
                    fetchResourse({},`${window.location.origin + window.location.pathname}?id=${id}`,"DELETE","reload") 
                }
            })
                
            })
        })

    } catch (error) {
        console.log(error)
    }

    try {
        
        //Search Member
        document.querySelector("form.search-member").addEventListener("submit", e => {
            e.preventDefault();
            const search = e.currentTarget.querySelector("input").value;
            

            if (!search) {
                return
            }

            window.location.href = `/admin/moderators?search=${search}` 
        });

        document.querySelector("a.reset").addEventListener("click", e => {
            window.location.href = `/admin/moderators`
        })
    } catch (error) {
        
    }

    //CREATE NEW MOD
    try {
        
        document.querySelector("form#new").addEventListener("submit", e => {
                e.preventDefault();
                const obj = {
                    username: e.currentTarget.querySelector("input#username").value,
                    password: e.currentTarget.querySelector("input#password").value,
                    fullname: e.currentTarget.querySelector("input#fullname").value,
                    email: e.currentTarget.querySelector("input#email").value,
                    phone_number: e.currentTarget.querySelector("input#phone_number").value,
                    address: e.currentTarget.querySelector("input#address").value,
                    city: e.currentTarget.querySelector("input#city").value,
                    state: e.currentTarget.querySelector("input#state").value,
                    role: e.currentTarget.querySelector("select#role").value
                };
            
                submit = e.currentTarget.parentElement.querySelector("button")
                fetchResourse(filterEmptyObj(obj),`${window.location.origin + window.location.pathname}`,"POST","reload")
            })


        
    } catch (error) {
        console.log(error)
    }

})


