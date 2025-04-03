
 

// get the post id
const urlParams = new URLSearchParams(window.location.search);
let userID = urlParams.get("userId");
const postsContainerEl = document.querySelector(".AllpostsContainer")
postsContainerEl.innerHTML = "";
if (userID == null) {
    userID = getCurrentUser().id;
}
console.log(userID )
 




function getuserData(userId) {
  axios.get(`https://tarmeezacademy.com/api/v1/users/${userID}`)
.then((response) => {
   
    let user = response.data.data
    console.log(user)
     
    document.getElementById("postsTitle").innerHTML = user.name;
    document.getElementById("header-image").src =user.profile_image;
 
    document.getElementById("user-info-email").innerHTML = user.email;
    document.getElementById("user-info-name").innerHTML = user.name;
    document.getElementById("user-info-userName").innerHTML = user.username;
    document.getElementById("number-info-posts").innerHTML = user.posts_count;
    document.getElementById("number-info-comments").innerHTML = user.comments_count;
 
    
  
    

     

})
}
getuserData()
 
 

function getuserPostsData() {
    
    
    return axios.get(`https://tarmeezacademy.com/api/v1/users/${userID}/posts`)
        .then((response) => {
            let posts = response.data.data
        
            let CurrentUser = getCurrentUser();
            
            let editBtnContent;
            let deleteBtnContent;


            

           
            for (post of posts) {
              

                 // show or hide edit button
                    let isMyPost = CurrentUser != null && post.author.id == CurrentUser.id;

                    isMyPost ? editBtnContent = `<button onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')" class="btn btn-secondary" style="float: right; margin-right:4px ; ">Edit</button>` : editBtnContent = "";
                    isMyPost ? deleteBtnContent = `<button class="btn btn-danger" onclick="deleteBtnClicked(${post.id})"  data-bs-toggle="modal" data-bs-target="#deleteModal"style="float: right;  ">Delete</button>` : deleteBtnContent = "";
                    
                const postContent = `
                
                  <!-- post -->
                <div class=" d-flex justify-content-center mt-3" >
                <div class="card col-9 shadow my-3" >
                    <div class="card-header "  style="cursor: pointer;">
                        <img src="${typeof post.author.profile_image !== 'string' ? "./img/profile-pic/grayUser.png":  post.author.profile_image}" alt="progileImge" class="rounded-circle border border-3" style="width: 40px; height: 40px;  ">
                            <b >${post.author.email == null ? "" : post.author.email}</b>

                        ${deleteBtnContent}

                        ${editBtnContent}
                     </div>

            <div class="card-body"  onclick="postClicked(${post.id})" style="cursor: pointer;">
                <img class="w-100" src="${typeof post.image !== 'string' ? "./img/post-pic/NoPic.jpg":  post.image}" alt="postImg" style="border-radius: 3px;">
                <h6 class="pt-1" style="color: rgb(169, 162, 162);">${post.created_at}</h6>
                <h5>${post.title == null ? "":post.title}</h5>
                <p>${post.body}</p>
                <hr>
                <div >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                      </svg>
                    <span>(${post.comments_count}) comments
                    <span id="post-tags-${post.id}">   </span> 
                    </span>
                </div>
                
              
            </div>
          </div>
     </div>
    <!-- //post// -->
     `
                
                 
                postsContainerEl.innerHTML += postContent;
            }
            
           
          
 
     })
}
 getuserPostsData()
 
 
/* getuserData(userID).then(() => getuserPostsData()); */
 