let submit, cbText;

document.addEventListener("DOMContentLoaded", () => {

    document.querySelector("select#filterbyStatus").addEventListener("change", e => {
        const value = e.target.value;
        
        if (value) window.location.href = `/user/report/history?status=${value}`
    });

    
    window.deleteReport = function (reportId, btn) {
        const obj = {
            reportId
        };
        submit = btn;

        swal({
                title: "Are you sure?",
                text: "You cannot revert this once deleted!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then(yes => {
                if (yes) {
                    fetchResourse(obj,window.location.href,"DELETE","reload")
                }
            })
        
        
    }

    
})