
let submit, cbText;

document.addEventListener("DOMContentLoaded", () => {
    

    document.querySelector("form#contact").addEventListener("submit", e => {
        e.preventDefault();

        const obj = {
            message: e.currentTarget.querySelector("textarea#message").value,
            name: e.currentTarget.querySelector("input#name").value,
            email: e.currentTarget.querySelector("input#email").value,
            subject: e.currentTarget.querySelector("input#subject").value
        }

        if (Object.values(obj).some(i => i === "")) {
            swal({
                title: "Some Fields Cannot Be Empty",
                icon: "error"
            })
        } else {
            
            submit = e.currentTarget.querySelector("button");
            fetchResourse(obj, window.location.href, "POST")
            
        }
    })



    function fetchResourse(body, url, method) {
        loadingState(submit,true)
        fetch(url, {
                    method,
                    credentials: "include",
                    mode: "cors",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(body)
                })
                    .then(res => res.json())
                    .then(res => {
                        loadingState(submit,false)
                        if (res.status) {
                            swal({
                            title: res.message,
                            icon:"success"
                    }).then(()=>window.location.reload())
                        } else {
                            swal({
                            title: res.message,
                            icon:"error"
                    })
                        }
                    }).catch(err => {
                        loadingState(submit,false)
                    swal({
                            title: err.message,
                            icon:"error"
                    })
                    })
    }

    function loadingState(element,state) {
        if (state) {
            cbText = element.textContent;
            element.innerHTML = `Sending....`;
            element.disabled = state
        } else {
            element.innerHTML = cbText;
            element.disabled = state
        }
    }

})