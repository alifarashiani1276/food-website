document.addEventListener("DOMContentLoaded",()=>{

    fetchMealsApi(cardsDown);
    getShoppingLocal();
    numberShoppingCard();
    CalcuTotalPrice();
    if(!orders.hasChildNodes()){
      ordersIsEmpty();
    }
    let token = localStorage.getItem("token")
    let decode;
    if(!token){
        Swal.fire({
        icon: "warning",
        title: "پایان جلسه",
        text: "⏰ زمان ورود شما به پایان رسیده است. لطفاً دوباره وارد شوید.",
        confirmButtonText: "باشه",
        confirmButtonColor: "#d33"
      })
      return;
    }else{
      try{
          decode = JSON.parse(atob(token))
      }catch(err){
          localStorage.removeItem("token");
          Swal.fire({
             icon: "error",
              title: "توکن نامعتبر ❌",
              text: "لطفاً دوباره وارد شوید.",
              confirmButtonText: "باشه"
            }).then(()=> window.location.href="login.html");
          console.error(err);
          return;
      }

    }

    if(decode.exp*1000<Date.now()){
        localStorage.removeItem("token")
        Swal.fire({
        icon: "warning",
        title: "پایان جلسه",
        text: "⏰ زمان ورود شما به پایان رسیده است. لطفاً دوباره وارد شوید.",
        confirmButtonText: "باشه",
        confirmButtonColor: "#d33"
      })
      return;
    }      

    Swal.fire({
    icon: "success",
    title: "ورود موفقیت آمیز 🎉",
    text: `${decode.username}  عزیز خوش آمدید💚`,
    confirmButtonText: "ادامه",
    confirmButtonColor: "#28a745"
   });
   showUserLogin();

})

function showBtnFainalShopping(){
  const finalizeOrder = document.querySelector(".finalize-order")
  const logoutUser = document.querySelector(".logout-user")
  try{
  let token = localStorage.getItem("token")
  let decode = JSON.parse(atob(token)) 

  if(!token||decode.exp*1000<Date.now()){
    finalizeOrder.style.display="none"
    logoutUser.style.display="flex"
    return;
  }else{
    finalizeOrder.style.display="flex"
    logoutUser.style.display="none"
  }
  }catch(err){
    console.log("توکن نا معتبر است!");
    finalizeOrder.style.display="none";
    logoutUser.style.display="flex";
  }
}
showBtnFainalShopping();

function showUserLogin(){
    const btnLogin = document.querySelector(".header-up-right")
    const userLogin = document.querySelector(".user-login")
    let username = document.querySelector(".user-login p")
   btnLogin.style.display="none"
   userLogin.style.display="flex"

   let userNameOfLocal= JSON.parse(localStorage.getItem("users"))
   userNameOfLocal.forEach(user => {
    username.textContent = user.name
   });   



   let usearNameInfo= userLogin.querySelector("p").textContent
   userInfo.textContent=usearNameInfo
}
const userInfo = document.querySelector(".username p")
const userLogin = document.querySelector(".user-login")
const overlayUserMenu = document.querySelector(".overlay-user-menu")
const exitShoppingCart = document.querySelector(".exit-shopping-cart")

userLogin.addEventListener("click",()=>{
  overlayUserMenu.classList.add("menu-show")
})

