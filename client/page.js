import * as cart from './cart.js';
const navigation = document.querySelector('.navigation');

let list = document.querySelector('.navigation');
const NAVIGATION_OPEN = document.querySelector('.conteiner_searchAndShopbag_search_navigation');
const NAVIGATION_CLOSE = document.querySelectorAll('.navigation_list');

const BtnFIND = null;
const InputSearch = null;
//DATABASE///////////////////////////////////////////////////////////////////////////////////////////////////
//LOAD from BD to PAGE
//fetch ('http://localhost:1598/getProducts').then ((response) => {return response.json();})
//.then ((data) => {console.log(data)});
fetch ('http://localhost:1598/getProducts')
.then ((response) => {return response.json()})
.then ((data) => { 
    let grocery = document.getElementById("grocery").querySelector('.container_viddil_listOfProduct');
    let milk = document.getElementById("milk").querySelector('.container_viddil_listOfProduct');
    let baking = document.getElementById("baking").querySelector('.container_viddil_listOfProduct');
    let sweets = document.getElementById("sweets").querySelector('.container_viddil_listOfProduct');
    let meat = document.getElementById("meat").querySelector('.container_viddil_listOfProduct');
    let fruit = document.getElementById("fruit").querySelector('.container_viddil_listOfProduct');
    let activeDepartment = null;

    for (let i=0; i<data.length; i++){      
        switch (parseInt(data[i].id_department)){
            case 1:
                activeDepartment = grocery; break;
            case 2: 
                activeDepartment = milk; break;
            case 3: 
                activeDepartment = baking; break;
            case 4: 
                activeDepartment = sweets; break;
            case 5: 
                activeDepartment = meat; break;
            case 6: 
                activeDepartment = fruit; break;
        }
        activeDepartment.innerHTML+=
        `
        <div id = "${data[i].id_product}"class="container_department_listOfProduct_ware">
            <div class="container_department_listOfProduct_ware_picture">
                <img class="container_department_listOfProduct_ware_picture_pic" src="./src/imgProducts/${data[i].pictures}"></img>
            </div>
            <div class="container_department_listOfProduct_ware_other">
                <span>${data[i].name_of_product}</span>
                <span>${data[i].description}</span>
                <span>${data[i].price} грн</span>
                    <div class="container_department_listOfProduct_ware_other_price">        
                        <div class="price_quantity">
                        <img class="price_quantity_minus_plus minus" src="./src/shopbag/minus.png">
                        <div class="chopbag__block__price__number__epta">1</div>
                        <img class="price_quantity_minus_plus plus" src="./src/shopbag/plus.png">
                    </div>
                </div>
                <button class="price_button">
                    <span class="price_button_text">До кошика</span>
                </button>
            </div>
        </div>
        `
       }
})
.then(() => {
    //cart.clearCart();
    cart.addFromlocalStorage();
    cart.addListerner();
    cart.AddToCart();
    NotefCart();
});

//SEARCHING
addSearch();
function addSearch(){
    document.querySelector('.conteiner_searchAndShopbag_buttonFind').addEventListener('click', function(){
        let InputSearch = document.querySelector('.conteiner_searchAndShopbag_inputText');
        let searchText= InputSearch.value;
        fetch(`http://localhost:1598/searchProduct?name=${searchText}`)
        .then ((response) => {return response.json()})
        .then ((data) => {
            try{
                const elements = document.querySelectorAll('.conteiner_viddil');
                elements.forEach(element => {
                    element.remove();
                });
                const elements2 = document.querySelectorAll('.container_department_listOfProduct_ware');
                elements2.forEach(element => {
                    element.remove();
                });
                const elements3 = document.querySelectorAll('.navigation');
                elements3.forEach(element => {
                    element.remove();
                });
            } 
            catch(error){}
            let html = '';
            let wrapper = document.querySelector('.conteiner_body');
            html+=
            `<div class="conteiner_viddil">
            <span class="conteiner_viddil_name">Результати пошуку: ${searchText}</span>
            <div class="container_viddil_listOfProduct">
            `;            
            for (let i=0; i<data.length; i++){
                html+=
                `
                <div id = "${data[i].id_product}"class="container_department_listOfProduct_ware">
                    <div class="container_department_listOfProduct_ware_picture">
                        <img class="container_department_listOfProduct_ware_picture_pic" src="./src/imgProducts/${data[i].pictures}"></img>
                    </div>
                    <div class="container_department_listOfProduct_ware_other">
                        <span>${data[i].name_of_product}</span>
                        <span>${data[i].description}</span>
                        <span>${data[i].price} грн</span>
                            <div class="container_department_listOfProduct_ware_other_price">        
                                <div class="price_quantity">
                                <img class="price_quantity_minus_plus minus" src="./src/shopbag/minus.png">
                                <div class="chopbag__block__price__number__epta">1</div>
                                <img class="price_quantity_minus_plus plus" src="./src/shopbag/plus.png">
                            </div>
                        </div>
                        <button class="price_button">
                            <span class="price_button_text">До кошика</span>
                        </button>
                    </div>
                </div>
                `
            }
            wrapper.innerHTML+=
            `${html}
            </div>
            </div>
            `
            let back_button_parent = document.querySelector('.conteiner_searchAndShopbag');
            back_button_parent.innerHTML=
            `
                    <div class="conteiner_searchAndShopbag_search">
                        <a class="conteiner_searchAndShopbag_search_navigation _backBut" href="./index.html">
                            <img class="conteiner_searchAndShopbag_search_navigation_img" src="./src/pointers/goBackArrow.png">
                        </a>
                        <input class="conteiner_searchAndShopbag_inputText" type="text" placeholder="Я шукаю....">
                        <button class="conteiner_searchAndShopbag_buttonFind">Знайти</button>
                    </div>
                    <button class="conteiner_searchAndShopbag_buttonShopbag">
                        <span >Кошик</span>
                    </button>
            `
            addSearch();

        })
        .then (() => {
            //cart.clearCart();
            openAndCloseShopbag();
            cart.addFromlocalStorage();
            cart.addListerner();
            cart.AddToCart();
            NotefCart();
            //addListerner();
            //toForm();
        })
        })
}

