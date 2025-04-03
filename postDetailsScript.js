let specificPostEl = document.getElementById("specificPost");

// get the post id
const urlParams = new URLSearchParams(window.location.search);
const ID =urlParams.get("postId");


function getspecficPostData(PostID) {
    
    return axios.get(`https://tarmeezacademy.com/api/v1/posts/${PostID}`)
         .then((response) => {
            
             let post = response.data.data;
              

             let commentsContent = ``;
             for(comment of post.comments){
                commentsContent += `
                 
                     <!-- comment -->
                 <div class="p-2 mb-1" style="background-color: rgb(199, 201, 201);">
                    <!-- profileImage + username -->
                    <div>
                         <img src="${typeof comment.author.profile_image !== 'string' ? "./img/profile-pic/grayUser.png":  comment.author.profile_image}" class="rounded-circle" style="height: 30px; width: 30px;" alt="profile">
                         <b>${comment.author.email == null ? "":comment.author.email}</b>
                     </div>
                    <!--// profileImage + username //-->
 
                    <!-- comments body -->
                     <div> ${comment.body}</div>
                    <!-- //comments body// -->
                  </div>
                 <!-- ///comment// -->
                `

             }

             const content = `
             <!-- user -->
         <div class="  raw d-flex justify-content-center  mt-3">
             <div class="col-9">
            <h1><span>${post.author.name} </span>post</h1>
             </div>            
         </div>
        <!-- //user// -->

         <!-- post -->
         <div  class=" raw d-flex justify-content-center mt-3">
            <div class="card col-9 shadow my-3">
                <div class="card-header ">
                   <img src="${typeof post.author.profile_image !== 'string' ? "./img/profile-pic/grayUser.png":  post.author.profile_image}" alt="progileImge" class="rounded-circle border border-3" style="width: 40px; height: 40px;  ">
                    <b >${post.author.email == null ? "":post.author.email}</b>
                </div>

                <div class="card-body">
                    <img class="w-100" src="${typeof post.image !== 'string' ? "./img/post-pic/NoPic.jpg":  post.image}" alt="postImg" style="border-radius: 3px;">
                    <h6 class="pt-1" style="color: rgb(169, 162, 162);">${post.created_at}</h6>
                    <h5>${post.title == null ? "":post.title}</h5>
                    <p>${post.body}</p>
                    <hr>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                          </svg>
                        <span>(${post.comments_count}) comments</span>
                    </div>
                    <hr>
                    <!-- COMMENTS -->
                <div id="comments" class="my-2">

                    ${commentsContent}
                </div>
               <!-- //COMMENTS// -->

                <!-- Add comment -->
                <div id="addCommentSection">
                <div id="CreateComment" class="d-flex justify-content-center my-1" >
                    <input type="text" id="comment-input" style="width: 96%; outline: none;" placeholder="add your comment....." >
                    <button type="button" onclick="SendComment()" id="sendComment" class="btn btn-outline-primary " style="height: 35px;">Send</button>
                </div>
                </div>

               <!-- //Add comment //-->
                 
                    
                  
                </div>
              </div>
         </div>
        <!-- //post// -->

             `;
             
             specificPostEl.innerHTML = content;
              setupUIpostDetails()



 
     })
 }
     

function SendComment(){

    let commentInputEl = document.getElementById("comment-input");

        console.log(commentInputEl.value)
         // prepar the data
         const config = {
                            headers: {
                                "authorization": `Bearer ${localStorage.getItem("usertoken")}`,
                                "Content-Type": "application/json"  ,

                            }
                        }
                const params = {
                    "body": commentInputEl.value,
                }
        
        return axios.post(`https://tarmeezacademy.com/api/v1/posts/${ID}/comments`, params, config)
            .then((response) => {
                
                let post = response.data.data;
                console.log(post)
                commentInputEl.value = ""
                getspecficPostData(ID);
                showAlert("you just add a new comment", "success");

    
                }).catch((error)=>{
                    showAlert(error.response.data.message, "danger");
                })  
         
}

     
function setupUIpostDetails(){
      const token = localStorage.getItem("usertoken");
      const commentInputEl = document.getElementById("comment-input");

      const addCommentSection = document.getElementById("addCommentSection");


      if(token == null)// user is guest (not logged in)
      {
        addCommentSection.style.setProperty("display", "none","important");
      }else{

        addCommentSection.style.setProperty("display", "block","important");

      }
}

getspecficPostData(ID);
