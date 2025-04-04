 

 

 
// get element
let postsEl = document.getElementById("posts");
let userNameEl = document.getElementById("userName-input");
let passwordEl = document.getElementById("password-input");
let modalEl = document.getElementById("login_modal");
let regiserModalEl = document.getElementById("register_modal");
let CreatePostModalEl = document.getElementById("create-post_modal");
let DeletePostModalEl = document.getElementById("deleteModal");
let loginDivEl = document.getElementById("logged-in-div");
let logoutDivEl = document.getElementById("logout-div");
const addBtn = document.getElementById("add-btn");



 


/* ==================== INFINITE SCROLL ============= */

let currentPage = 1;  
let lastPage = 1; 
let isLoading = false;  

window.addEventListener("scroll", function () {
    const endOfPage = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;

    // note:  you can use scrollHeight insted of offsetHeight and change what is requierd
    
    if (endOfPage && currentPage < lastPage && !isLoading) {
        isLoading = true;  
        currentPage++;  
        getPostsData(false, currentPage).finally(() => {
            isLoading = false;  
        });
    }
});

/*// ==================== INFINITE SCROLL ============= //*/


setupUI()
 
/* start buttons */
function loginBtnClicked(){
     
    const userName = userNameEl.value;
    const password = passwordEl.value;
    console.log(userName)
    console.log(password)

     
    loginReq(userName, password);
}
function registerBtnClicked() {
    const registerName = document.getElementById("register-Name-input").value;
    const registerUsrerName = document.getElementById("register-userName-input").value;
    const registerPassword = document.getElementById("register-password-input").value;
    const progileImage = document.getElementById("profile-image-input").files[0];

    registerReq(registerName, registerUsrerName, registerPassword,progileImage);
}

function createANewPostClicked() {
    let postId = document.getElementById("post-id-input").value;
    let isCreate = postId == null || postId == "";
    console.log(isCreate)
    

    
    const title = document.getElementById("post-title-input").value;
    const body = document.getElementById("post-body-input").value;
    const image = document.getElementById("post-image-input").files[0];
    
    if (isCreate) {
        createPostReq(title, body,image); 
    } else {
    
        updatePostReq(title, body, postId);
    }

}

let postIdToDelete = 0;
function deleteBtnClicked(postid) {
    postIdToDelete = postid;
}
function deletPostNow( ) {
    deletePostReq(postIdToDelete)
}

function showuserProfile(userId) {
    window.location = `./profile.html?userId=${userId}`;

}
 

/* end buttons */
 

/* start requests */
function getPostsData(reload=true, page = 1) {
    toggleLoder(true);
   return axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=5&page=${page}`)
       .then((response) => {
        let posts = response.data.data
        console.log(posts)
           
        lastPage = response.data.meta.last_page;
        
        //remove the posts from the page
        if (reload) {
            postsEl.innerHTML = "";
           }
           
        let user = getCurrentUser();
        let editBtnContent;
        let deleteBtnContent;
        
        // adding the posts
        for (let post of posts) {
    
            // show or hide edit button
            let isMyPost = user != null && post.author.id == user.id;

            isMyPost ? editBtnContent = `<button onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')" class="btn btn-secondary" style="float: right; margin-right:4px ; ">Edit</button>` : editBtnContent = "";
            isMyPost ? deleteBtnContent = `<button class="btn btn-danger" onclick="deleteBtnClicked(${post.id})"  data-bs-toggle="modal" data-bs-target="#deleteModal"style="float: right;  ">Delete</button>` : deleteBtnContent = "";
            
            let content = `
                
        <!-- post -->
            <div class=" d-flex justify-content-center mt-3" >
            <div class="card col-9 shadow my-3">
                <div class="card-header ">
                    <span  onclick="showuserProfile(${post.author.id})" style="cursor: pointer; ">
                    <img src="${typeof post.author.profile_image !== 'string' ? "./img/profile-pic/grayUser.png" : post.author.profile_image}" alt="progileImge" class="rounded-circle border border-3" style="width: 40px; height: 40px;  ">
                    <b style="font-size: 14px;">${post.author.email == null ? "" : post.author.email}</b> 
                    </span>
                    ${deleteBtnContent}
                    ${editBtnContent}
                    
                </div>

                <div onclick="postClicked(${post.id})" class="card-body" style="cursor: pointer;">
                    <img class="w-100" src="${typeof post.image !== 'string' ? "./img/post-pic/NoPic.jpg":  post.image}" alt="postImg" style="border-radius: 3px;">
                    <h6 class="pt-1" style="color: rgb(169, 162, 162);">${post.created_at}</h6>
                    <h5>${post.title == null ? "":post.title}</h5>
                    <p>${post.body}</p>
                    <hr>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                            </svg>
                        <span>
                        (${post.comments_count}) comment 
                        <span id="post-tags-${post.id}">   </span> 
                        </span>
                    </div>
                    
                    
                </div>
                </div>
            </div>
        <!-- //post// -->
`
            postsEl.innerHTML += content;  
            // add tags for the one post
            document.getElementById(`post-tags-${post.id}`).innerHTML = "";
            for (tag of post.tags) {
                let tagsContent =
                    `
                    <button class="btn btn-sm rounded-5" style="background-color :gray;color:white;">${tag.name}
                    </button>
                `;
            document.getElementById(`post-tags-${post.id}`).innerHTML += tagsContent;



                
            }
                

            

           }
           
         toggleLoder(false);


    })
}

