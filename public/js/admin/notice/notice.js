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
    
    //NEW NOTICE
    try {
       document.querySelector("form#new").addEventListener("submit", e => {
            e.preventDefault();
            const obj = {
                notice_title: e.currentTarget.querySelector("input#title").value,
                notice_body: e.currentTarget.querySelector("textarea#summernote").value
            };

            submit = e.currentTarget.querySelector("button");
            fetchResourse(obj,window.location.href,"POST","reload")
       })
        
    } catch (error) {
        
    }
    
    //NEW NOTICE
    try {
       document.querySelector("form#edit").addEventListener("submit", e => {
            e.preventDefault();
            const obj = {
                notice_title: e.currentTarget.querySelector("input#title").value,
                notice_body: e.currentTarget.querySelector("textarea#summernote").value,
                notice_status: e.currentTarget.querySelector("input#Visibility").checked ? 1 : 0
            };


            submit = e.currentTarget.querySelector("button.btn.btn-primary.waves-effect.waves-light");
            fetchResourse(obj,window.location.href,"PUT","reload")
       })
        
    } catch (error) {
        
    }
})