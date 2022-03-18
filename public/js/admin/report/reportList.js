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
                    reportId: m.dataset.report_id
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
                    fetchResourse(obj,window.location.href,"DELETE","reload") 
                }
            })
        
        

    })
        
    } catch (error) {
        
    };


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


    try {
        
        document.querySelector("select#type").addEventListener("change", e => {
        const value = e.target.value;
        
        if (value) window.location.href = `/admin/report/history?status=${value}`
        });
        
    } catch (error) {
        
    }


   
})