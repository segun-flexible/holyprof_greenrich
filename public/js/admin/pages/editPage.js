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
    
    
    document.querySelector("form").addEventListener("submit", e => {
            e.preventDefault();
            const obj = {
                page_title: e.currentTarget.querySelector("input#title").value,
                page_slug: e.currentTarget.querySelector("input#slug").value,
                page_description: e.currentTarget.querySelector("textarea#summernote").value,
                page_status: document.querySelector("input#checkme").checked ? 1 : 0
            };

        
            const id = e.currentTarget.querySelector("input#id").value;

            
            submit = e.currentTarget.querySelector("button#button");
            fetchResourse(filterEmptyObj(obj),`/admin/pages?id=${id}`,"PUT","reload")
        });
    



    function makeSlug(text) {
        return text.toLowerCase().replace(/[^A-Za-z0-9 ]/gi," ").trim().split(" ").filter(t => t !== "").join("-")
    }

    function filterEmptyObj(obj) {
    return Object.fromEntries(Object.entries(obj).filter(v => v[1] !== ""));
    }


})