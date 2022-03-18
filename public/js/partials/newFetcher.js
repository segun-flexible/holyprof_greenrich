function newFetchResourse(body, url, method,goto,jsonMode) {
        
    return new Promise((resolve, reject) => {
        const options = {
            method,
            credentials: "include",
            mode: "cors",
            headers: {
                [jsonMode && "content-type"]: "application/json",
            }
        };

        if (jsonMode) {
            
            if (method.toLowerCase() !== "get") options.body = JSON.stringify(body);
            
        } else {
           options.body = body; 
        }
        

        loadingState(submit,true)
        fetch(url, options)
                    .then(res => res.json())
                    .then(res => {
                        let redirectUrl = res.goto;

                        loadingState(submit,false)
                        if (res.status) {

                            //First Check 
                            if (goto === "nothing") return resolve(res);
                            
                             swal({
                            title: res.message,
                            text: res.text || "",
                            icon:"success"
                            }).then(() => {
                               
                                if (goto === "noload") {
                            return resolve(res)
                                } else if (goto === "reload") {
                                    window.location.reload()
                                }  else {
                                   window.location.href = redirectUrl
                                }
                    })
                        } else {
                             swal({
                            title: res.message,
                            text: res.text && res.text,
                            icon:"error"
                            }).then(()=> resolve(res))
                        }
                    }).catch(err => {
                        loadingState(submit,false)
                     swal({
                            title: "Something Went Wrong",
                            text: err.message,
                            icon:"error"
                            }).then(()=> reject(err))
                    })
        
    })
}

function loadingState(element, state) {
        if (state) {
            cbText = element.textContent;
            element.innerHTML = `<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>`;
            element.disabled = state
        } else {
            element.innerHTML = cbText;
            element.disabled = state
        }
}
  
function filterEmptyObj(obj) {
    return Object.fromEntries(Object.entries(obj).filter(v => v[1] !== ""));
    }