function loginReq(username, password) {
    localStorage.clear()

    toggleLoder( true);

    axios.post("https://tarmeezacademy.com/api/v1/login", {
        "username": username,
        "password": password,

    }).then((response) => {
         
        localStorage.setItem("usertoken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        //when the login is done the modal is hide
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        modalInstance.hide()
        showAlert("loged in sucssfuly","success")
        setupUI();
        location.reload();
         
    }).catch((error => {
        showAlert(error.response.data.message, "danger");


    })).finally(() => {
        toggleLoder(false);
        
    })
}
function registerReq(name, username, password, progileImage) {
    toggleLoder(true);

    // prepar the data
    let formData =  new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("image", progileImage);

    // send the data
    axios.post("https://tarmeezacademy.com/api/v1/register", formData)
        .then((response) => {

        console.log(response.data);
        // save token    
        localStorage.setItem("usertoken", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))
            

        //when the login is done the modal is hide
        const modalInstance = bootstrap.Modal.getInstance(regiserModalEl);
        modalInstance.hide();
        showAlert("new user regiser sucssfuly","success");
        setupUI();
        location.reload();
         toggleLoder(false);
            
    
    }).catch((error) => {
        console.log(error.response.data.message);
        showAlert(error.response.data.message, "danger");
        const modalInstance = bootstrap.Modal.getInstance(regiserModalEl);
        modalInstance.hide();

    })
}
function createPostReq(title, body ,img) {

    toggleLoder(true);

    // prepar the data
    const header = {
        headers: {
            "authorization": `Bearer ${localStorage.getItem("usertoken")}`,
            "Content-Type":"multipart/form-data",
            
        }
    }
    let formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    formData.append("image", img);

    // send data
    axios.post("https://tarmeezacademy.com/api/v1/posts", formData, header)
        .then((response) => {
            showAlert("you just created a new post", "success");
            const modalInstance = bootstrap.Modal.getInstance(CreatePostModalEl);
            modalInstance.hide();
            getPostsData();
            toggleLoder(false);

       
        }).catch((error) => {
            showAlert(error.response.data.message, "danger");
            toggleLoder(false);

            
        });
}
        
function updatePostReq(title, body, postId) {
    toggleLoder(true);

    // prepar the data
     const header = {
            headers: {
                "authorization": `Bearer ${localStorage.getItem("usertoken")}`,
                 
            }
    }
    const params = {
        "body": body,
        "title": title
    }

     // send data
     axios.put(`https://tarmeezacademy.com/api/v1/posts/${postId}`, params, header)
     .then((response) => {
         showAlert("you edit post", "success");
         const modalInstance = bootstrap.Modal.getInstance(CreatePostModalEl);
         modalInstance.hide();
         if (window.location.pathname.endsWith("index.html")) {
            console.log("home page")
            
            getPostsData()
    
        } else {
            console.log("profile page")
            location.reload();
         }
         toggleLoder(false);
         
    
     }).catch((error) => {
         console.log(error)
         showAlert(error.response.data.error_message, "danger");
         toggleLoder(false);

         
     });
    
    
};

