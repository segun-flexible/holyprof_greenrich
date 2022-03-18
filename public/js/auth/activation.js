let submit, cbText;

document.addEventListener("DOMContentLoaded", () => {

    //SUBMIT FORM
    document.querySelector("form#activation").addEventListener("submit", async e => {
        e.preventDefault();
        
        const obj = new FormData();
        obj.append("activation", e.currentTarget.querySelector("input#activation").files[0]);

        if (obj.get("activation") === "undefined") return;


        submit = e.currentTarget.querySelector("button");
        await newFetchResourse(obj, "/user/activation", "POST", "noload", false);
    })
})