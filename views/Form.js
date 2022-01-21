function enterData() {

    let name = document.getElementById('input-name') .value
    let email = document.getElementById('input-email') .value
    let phone = document.getElementById('input-phone') .value
    let subject = document.getElementById('input-subject') .value
    let message = document.getElementById('your-message') .value
    let emailReceiver = 'deanwahyu12@gmail.com'
    let skillCss = document.getElementById('CSS') .checked
    let skillHtml = document.getElementById('HTML') .checked
    let skillJavascript = document.getElementById('javascript') .checked
    let a = document.createElement('a')
    
    if (skillCss) {
        skillCss = (document.getElementById('CSS').value)
    } else{
        skillCss=""
    }
    if (skillHtml) {
        skillHtml = (document.getElementById('HTML').value)
    } else{
        skillHtml=""
    }
    if (skillJavascript) {
        skillJavascript = (document.getElementById('javascript').value)
    } else{
        skillJavascript=""
    }

    a.href = `mailto: ${emailReceiver}?subject=${subject}&body=Hallo my name ${name},${message},%0Aplease contact me by number ${phone}, or via email ${email}%0ARequirement: ${skillCss}${skillHtml}${skillJavascript}`

    console.log(name);
    console.log(email);
    console.log(phone);
    console.log(subject);
    console.log(message);
    console.log(skillCss);
    console.log(skillHtml);
    console.log(skillJavascript);
    
    if (name == '') {
        alert('Name is required')
    }   else if(email== ''){
        alert('Email is required')
    }   else if(phone== '') {
        alert('Phone Number Harus Diisi')
    }   else if(subject== '') {
        alert('Subject Harus Diisi')
    }   else if(message=='') {
        alert('Mesage Harus Diisi')
    }   else{
        a.click()
    }  
   
    let dataObject = {
        name: name,
        email: email,
        phoneNumber: phone,
        subject: subject,
        message: message,
    }
    console.log(dataObject);
}
function onlyNumberKey(num) {
    var ASCIICode = ''
    if(num.which){
        ASCIICode = num.which
    }
    if (ASCIICode < 48 || ASCIICode > 57)
        return false;
    return true;
}       

let blogs = []
function addBlog(event){
    event.preventDefault()

    let title = document.getElementById('input-blog-title').value
    let content = document.getElementById('input-blog-content').value
    let image = document.getElementById('input-blog-image').files
    image= URL.createObjectURL(image[0])
    let blog = {
        title: title,
        content:content,
        image: image,
        author: 'Wahyu',        
        postAt: new Date()
    }

    blogs.push(blog)     
    console.log(blogs);

    renderBlog()
}
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function getFullTime(time) {
    let date = time.getDate()
    let months = time.getMonth()
    let year = time.getFullYear()
    let hours = time.getHours()
    let minutes = time.getMinutes()

    let fullTime = `${date} ${month[months]} ${year} ${hours}:${minutes} WIB`

    return fullTime
}

function getDistanceTIme(time) {
    let timePost = time
    let timeNow = new Date ()
    let distance = timeNow - timePost

    let milisecond = 1000
    let second = 60
    let minutes = 60
    let hour = 23
    
    let distanceDay = Math.floor(distance / (milisecond * second * minutes * hour))
    let distanceHour = Math.floor(distance / (milisecond * second * minutes))
    let distanceMinute = Math.floor(distance / (milisecond * second))
    let distanceSecond = Math.floor(distance / milisecond)
    
    if (distanceDay >= 1) {
        return`${distanceDay} day ago`;
    }   else if (distanceHour >= 1) {
            return`${distanceHour} hour ago`;
        } else if (distanceMinute >= 1) {
                return`${distanceMinute} minute ago`
            } else {
                return `${distanceSecond} second ago`
            }
}

setInterval(()=>{renderBlog()},1000)

function renderBlog () {
    let contentContainer = document.getElementById('contents')

    contentContainer.innerHTML = ''

    for (let i = 0; i < blogs.length; i++) {
        contentContainer.innerHTML += `<div class="blog-list-item">
            <div class="blog-image">
                <img src="${blogs[i].image}" alt="" />
                </div>
                <div class="blog-content">
                <div class="btn-group">
                <button class="btn-edit">Edit Post</button>
                <button onclick="deletePost(blogs, ${i})" class="btn-post">Delete Post</button>
                </div>
                <h1>
                <a href="blog-detail.html" target="_blank">${blogs[i].title}</a>
                </h1>
                <div class="detail-blog-content">
                ${getFullTime(blogs[i].postAt)} | ${blogs[i].author}
                </div>
                <p>${blogs[i].content}</p>
                <div style="text-align: right;">
               <span style="font-size: 13px; color: rgb(202, 202, 202);">${getDistanceTIme(blogs[i].postAt)}</span>
            </div>
            </div>
        </div>`
    }
}   

function deletePost(array,i) {
    array.splice(i,1)
    renderBlog()
}

// function firstPost() {
//    return `<div class="blog-list-item">
//           <div class="blog-image">
//             <img src="Asset/blog-img.png" alt="" />
//           </div>
//           <div class="blog-content">
//             <div class="btn-group">
//               <button class="btn-edit">Edit Post</button>
//               <button class="btn-post">Post Blog</button>
//             </div>
//             <h1>
//               <a href="blog-detail.html" target="_blank"
//                 >Pasar Coding di Indonesia Dinilai Masih Menjanjikan</a
//               >
//             </h1>
//             <div class="detail-blog-content">
//             12 Jul 2021 22:30 WIB  | Ichsan Emrald Alamsyah
//             </div>
//             <p>
//               Ketimpangan sumber daya manusia (SDM) di sektor digital masih
//               menjadi isu yang belum terpecahkan. Berdasarkan penelitian
//               ManpowerGroup, ketimpangan SDM global, termasuk Indonesia,
//               meningkat dua kali lipat dalam satu dekade terakhir. Lorem ipsum,
//               dolor sit amet consectetur adipisicing elit. Quam, molestiae
//               numquam! Deleniti maiores expedita eaque deserunt quaerat! Dicta,
//               eligendi debitis?
//             </p>
//             <div style="text-align: right;">
//                <span style="font-size: 13px; color: rgb(202, 202, 202);">1 day ago</span>
//             </div>
//           </div>
//         </div>`
// }