//DATABASE///////////////////////////////////////////////////////////////////////////////////////////////////

// ScrollToDepartment
if (document.querySelector('.navigation_list')) {
    navigation.addEventListener('click', function(click){
      let nav_item = click.target;
      if (nav_item.textContent == "Бакалія"){
        let nav = document.getElementById("grocery");
        nav.scrollIntoView({behavior: "smooth", block:"start"});
      } else if (nav_item.textContent == "Молочні вироби"){
        let nav = document.getElementById("milk");
        nav.scrollIntoView({behavior: "smooth", block:"start"});
      } else if (nav_item.textContent == "Випічка"){
        let nav = document.getElementById("baking");
        nav.scrollIntoView({behavior: "smooth", block:"start"});
      } else if (nav_item.textContent == "Солодощі"){
        let nav = document.getElementById("sweets");
        nav.scrollIntoView({behavior: "smooth", block:"start"});
      } else if (nav_item.textContent == "М'ясо та риба"){
        let nav = document.getElementById("meat");
        nav.scrollIntoView({behavior: "smooth", block:"start"});
      } else if (nav_item.textContent == "Фрукти та овочі"){
        let nav = document.getElementById("fruit");
        nav.scrollIntoView({behavior: "smooth", block:"start"});
      }
    })
}

//OPEN and CLOSE SHOPBAG
function openAndCloseShopbag(){
    const SHOPBAG = document.querySelector('.conteiner_searchAndShopbag_buttonShopbag');
    const SHOPBAG_EXIT = document.querySelector('.shopbag__title__img');
    let bag = document.querySelector('.shopbag');
    SHOPBAG.addEventListener('click', function(){
        bag.classList.add('_active');
    })
    SHOPBAG_EXIT.addEventListener('click', function(){
        bag.classList.remove('_active');
    })
}
//OPEN AND CLOSE NAVIGATION LIST 
function openNavigation() {
    NAVIGATION_OPEN.addEventListener('click', function(){
        list.classList.toggle('_active');
    });
}

function closeNavigation() {
    NAVIGATION_CLOSE.forEach(function(element) {
        element.addEventListener('click', function(){
            const list = element.closest('.navigation');
            list.classList.toggle('_active');
        });
    });
}

openNavigation(); 
closeNavigation(); 
openAndCloseShopbag();
hideNaviBar();

// OPEN FORM

////HIDE NAVIGATION BAR BY SCROLL
let positionStart = window.scrollY;
function hideNaviBar(){
    window.addEventListener('scroll', ()=>{
        let CONTAINER=document.querySelector('.conteiner_searchAndShopbag');
        let positionNow = window.scrollY;
        if (positionNow > 150 && positionStart<positionNow) CONTAINER.classList.add('_hidden');
        else CONTAINER.classList.remove('_hidden');
        positionStart=positionNow;
    }) 
}
///Notification of putting product to a cart
function NotefCart() {
    const PRICEBUTTONs = document.querySelectorAll('.price_button');
    PRICEBUTTONs.forEach(function(element) {
        const normal = element.innerHTML;
        const src = '<span class="price_button_alert">Додано до кошика</span>';

        element.addEventListener('click', () => {
            element.innerHTML = normal + src;
            setTimeout(() => {
               element.innerHTML = normal;
        }, 700);
        });
    });
}

const BACK_BUTN = document.querySelector('.back__button');
BACK_BUTN.addEventListener('click', function(click){
    window.scroll({
        top: 0, 
        left: 0, 
        behavior: "smooth"});
})
///FOR MYSELF
//document.addEventListener('click',e => console.log(e.target));