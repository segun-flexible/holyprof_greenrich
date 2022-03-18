$('#summernote').summernote({
        placeholder: 'Write Here',
        tabsize: 2,
        height: 320,
        toolbar: [
          ['style', ['style']],
          ['font', ['bold', 'underline', 'clear']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['table', ['table']],
          ['insert', ['link', 'picture', 'video']],
          ['view', ['fullscreen', 'codeview', 'help']]
        ]
});


let submit, cbText;

document.addEventListener("DOMContentLoaded", () => {
    
    //Slug
    document.querySelectorAll("input#title").forEach(input => {
        input.addEventListener("keyup", press => {
        press.target.parentElement.parentElement.querySelector("input#slug").value = makeSlug(press.target.value)
        });
        
    })
    
    document.querySelectorAll("a.delete-package").forEach(btn => {
        btn.addEventListener("click", e => {
            const id = e.currentTarget.dataset.id;

            submit = e.currentTarget;

            swal({
                title: "Are you sure?",
                text: "You cannot recover this once deleted!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then(wilDelete => {
                if (wilDelete) {
                    fetchResourse({}, `${window.location.href}?id=${id}`, "DELETE", "reload")
                }
            })

            
            
        })
    })
    document.querySelectorAll("form#editPage").forEach(form => {
        form.addEventListener("submit", e => {
            e.preventDefault();
            const obj = {
                page_title: e.currentTarget.parentElement.querySelector("input#title").value,
                page_slug: e.currentTarget.parentElement.querySelector("input#slug").value,
                page_description: e.currentTarget.parentElement.querySelector("textarea#summernote").value,
                page_status: e.currentTarget.parentElement.querySelector("input[type=checkbox]").checked ? 1 : 0
            };

            const id = e.currentTarget.parentElement.querySelector("input#id").value;

            
            submit = e.currentTarget.parentElement.querySelector("button#button");
            fetchResourse(obj,`${window.location.href}?id=${id}`,"PUT","reload")
        });
        
    })

    try {
        document.querySelector("form#newPage").addEventListener("submit", e => {
            e.preventDefault();
            const obj = {
                page_title: e.currentTarget.querySelector("input#title").value,
                page_slug: e.currentTarget.querySelector("input#slug").value,
                page_description: e.currentTarget.querySelector("textarea#summernote").value
            };
            
            submit = e.currentTarget.querySelector("button#button");
            fetchResourse(obj,`${window.location.href}`,"POST","reload")
        });
    } catch (error) {
        
    }



    function makeSlug(text) {
        return text.toLowerCase().replace(/[^A-Za-z0-9 ]/gi," ").trim().split(" ").filter(t => t !== "").join("-")
    }

    function filterEmptyObj(obj) {
    return Object.fromEntries(Object.entries(obj).filter(v => v[1] !== ""));
    }


})