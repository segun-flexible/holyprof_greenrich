$('#summernote').summernote({
        placeholder: 'Write Here',
        tabsize: 2,
        height: 320,
        toolbar: [
          ['style', ['style']],
          ['font', ['bold', 'underline', 'clear']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['table', ['table']]
        ]
});


let submit, cbText;

document.addEventListener("DOMContentLoaded", () => {
    
    //Submit Form
    document.querySelectorAll("form#settings").forEach(form => {
        form.addEventListener("submit", e => {
            e.preventDefault();
            const obj = {
                website_merging: e.currentTarget.querySelector("select#type").value,
                website_activation_fee_bank_account: e.currentTarget.querySelector("textarea#summernote").value,
                website_activation_fee_price: e.currentTarget.querySelector("input#fee").value
                
                
            };
            
            submit = e.currentTarget.querySelector("button");
            fetchResourse(obj,"/admin/settings/saved","POST","reload")
        })
    })
})