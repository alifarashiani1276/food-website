document.querySelector("#signup").addEventListener("submit",(e)=>{
    e.preventDefault();

    const name = document.querySelector("#fullname").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const confirm = document.querySelector("#confirm").value;
    const dateMemberShip = Date.now()
    const shamsiDate = new Intl.DateTimeFormat('fa-IR').format(dateMemberShip)

    console.log(shamsiDate);
    
    let users = JSON.parse(localStorage.getItem("users")) || []

    if(password!==confirm){
           Swal.fire({
              icon: 'error',
              title: 'خطا',
              text: 'رمز عبور و تکرار آن مطابقت ندارند ❌',
              confirmButtonColor:"#Ef4123",
            });
          return;
    }

    const passwordPattern = /^[0-9]+$/;
    if (!passwordPattern.test(password)) {
      Swal.fire({
        icon: "error",
        title: "خطا",
        text: "رمز عبور باید فقط شامل اعداد انگلیسی باشد 🔢",
        confirmButtonColor: "#Ef4123",
      });
      return;
    }
    
    let isExist = users.some((user)=>{return user.email === email || user.name === name})
    if(isExist){
        Swal.fire({
              icon: 'warning',
              title: 'هشدار',
              text: 'نام کاربری یا ایمیل قبلاً ثبت نام شده است ⚠️',
              confirmButtonColor:"#Ef4123"
            });
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      Swal.fire({
        icon: "error",
        title: "خطا",
        text: "ایمیل معتبر وارد کنید ❌",
        confirmButtonColor: "#Ef4123",
      });
      return;
    }


    
    users.push({name,email,password,shamsiDate})
    localStorage.setItem("users",JSON.stringify(users))

     Swal.fire({
          icon: 'success',
          title: 'ثبت نام موفق!',
          text: 'ثبت نام شما با موفقیت انجام شد 🎉',
          confirmButtonText: 'باشه',
          confirmButtonColor:"#Ef4123",
        }).then(() => {
          window.location.href = "login.html";
        });
})
