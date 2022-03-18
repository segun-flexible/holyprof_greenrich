document.addEventListener("DOMContentLoaded", () => {
    window.allowApprove = function (price, name, link) {
        
        swal({
                title: `You are about to purchase ${name} plan`,
                text: `And failure to make a payment of ${price} to your merged will lead to locking of your account!`,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then(yes => {
                if (yes) {
                    window.location.href = link
                }
            })
        

    }
})