let submit, cbText;

$('#summernote').summernote({
        placeholder: 'Write Here',
        tabsize: 2,
        height: 320,
        toolbar: [
          ['font', ['bold', 'underline', 'clear']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['insert', ['picture']]
        ]
});

document.addEventListener("DOMContentLoaded", () => {

    //SUBMIT FORM
    document.querySelector("form#report").addEventListener("submit", e => {
        e.preventDefault();
        const obj = {
            message: e.currentTarget.querySelector("textarea#summernote").value
        };

        submit = e.currentTarget.querySelector("button");
        fetchResourse(obj,window.location.href,"POST",undefined)
    })
})