document.addEventListener("click",(e)=>{
  const favorit = e.target.closest(".favorit")
  if(favorit){
     const ingredient = favorit.dataset.value;
    // ذخیره دسته در تاریخچه
    if(ingredient){
     history.pushState({ page: ingredient }, "", `#${ingredient}`);
    // دریافت غذاهای دسته
    fetchMealsApibyIngredient(ingredient);
    }
    
  }

  if (!e.target.closest(".custom-select")) {
      optionsContainer.style.display = "none";
  }
  if(!resultSearch.contains(e.target)&&!inputSearch.contains(e.target)){
    resultSearch.replaceChildren()
  }
  if(e.target.classList.contains("exit-menu")||e.target.classList.contains("overlay-user-menu")){
    overlayUserMenu.classList.remove("menu-show")
  }
  if(e.target.classList.contains("menu-list-aboutme")){
    window.location.href="aboutme.html"
  }
  if(e.target.classList.contains("exit-shopping-cart")){
    overlyShopping.classList.toggle("shopping-show")
  }

  if(e.target.classList.contains("btn-add")){
    arrOrders = []
    getIdLocalStorage();

    let cardMeals = e.target.closest(".card-meals")
    let idMeal = cardMeals.dataset.id
    let exist = Array.isArray(arrOrders[0]) && arrOrders[0].includes(idMeal)
  
    if(exist){
      //! یکی به اعداد اصافه کن
      let pNum = document.querySelector(`#or-${idMeal} p`)
      
      addToNumber(pNum);

      let getinfoLocal = JSON.parse(localStorage.getItem("orders-Shopping"))
      getinfoLocal.forEach(item=>{if(item.idMeals===idMeal)item.numberMeals+=1})
      localStorage.setItem("orders-Shopping",JSON.stringify(getinfoLocal)) 
      
    }else{
       let saveMealsLocal = JSON.parse(localStorage.getItem("orders-Shopping"))|| []

       let imageMeals = cardMeals.querySelector(".card-image img").src;
       let nameMeals = cardMeals.querySelector(".card-Specifications h4").textContent;
       let priceMeals = cardMeals.querySelector(".Specifications-price p").textContent;
       let idMeals = cardMeals.dataset.id
       let numberMeals = 1

       let meal = {
        imageMeals,
        nameMeals,
        priceMeals,
        idMeals,
        numberMeals
       }
       saveMealsLocal.push(meal);
       localStorage.setItem("orders-Shopping",JSON.stringify(saveMealsLocal))
       getShoppingLocal();
       
    }
    CalcuTotalPrice();
    numberShoppingCard();
  }
  if(e.target.classList.contains("delete-order")){
    const cardMealsDel = e.target.closest('[class="order"]')
    const orderId = cardMealsDel.dataset.id

    let arrIdLocal = JSON.parse(localStorage.getItem("orderCarts"))
    arrIdLocal = arrIdLocal.filter(id=>id !== orderId)
    localStorage.setItem("orderCarts",JSON.stringify(arrIdLocal))

    let arrOrder = JSON.parse(localStorage.getItem("orders-Shopping"))
    arrOrder = arrOrder.filter(order=>order.idMeals !== orderId)
    localStorage.setItem("orders-Shopping",JSON.stringify(arrOrder))
    
    if(cardMealsDel){
      cardMealsDel.remove();
    }
    CalcuTotalPrice();
    numberShoppingCard();

    if(!orders.hasChildNodes()){
      ordersIsEmpty();
    }
  }
  if(e.target.classList.contains("order-increase")){
    let MyOrder = e.target.closest(".order")
    let MyId = MyOrder.dataset.id
    let pNumber =document.querySelector(`#or-${MyId} p`)
    addToNumber(pNumber,MyId);
    CalcuTotalPrice();
    numberShoppingCard();
  }
  if(e.target.classList.contains("order-decrease")){
    let MyOrder = e.target.closest(".order")
    let MyId = MyOrder.dataset.id
    let pNumber =document.querySelector(`#or-${MyId} p`)
    subtractNumber(pNumber,MyId);
    CalcuTotalPrice();
    numberShoppingCard();
  }
  
})

function getShoppingLocal(){
       let InfoMeal = JSON.parse(localStorage.getItem("orders-Shopping"))
       orders.replaceChildren();
       if(InfoMeal){
          InfoMeal.forEach(order=>{
        cartAddToShopping(order.imageMeals,order.nameMeals,order.priceMeals,order.idMeals,order.numberMeals);
       })
       }
     
}

const exitAccount = document.querySelector(".exit-account")
exitAccount.addEventListener("click",()=>{
  localStorage.removeItem("token");
  localStorage.removeItem("loggedUser");
  localStorage.removeItem("infoUser");
  location.reload();
  
})