function deletePostReq(postId) {
    toggleLoder(true);

    // prepar the data
    const header = {
        headers: {
            "authorization": `Bearer ${localStorage.getItem("usertoken")}`,
             
        }
    }

    
         // send data
         axios.delete(`https://tarmeezacademy.com/api/v1/posts/${postId}` , header)
         .then((response) => {
             showAlert("you just deleted a post", "success");
             const modalInstance = bootstrap.Modal.getInstance(DeletePostModalEl);
             modalInstance.hide();
                        
             if (window.location.pathname.endsWith("index.html")) {
                console.log("home page")
                
                getPostsData()

            } else {
                console.log("profile page")
                location.reload();
             }
             toggleLoder(false);
             
           
               
        
         }).catch((error) => {
             console.log(error)
             showAlert(error.response.data.error_message, "danger");
         toggleLoder(false);

             
         });
}
/* end requests */



/* start ui */
function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("usertoken");
    setupUI();
    showAlert("log out sucssfuly", "success");
    location.reload();
    

}

function showAlert(CustomMessage,customType ) {
    const alertPlaceholder = document.getElementById('success-alert')
    
    const appendAlert = (message, type) => {

        const wrapper = document.createElement('div');
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('');

        alertPlaceholder.append(wrapper);

}
 
 
    appendAlert(CustomMessage, customType);

    // todo: hide alert
    setTimeout(() => {
        const alert = bootstrap.Alert.getOrCreateInstance('#success-alert');
        /*  alert.close(); */

        
    },2000)
 
}

function setupUI() {
    const token = localStorage.getItem("usertoken");
    const commentInputEl = document.getElementById("comment-input");

    if(token == null)// user is guest (not logged in)
    {   
        if (addBtn != null) { // bec. this file is shared with onther html file that has not has add button
        addBtn.style.setProperty("display", "none", "important");
        }

        loginDivEl.style.setProperty("display", "flex","important");
        logoutDivEl.style.setProperty("display", "none", "important");
        

    } else { // for logged in user
           if (addBtn != null) { // bec. this file is shared with onther html file that has not has add button
        addBtn.style.setProperty("display", "block", "important");
        }
        loginDivEl.style.setProperty("display", "none","important");
        logoutDivEl.style.setProperty("display", "flex", "important");

        // showing the profile image + user name in navbar
        document.getElementById("nav-username").innerText = getCurrentUser().username;
        document.getElementById("nav-user-image").src = getCurrentUser().profile_image;
 


    }
}
/* end ui */
 
function getCurrentUser() {
    let user = null;
    const storageUser = localStorage.getItem("user");
    storageUser == null ? user : user = JSON.parse(storageUser);
    return user;
}


function postClicked(postId) {
    window.location = `postDetails.html?postId=${postId}`;
     
}
function editPostBtnClicked(postObj){

    //get the post data
    let post = JSON.parse(decodeURIComponent(postObj))
    document.getElementById("post-id-input").value = post.id;
    
    document.getElementById("modal-title").innerHTML = "Edit Post:";
    document.getElementById("post-title-input").value = post.title;
    document.getElementById("post-body-input").value = post.body;
    document.getElementById("CreatePostBtn").innerHTML = "Update";

    var myModal = new bootstrap.Modal(document.getElementById('create-post_modal'));
    myModal.show();
  

}

 console.log(window.location.pathname.endsWith("index.html") + "home here")

 if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
    getPostsData();
}

function printFromMain() {
    console.log("printFromMain")
}

 

function toggleLoder(show = true) {
    if (show) {
        document.getElementById("loader").style.visibility = "visible";
    } else {
    document.getElementById("loader").style.visibility = "hidden";
        
    }

}