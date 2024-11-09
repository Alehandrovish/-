let SHOPLIST;
let SHOPBLOCK;
let btnToCart;
let btnDelete;

if (localStorage.getItem("cart") == null) {localStorage.setItem("cart", "[]");}

export function clearCart(){
    localStorage.setItem("cart", "[]");
    //updateCart();
}
export function btnMinus(){
    let MINUS = this.closest('.price_quantity').querySelector('.chopbag__block__price__number__epta');
    if (parseInt(MINUS.innerHTML)>1)
    {
        MINUS.innerHTML = parseInt(MINUS.innerHTML)-1; 
    }
}
export function btnPlus(){
    let PLUS = this.closest('.price_quantity').querySelector('.chopbag__block__price__number__epta'); 
    if(parseInt(PLUS.innerHTML)<50){
        PLUS.innerHTML = parseInt(PLUS.innerHTML)+1;
    }
}
export function addListerner(){
    let minuses =document.querySelectorAll('.minus');
    let pluses =document.querySelectorAll('.plus');
    for (const minus of minuses) {
        minus.onclick = btnMinus;
      }
    
      for (const plus of pluses) {
        plus.onclick = btnPlus;
      }
}
function btnMinus2(){
  let MINUS = this.closest('.shopbag_block_withPrice').querySelector('.shopbag_block_withPrice_price_quantity_num');
  if (parseInt(MINUS.innerHTML)>1)
  {
      MINUS.innerHTML = parseInt(MINUS.innerHTML)-1;
      updatePrice();
  }
  let id = this.closest('.shopbag_block').id;
  let obj =JSON.parse(localStorage.getItem("cart"));
  if(obj.find(item => item.id === id)){
    obj.find(item => item.id === id).quantity =parseInt(MINUS.innerHTML);
    localStorage.setItem("cart", JSON.stringify(obj));
  }
  
}
function btnPlus2(){
  let PLUS = this.closest('.shopbag_block_withPrice').querySelector('.shopbag_block_withPrice_price_quantity_num');
  if(parseInt(PLUS.innerHTML)<50){
      PLUS.innerHTML = parseInt(PLUS.innerHTML)+1;
      updatePrice();
  }
  let id = this.closest('.shopbag_block').id;
  let obj =JSON.parse(localStorage.getItem("cart"));
  if(obj.find(item => item.id === id)){
    obj.find(item => item.id === id).quantity = parseInt(PLUS.innerHTML);
    localStorage.setItem("cart", JSON.stringify(obj));
  }
}
function addListernerShop(){
  let minuses =document.getElementById('shopList').querySelectorAll('.minus');
  let pluses =document.getElementById('shopList').querySelectorAll('.plus');
  for (const minus of minuses) {
      minus.onclick = btnMinus2;
    }
    for (const plus of pluses) {
      plus.onclick = btnPlus2;
    }
}
export function deleteAllStorage() {
    SHOPLIST = document.querySelector('.shopList');
    while(SHOPLIST.firstChild) {
        SHOPLIST.removeChild(SHOPLIST.firstChild);
      }
}
export function deleteStorage() {
    btnDelete = document.querySelectorAll('.shopbag_block_x');
    let obj = JSON.parse(localStorage.getItem('cart'));
    for(let i=0; i<btnDelete.length; i++){
      
      btnDelete[i].addEventListener('click', function(){
        let block = this.closest('.shopbag_block');
        let idBlock = this.closest('.shopbag_block').id;
        block.remove();
        if (obj.find(item => item.id ===idBlock)){
          let index = obj.findIndex(item => item.id ===idBlock);
          obj.splice(index, 1);
          localStorage.setItem('cart', JSON.stringify(obj));
        }
        updatePrice();
      })
    }
}
export function addFromlocalStorage(){
  if (localStorage.getItem("cart") != "[]" && localStorage.getItem("cart") != null){
    deleteStorage();
    let obj = JSON.parse(localStorage.getItem("cart"));
        let mass=obj.map(item =>item.id);
    fetch(`http://localhost:1598/toCart?ids=${mass}`)
          .then(response => response.json())
          .then(data => {
            let html ='';
            let cart = localStorage.getItem("cart");
            let quan = JSON.parse(cart);
            for (let i=0; i<quan.length; i++)
            {
              let bag = quan.find(element => element.id == data[i].id_product).quantity;
              html+=
            `
            <li id = "${data[i].id_product}" class="shopbag_block">
            <img class="shopbag_block_x" src="./src/shopbag/x.png">
            <div class="shopbag_block_withImage">
                <img class="shopbag_block_withImage_img" src="./src/imgProducts/${data[i].pictures}"></img>
            </div>
            <div class="shopbag_block_withOutImage">
                <span class="shopbag_block_withOutImage_name">${data[i].name_of_product}</span>
                <span class="shopbag_block_withOutImage_desc">${data[i].description}</span>
            </div>
            <div class="shopbag_block_withPrice">
                <span class="shopbag_block_withPrice_price">Ціна: <span class="priceForOne">${data[i].price}</span> грн</span>
                <div class="shopbag_block_withPrice_price_quantity">
                    <img class="shopbag_block_withPrice_price_quantity_minusPlus minus" src="./src/shopbag/minus.png">
                    <span class="shopbag_block_withPrice_price_quantity_num">${bag}</span>
                    <img class="shopbag_block_withPrice_price_quantity_minusPlus plus" src="./src/shopbag/plus.png">
                </div>
            </div>
        </li>
            `
            }
            document.getElementById("shopList").innerHTML=html;
            deleteStorage();
            addListernerShop();
            updatePrice();
          });
  }
  }