const shoppingCart = document.querySelector(".header-up-left")
const overlyShopping =  document.querySelector(".overly-shopping-cart")
shoppingCart.addEventListener("click",()=>{
overlyShopping.classList.toggle("shopping-show")
})

let cardsDown = document.querySelector(".cards-down")
const apiMeals = "https://www.themealdb.com/api/json/v1/1/"
async function fetchMealsApi(container) { 
  try{
    let response = await fetch(`${apiMeals}search.php?s=`)
    if(!response.ok) throw new Error(`خطای HTTP! وضعیت: ${response.status}`);
    let data =await response.json();

    apiAddToDom(data.meals,container)
    }catch(err){
    console.error(err,"دریافت اطلاعات با خطا مواجه شد.")
  }
  
}

let resultSearch = document.querySelector(".result-search-cards")
async function fetchMealsApiByName(nameMeals) { 
  try{
    let response = await fetch(`${apiMeals}search.php?s=${nameMeals}`)
    if(!response.ok) throw new Error(`خطای HTTP! وضعیت: ${response.status}`);

    let data =await response.json();

    console.log(data.meals);
    apiAddToDom(data.meals,resultSearch)
    
    }catch(err){
    console.error(err,"دریافت اطلاعات با خطا مواجه شد.")
  }
}
let btnSearch = document.querySelector(".btn-search")
let inputSearch = document.querySelector(".input-search input")

function attachSearchListeners(){
  btnSearch.addEventListener("click",()=>{ 
 if(inputSearch.value){
   resultSearch.replaceChildren();
  console.log(inputSearch.value);
  
  fetchMealsApiByName(inputSearch.value.trim());
 }
})

inputSearch.addEventListener("keydown",(e)=>{
  if(e.key==="Enter"){
    if(inputSearch.value){
      resultSearch.replaceChildren();
      console.log(inputSearch.value);
  
      fetchMealsApiByName(inputSearch.value.trim());
   }
  }
})
}
attachSearchListeners();

async function fetchMealsApibyCountry(country) { 
  try{
    let response = await fetch(`${apiMeals}filter.php?a=${country}`)
    if(!response.ok) throw new Error(`خطای HTTP! وضعیت: ${response.status}`);
    let data =await response.json();

    console.log(data.meals);
    
    apiAddToDom(data.meals,cardsDown)
        
    }catch(err){
    console.error(err,"دریافت اطلاعات با خطا مواجه شد.")
  }
  
}

const selectionCountry = document.querySelector(".custom-select")
const selectionCountrySvg= document.querySelector(".svg-location")
const main = document.querySelector("main");

const initialContent = main.innerHTML;


async function fetchMealsApibyIngredient(ingredient) {
  try {
    let response = await fetch(`${apiMeals}filter.php?i=${ingredient}`);
    if (!response.ok) throw new Error(`خطای HTTP! وضعیت: ${response.status}`);
    let data = await response.json();

    console.log(data.meals);

    // پاک کردن و جایگزینی محتوای main
    // main.innerHTML = ` 
    //   <section class="category-page">
    //     <h2>دسته ${ingredient}</h2>
    //     <div class="cards"></div>
    //   </section>
    // `;
    addToDomFilterMeals(ingredient)

    const cardsContainer = main.querySelector(".cards");
    apiAddToDom(data.meals, cardsContainer);
    window.scrollTo({ top: 0, behavior: "smooth" });
    selectionCountry.style.display="none"
    selectionCountrySvg.style.display="none"
  } catch (err) {
    console.error("دریافت اطلاعات با خطا مواجه شد:", err);
  }
}

