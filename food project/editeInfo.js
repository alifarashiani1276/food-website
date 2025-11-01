let infoUser = JSON.parse(localStorage.getItem("infoUser"))
const users = JSON.parse(localStorage.getItem("users"))


document.addEventListener("DOMContentLoaded",()=>{
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

    users.forEach(user=>
      email.value = user.email
    )

    if(infoUser){
        getInfo();
    }
    
});

let firstName = document.querySelector("#firstName");
let lastName = document.querySelector("#lastName");
let username = document.querySelector("#username");
let email = document.querySelector("#email");
let phone = document.querySelector("#phone");
let birthdate = document.querySelector("#birthdate")
let gender = document.querySelector("#gender")
let nationalId = document.querySelector("#nationalId")
let address = document.querySelector("#address")
let currentPass = document.querySelector("#currentPass")
let newPass = document.querySelector("#newPass")
let confirmPass = document.querySelector("#confirmPass")

function getInfo(){
    infoUser.forEach(user => {
        firstName.value = user.firstNamenew
        lastName.value= user.lastNamenew
        username.value= user.usernamenew
        email.value = user.emailnew
        phone.value= user.phonenew
        birthdate.value = user.birthdatenew
        gender.value = user.gendernew
        nationalId.value = user.nationalIdnew
        address.value = user.addressnew
    });
}

const form = document.querySelector("#profile-form")
form.addEventListener("submit",(e)=>{
    e.preventDefault();
    
   let setInfoUser = infoUser ? [...infoUser] : [];

    let firstNamenew = firstName.value
    let lastNamenew = lastName.value
    let usernamenew = username.value
    let emailnew = email.value
    let phonenew = phone.value.trim()
    let birthdatenew = birthdate.value
    let gendernew = gender.value
    let nationalIdnew = nationalId.value.trim()
    let addressnew = address.value
    let currentPassnew = currentPass.value
    let newPassnew = newPass.value
    let confirmPassnew  = confirmPass.value

    let nameRegex = /^[A-Za-z ]+$/;
    if(!nameRegex.test(firstNamenew)||!nameRegex.test(lastNamenew)){
        Swal.fire({
        icon: 'error',
        title: 'خطا',
        text: 'نام و نام خانوادگی باید فقط شامل حروف انگلیسی A تا Z باشند.',
        confirmButtonText: 'باشه'
      });
      return;
    }
    
    const usernameRegex = /^[A-Za-z0-9]+$/;
    if(!usernameRegex.test(usernamenew)){
         Swal.fire({
        icon: 'error',
        title: 'خطا',
        text: 'نام کاربری  فقط شامل  حروف  a-z  و اعداد انگلیسی باید باشد.',
        confirmButtonText: 'باشه'
      });
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailnew)) {
      Swal.fire({
        icon: "error",
        title: "خطا",
        text: "ایمیل معتبر وارد کنید ❌",
        confirmButtonColor: "#Ef4123",
      });
      return;
    }

    let phonRegex = /^09[0-9]{9}$/;
    if(!phonRegex.test(phonenew)){
        Swal.fire({
        icon: 'error',
        title: 'خطا',
        text: 'شماره موبایل باید حتماً عدد باشد و با 09 شروع شود.',
        confirmButtonText: 'باشه'
       });
       return;
    }

    const nationalIdRegex = /^[0-9]+$/;
    if(!nationalIdRegex.test(nationalIdnew)){
        Swal.fire({
        icon: 'error',
        title: 'خطا',
        text: 'کد ملی معتبر وارد کنید. کد ملی باید فقط عدد باشد.',
        confirmButtonText: 'باشه'
      });
      return;
    }


    const userFound = users.find(user => user.password === currentPassnew);
    if(!userFound){
      Swal.fire({
        icon: 'error',
        title: 'خطا',
        text: 'رمز عبور فعلی صحیح نیست.',
        confirmButtonText: 'باشه',
        focusConfirm: true
      });
     return;
    }


    if(newPassnew!==confirmPassnew){
      Swal.fire({
      icon: 'error',
      title: 'خطا',
      text: 'رمز عبور جدید شما با یکدیگر مطابقت ندارند.',
      confirmButtonText: 'باشه'
      });
      return;
    }
    if(newPassnew){
         if(newPassnew.length<3){
       Swal.fire({
       icon: 'error',
       title: 'خطا',
       text: 'رمز عبور جدید باید حداقل ۳ کاراکتر باشد.',
       confirmButtonText: 'باشه'
       });
     return;
    }
    }

    Swal.fire({
    icon: 'success',
    title: 'موفقیت',
    text: 'اطلاعات شما با موفقیت ذخیره شد.',
   confirmButtonText: 'باشه'
   }).then(()=>{

    users.forEach((user)=>{
      if(emailnew===user.email){
        if(usernamenew) user.name=usernamenew
        if(newPassnew) user.password=newPassnew
      }

    })

    localStorage.setItem("users",JSON.stringify(users))
    setInfoUser.push({firstNamenew,lastNamenew,usernamenew,emailnew,phonenew,
                      birthdatenew,gendernew,nationalIdnew,addressnew,
                      currentPassnew,newPassnew,confirmPassnew})

    localStorage.setItem("infoUser",JSON.stringify(setInfoUser))
    window.location.href="index.html"
   })

})