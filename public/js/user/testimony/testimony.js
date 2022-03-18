 let submit, cbText;
document.addEventListener("DOMContentLoaded", () => {

   

    

    try {
        document.querySelector("form#new").addEventListener("submit", e => {
            e.preventDefault();
            const obj = {
                t_message: e.currentTarget.querySelector("textarea").value
            };

            submit = document.querySelector("button#proceed")
            fetchResourse(obj, window.location.origin + window.location.pathname, "POST", "reload",true)
            
        })
    } catch (error) {
        
    }
    
    try {
        document.querySelector("form#edit").addEventListener("submit", e => {
            e.preventDefault();
            const obj = {
                t_message: e.currentTarget.querySelector("textarea").value
            };
            const id = e.currentTarget.dataset.id;

            submit = e.currentTarget.querySelector("button")
            fetchResourse(obj, `${window.location.origin + window.location.pathname}?id=${id}`, "PUT", "reload",true)
            
        })
    } catch (error) {
        
    }


    window.deleteTestimony = function (id, btn) {
        
        swal({
                title: `Are you sure?`,
                text: `Once deleted, you will not be able to recover this testimony!`,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then(yes => {
                if (yes) {
                    submit = btn
                    fetchResourse({},`${window.location.origin + window.location.pathname}?id=${id}`,"DELETE","reload",true)
                }
            })

        
    }
    



})