// وقتی کاربر Back یا Forward مرورگر بزنه
window.addEventListener("popstate", (event) => {
  if (event.state && event.state.page) {
    console.log("برگشت به دسته:", event.state.page);
    fetchMealsApibyIngredient(event.state.page)
        .then(() => {
        // وقتی محتوای دسته لود شد → اسکرول بالا
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

  } else {
    // هیچ stateی وجود نداره → برگرد به محتوای اولیه
    main.innerHTML = initialContent;
    selectionCountry.style.display=""
    selectionCountrySvg.style.display=""
     resultSearch = document.querySelector(".result-search-cards")
     btnSearch = document.querySelector(".btn-search")
     inputSearch = document.querySelector(".input-search input")
     
     cardsDown = document.querySelector(".cards-down");

     attachSearchListeners();

    fetchMealsApi(cardsDown)
         .then(() => {
        // وقتی محتوای دسته لود شد → اسکرول بالا
        window.scrollTo({ top: 0, behavior: "smooth" });
        
      });

  }
});

function addToDomFilterMeals(ingredient){
    const sectionMeals = document.createElement("section")
    sectionMeals.classList.add("category-page")

    const h2Meals = document.createElement("h2")
    h2Meals.textContent=`Filtered by: ${ingredient}`

    const divCards = document.createElement("div")
    divCards.classList.add("cards")

    sectionMeals.append(h2Meals,divCards)
    main.replaceChildren();
    main.append(sectionMeals)
}


function apiAddToDom(meals,AddElement){
  meals.forEach(user=>{

    cartDiv = document.createElement("div")
    cartDiv.classList.add("card-meals")

    const cartImg = document.createElement("div")
    cartImg.classList.add("card-image")

    const img =document.createElement("img")
    img.setAttribute("src",user.strMealThumb)
    img.setAttribute("alt",user.strMeal)
    cartImg.append(img)
    cartDiv.append(cartImg)

    const cardText = document.createElement("div")
    cardText.classList.add("card-text")

    const cardSpecification = document.createElement("div")
    cardSpecification.classList.add("card-Specifications")    

    const textfood = document.createElement("h4")
    textfood.textContent=user.strMeal
    cardSpecification.append(textfood)

    const divPrice = document.createElement("div")
    divPrice.classList.add("Specifications-price")
   
    const textPrice = document.createElement("p")
    textPrice.textContent =`${Math.floor(Math.random()*56)+5} دلار`
    divPrice.append(textPrice)
    cardSpecification.append(divPrice)

    const divbtn = document.createElement("div")
    divbtn.classList.add("btn-addShoppingCard")

    const btnAddShopping = document.createElement("button")
    btnAddShopping.textContent="افزودن "
    btnAddShopping.classList.add("btn-add")
    divbtn.append(btnAddShopping)
    cardSpecification.append(divbtn)
    
    cartDiv.setAttribute("data-id",`${user.idMeal}`)


    cardText.append(cardSpecification)
    cartDiv.append(cardText)    
    AddElement.append(cartDiv)
  })
}

let arrOrders = []
const orders = document.querySelector(".orders")
function cartAddToShopping(imageMeals,nameMeals,priceMeals,idMeal,numberMeals){


  const orderDiv = document.createElement("div")
  orderDiv.classList.add("order")
  orderDiv.id="order-Shopping"

  const orderImage = document.createElement("div")
  orderImage.classList.add("order-image")
  const imageMeal = document.createElement("img")
  imageMeal.src=imageMeals
  orderImage.append(imageMeal)

  const orderNamePrice = document.createElement("div")
  orderNamePrice.classList.add("order","name-price")
  const nameMeal = document.createElement("h4")
  nameMeal.textContent=nameMeals
  const priceMeal = document.createElement("p")
  priceMeal.textContent=priceMeals
  orderNamePrice.append(nameMeal,priceMeal)

  const orderNumber = document.createElement("div")
  orderNumber.classList.add("order-number")
  orderNumber.id=`or-${idMeal}`
  const buttonIn = document.createElement("button")
  buttonIn.classList.add("order-increase")
  buttonIn.textContent="+"
  const pNum = document.createElement("p")
  pNum.textContent=numberMeals
  const buttonDe = document.createElement("button")
  buttonDe.classList.add("order-decrease")
  buttonDe.textContent="-"
  orderNumber.append(buttonIn,pNum,buttonDe)

  orderdelete = document.createElement("div")
  orderdelete.classList.add("delete-order")
  const imageDel =document.createElement("img")
  imageDel.classList.add("delete-order")
  imageDel.src="./images/deleteShopping.svg"
  imageDel.alt="image delete"
  orderdelete.append(imageDel)

  orderDiv.setAttribute("data-id",idMeal);

  orderDiv.append(orderImage,orderNamePrice,orderNumber,orderdelete);
  orders.append(orderDiv);
  
  setIdToLocalStorage(orderDiv);
    
}

function ordersIsEmpty(){
  let pOrders  = document.createElement("p")
  pOrders.textContent= "سفارشی وجود ندارد." 
  pOrders.style.textAlign="center"
  orders.append(pOrders)
}

function setIdToLocalStorage(orderDiv){
  const newId = orderDiv.dataset.id

  const saveId = JSON.parse(localStorage.getItem("orderCarts")) || []
  
  if(!saveId.includes(newId)){
    saveId.push(newId)
  }
 

  localStorage.setItem("orderCarts",JSON.stringify(saveId))
}

function getIdLocalStorage(){
  const IdOrders = JSON.parse(localStorage.getItem("orderCarts"))
  arrOrders.push(IdOrders)  
}

function addToNumber(ElmNumber,idMeal){
  let convertNum = ElmNumber.textContent
  let mynum = Number(convertNum)||0
  mynum += 1
  ElmNumber.textContent=mynum

  let getinfoLocal = JSON.parse(localStorage.getItem("orders-Shopping"))

  
  getinfoLocal.forEach(item=>{if(item.idMeals===idMeal)item.numberMeals=mynum})
  localStorage.setItem("orders-Shopping",JSON.stringify(getinfoLocal))
}

function subtractNumber(ElmNumber,idMeal){
  let convertNum = ElmNumber.textContent
  let mynum = Number(convertNum);
  if(isNaN(mynum)||mynum <= 1)return;
  mynum -= 1
  ElmNumber.textContent=mynum
  let getinfoLocal = JSON.parse(localStorage.getItem("orders-Shopping"))

  
  getinfoLocal.forEach(item=>{if(item.idMeals===idMeal)item.numberMeals=mynum})
  localStorage.setItem("orders-Shopping",JSON.stringify(getinfoLocal))
}

function CalcuTotalPrice(){
  let orders = document.querySelectorAll("#order-Shopping")
  let arrOrders = Array.from(orders)
  
  let numberArr = []
  arrOrders.forEach(order=>{
    let price = order.querySelector(".name-price p").textContent
    let number = order.querySelector(".order-number p").textContent

    let priceOrder = price.match(/\d+/) * Number(number)
    numberArr.push(priceOrder)
  })

  let TotoalPrice = numberArr.length? numberArr.reduce((accu,price)=>{return accu+price},0) : 0;

  let divTotalPrice = document.querySelector(".total-price h4")
  divTotalPrice.textContent = `${TotoalPrice} دلار`
  
}

function numberShoppingCard(){
  const shoppingCard = document.querySelector(".header-up-left p")

  let orderNumber = document.querySelectorAll(".order-number p")
  let arrOrderNumber = Array.from(orderNumber)
  
  shoppingCard.textContent= arrOrderNumber.reduce((accu,p)=>{
   return accu + Number(p.textContent)
  },0)
}

const selected = document.querySelector(".selected");
const optionsContainer = document.querySelector(".options");
const options = document.querySelectorAll(".option");

selected.addEventListener("click", () => {
    optionsContainer.style.display =
      optionsContainer.style.display === "block" ? "none" : "block";
});

options.forEach(option => {
    option.addEventListener("click", () => {
      selected.innerHTML = option.innerHTML;
      optionsContainer.style.display = "none";
      console.log("انتخاب شد:", option.dataset.value);
      cardsDown.replaceChildren();
      fetchMealsApibyCountry(option.dataset.value);
    });
});