export function AddToCart() {
  btnToCart = document.querySelectorAll('.price_button');
  for (let btn of btnToCart){
      btn.addEventListener('click', function(){
        if (localStorage.getItem("cart") == null) {localStorage.setItem("cart", "[]");}
        
      let id = this.closest('.container_department_listOfProduct_ware').id;
      let quantity = this.closest('.container_department_listOfProduct_ware').querySelector('.chopbag__block__price__number__epta').innerHTML;
  
      let massive=[];
      let obj = JSON.parse(localStorage.getItem("cart"));
      for (let i=0; i<obj.length; i++){
        massive.push({
          id : obj[i].id,
          quantity: obj[i].quantity
        })
      }
      if (massive.find(item => item.id === id)){
        massive.find(item => item.id === id).quantity=parseInt(massive.find(item => item.id === id).quantity)+parseInt(quantity);
      } else{
        massive.push({
          id:id,
          quantity: quantity
        });
      }
      localStorage.setItem("cart", JSON.stringify(massive));
      obj = JSON.parse(localStorage.getItem("cart"));
      fetch(`http://localhost:1598/toCart?ids=${obj.map(item => item.id)}`)
      .then(response => response.json())
      .then(data => {
        let html ='';
        let cart = localStorage.getItem("cart");
        let quan = JSON.parse(cart);
        for (let i=0; i<data.length; i++)
        {
          let bag = quan.find(element => element.id == data[i].id_product).quantity;
          html+=
        `
        <li id = "${data[i].id_product}" class="shopbag_block">
        <img class="shopbag_block_x" src="./src/shopbag/x.png">
        <div class="shopbag_block_withImage">
            <img class="shopbag_block_withImage_img" src="./src/imgProducts/${data[i].pictures}"></img>
        </div>
        <div class="shopbag_block_withOutImage">
            <span class="shopbag_block_withOutImage_name">${data[i].name_of_product}</span>
            <span class="shopbag_block_withOutImage_desc">${data[i].description}</span>
        </div>
        <div class="shopbag_block_withPrice">
            <span class="shopbag_block_withPrice_price">Ціна: <span class="priceForOne">${data[i].price}</span> грн</span>
            <div class="shopbag_block_withPrice_price_quantity">
                <img class="shopbag_block_withPrice_price_quantity_minusPlus minus" src="./src/shopbag/minus.png">
                <span class="shopbag_block_withPrice_price_quantity_num">${bag}</span>
                <img class="shopbag_block_withPrice_price_quantity_minusPlus plus" src="./src/shopbag/plus.png">
            </div>
        </div>
    </li>
        `
        }
        document.getElementById("shopList").innerHTML=html;
        deleteStorage();
        addListernerShop();
        updatePrice();
      });
  });
}
}
export function updatePrice(){
  let mass = [];
  let quantity = document.getElementById('shopList').querySelectorAll('.shopbag_block_withPrice_price_quantity_num');
  let priceForOne = document.getElementById('shopList').querySelectorAll('.priceForOne');
  
  for (let i = 0; i < quantity.length; i++){
    let qty = parseFloat(quantity[i].innerHTML);
    let price = parseFloat(priceForOne[i].innerHTML);
    if (!isNaN(qty) && !isNaN(price)) {
      mass[i] = qty * price;
    } else {
      mass[i] = 0;
    }
  }
  
  let cost = 0;
  for (let i = 0; i < mass.length; i++){
    cost += mass[i];
  }
  
  let Allprice = document.getElementById('totalTotalPrice');
  Allprice.innerHTML = cost.toFixed(2) + " грн";
  localStorage.setItem('price', cost.toFixed(2));
  toForm();
}

function toForm() {
  let btnForm = document.querySelector('.chopbag__footer__button');
  btnForm.removeEventListener('click', buyButton);
  btnForm.addEventListener('click', buyButton);
}

function buyButton(){
  let price = parseFloat(localStorage.getItem('price'));
  if (!isNaN(price) && price > 0) {
    document.location.href = "./shopbag.html";
  }
}