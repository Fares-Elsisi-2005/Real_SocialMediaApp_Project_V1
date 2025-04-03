

// return the create post modal to its orginal 
function addBtnClicked() {
    document.getElementById("post-id-input").value =  "";
    document.getElementById("modal-title").innerHTML = "Create Post:";
    document.getElementById("post-title-input").value = "";
    document.getElementById("post-body-input").value = "";
    document.getElementById("post-image-input").files[0] = "";
    document.getElementById("CreatePostBtn").innerHTML = "Create";

}



 
