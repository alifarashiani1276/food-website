document.querySelector("#login").addEventListener("submit",(e)=>{
    e.preventDefault();

    const username = document.querySelector("#userName").value;
    const password = document.querySelector("#password").value;

    if(!username || !password){
      Swal.fire({
        icon: "warning",
        title: "خطا",
        text: "لطفاً نام کاربری و رمز عبور را وارد کنید ⚠️",
        confirmButtonColor: "#Ef4123"
       });
    return;
    }
    
    let users =JSON.parse(localStorage.getItem("users")) || []

    let validUser = users.some((user)=>{return user.name===username && user.password===password})
    let existUserName =  users.some((user)=>{return user.name===username })

    if(validUser){
        let token = btoa(JSON.stringify({
            username,
            exp: Date.now() + 86400000
        }))
        localStorage.setItem("token",token)
        localStorage.setItem("loggedUser", username);

        Swal.fire({
        icon: "success",
        title: "ورود موفق",
        text: "ورود شما با موفقیت انجام شد! خوش آمدید 👋",
        confirmButtonText: "باشه",
        confirmButtonColor: "#28a745"


        }).then(() => {
           window.location.href = "index.html";
        });
    }else{

        if(existUserName){
            Swal.fire({
            icon: "error",
            title: "خطا",
            text: "رمز عبور اشتباه است ❌",
            confirmButtonColor: "#Ef4123"
            });
            return;
        }

         Swal.fire({
         icon: "warning",
         title: "هشدار",
         text: "کاربری با این نام ثبت نشده است. لطفاً حساب کاربری خود را ایجاد کنید ⚠️",
         confirmButtonColor: "#Ef4123"
           });
           return;
    }


})

