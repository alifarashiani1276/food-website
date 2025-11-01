document.addEventListener("DOMContentLoaded",()=>{
    const userName = document.querySelector("#userName")
    const email = document.querySelector("#email")
    const dateMembership = document.querySelector("#dateMembership")

    const users = JSON.parse(localStorage.getItem("users")) 

    if(!users){
        Swal.fire({
        icon: 'warning',
        title: 'توجه!',
        text: 'شما ثبت نام نکرده‌اید',
        confirmButtonText: 'باشه'
      }).then(()=>{
      window.location.href="signup.html"
      })
      return;
    }
    
    users.forEach(user=> {
        userName.textContent = user.name
        email.textContent = user.email
        dateMembership.textContent=user.shamsiDate
    });

})