let i;

function addToBD() {
        let NAME = document.querySelector('._name').value;
        let MOBILE = document.querySelector('._tel').value;
        let CHECKBOX = document.querySelector('._checkbox').checked;
        let ADRES = document.querySelector('._street');
        let ADRES_DATA = document.querySelectorAll('.adress__data');
        let ADRES_STRING = 'вул.'+ ADRES.value + ' під`їзд: ' + ADRES_DATA[0].value + ' Поверх: ' + ADRES_DATA[1].value + ' Квартира: ' + ADRES_DATA[2].value;
        let MAGAZ_ADRES = document.querySelector('._your').value;
        let CHECKBOX_NUM=0;
        if (CHECKBOX == true){
            CHECKBOX_NUM =2;
            ADRES_STRING = "Null";
            
        } else {
            CHECKBOX_NUM=1;
            MAGAZ_ADRES = "Null";
        }
        let TIME = document.querySelector('._time').value;
        let COMMENT = document.querySelector('.comments__textarea').value;
        let CART = JSON.parse(localStorage.getItem('cart'));
        let PRICE = JSON.stringify(localStorage.getItem('price')).replace(/["]/g, '');
        let obj = JSON.parse(localStorage.getItem("cart"));
      
        let convertedArray = CART.map(obh => {
            return {
                id: parseInt(obh.id),
                quantity: parseInt(obh.quantity)
            };
        });
        let outputStream = JSON.stringify(convertedArray);
        fetch(`http://localhost:1598/addOrder?name=${NAME}&phone_number=${MOBILE}&delivery_type=${CHECKBOX_NUM}&address=${ADRES_STRING}&id_selfPickup=${MAGAZ_ADRES}&comment=${COMMENT}&content=${outputStream}&time=${TIME}&price=${localStorage.getItem('price')}`)
      .then((response) => {return response.json();})
      .then ((data) => {
        console.log("sucksesful");
        createPayList();
      })
  }


 function createPayList(){
    let id_order = 0;
    fetch('http://localhost:1598/getLastIdOrder')
    .then((response) => response.json())
    .then((data) => {
        let id_order = data.map(item => item.id_order);
        let id = document.querySelector('.id');
        id.innerHTML = "Код вашого замовлення: " + id_order[0];

        return fetch(`http://localhost:1598/getInfoOrder?id=${parseInt(id_order)}`);
    })
    .then((response) => response.json())
    .then((data) => {
        let html='';
        let wrapperList =document.querySelector('.payList_body_item_list');

        for (i=0; i<data.length; i++){
            html +=
            `
            <p class="payList_body_item">${data[i].name_of_product}: </p>
            <p class="payList_body_item">${data[i].price}X${data[i].quantity} = ${parseInt(data[i].price)*parseInt(data[i].quantity)} грн</p>
            `
        }
        wrapperList.innerHTML=html;
        let html2='';
        let wrapperForm = document.querySelector('.payList_body_formData_list');
        html2+=
        `
        <p class="payList_body_formData">Замовлення на ім'я: ${data[0].name_of_client}</p>
        <p class="payList_body_formData">На номер телефону: ${data[0].number_of_phone}</p>
        <p class="payList_body_formData">З вибраним типом доставки: ${data[0].type_delivery}</p>
        `
        if (data[0].type_delivery == "Доставка на дім"){
            html2=
            `
            ${html2}
            <p class="payList_body_formData">За адресом:  ${data[0].address_delivery}</p>
            <p class="payList_body_formData">За часом: ${data[0].time_delivery}</p>
            `;
        } else if (data[0].type_delivery == "Самовивіз"){
            let adres;
            if (data[0].id_address_selfPickup == 1){
                adres = "вул. Шевченко 133Б";
            } else if (data[0].id_address_selfPickup == 2){
                adres = "пров. Лісний 15А";
            }
            html2=
            `
            ${html2}
            <p class="payList_body_formData">За адресом дільниці:  ${adres}</p>
            `;
        }
        wrapperForm.innerHTML = html2;
        
        let priceElement = document.querySelector('.payList_footer');
        let price = priceElement.innerHTML;
        price = `Сума до сплати: ${data[0].order_price} грн`;
        priceElement.innerHTML = price;

        let btnClose = document.querySelector('.payList_footer_btnClose_close');
        btnClose.addEventListener('click', function(){
            let payList = document.querySelector('.payList ');
            payList.classList.remove('_active');
            localStorage.setItem('cart', "[]");
            localStorage.setItem('priсe', 0.0);
            window.location.href ="./index.html";
        })
        payList();
    });
 }
 
 
  function payList() {
    let veil = document.querySelector('.veil');
    let payList = document.querySelector('.payList');
    veil.style.display = 'block';
    payList.classList.add('_active');
  }

const BACK_BUTN = document.querySelector('.back__button');
BACK_BUTN.addEventListener('click', function(click){
    window.scroll({
        top: 0, 
        left: 0, 
        behavior: "smooth"});
})

const DELIVERY = document.getElementsByName('delivery');
const DELIVERY_TO_HOME_BLOCK = document.querySelector('.delivery-to-home');
const DELIVERY_YOURSELF_BLOCK = document.querySelector('.take-yourself');

for (let i=0; i<DELIVERY.length; i++)
{
    DELIVERY[i].addEventListener('change', radioBTN);
}

function radioBTN(event) {
    const price = parseFloat(localStorage.getItem("price"));
    if (price < 500.00) {
        alert("Доставка на дім доступна при сумі покупок більше 500 грн");
        if (event.target === DELIVERY[1]) {
            event.target.checked = false;
            DELIVERY[0].checked = true;
        }
        return;
    }
    if (DELIVERY[0].checked == true) {
        DELIVERY_TO_HOME_BLOCK.classList.toggle('_active');
        DELIVERY_YOURSELF_BLOCK.classList.toggle('_active');
    }
    if (DELIVERY[0].checked == false){
        DELIVERY_TO_HOME_BLOCK.classList.toggle('_active');
        DELIVERY_YOURSELF_BLOCK.classList.toggle('_active');
    }
}
const NUMBER_TELEFON = document.getElementsByName('mobile');
if(document.getElementsByName('mobile'))
{
    NUMBER_TELEFON[0].addEventListener('click', function(){
        NUMBER_TELEFON[0].value = "+380(";
    })
}


const FORM = document.getElementById('form');
let formReq = document.querySelectorAll('._req');
FORM.addEventListener('submit', formSend);

async function formSend(e){
    e.preventDefault();
    let error = formValidate(FORM);
    if (error == 0){
        console.log("OK");
        await addToBD();
    } else{
        console.log(" not OK");
        //alert("Виділені поля мають бути заповнені");
    }
}

function formValidate(e){
    let error = 0;
    let CHECKBOX = document.querySelector('._checkbox').checked;
    let errorText = document.querySelector('.button__make-order');
    DestroyError();
    let formReq = document.querySelectorAll('._req');
    for (let i=0; i<formReq.length; i++){
        const input = formReq[i];
        formRemoveError (input);
        if (input.classList.contains('_name')){
            if (input.value.length != 0 && validationText(input.value) == 0)
            {   
                formRemoveError(input);
            }else{
                formAddError (input);
                error++;
            }
            
            //error++;
        } else if (input.classList.contains('_tel')){
            if (input.value.length != 0 && validationTel(input.value) == 0)
            {   
                validationTel (input.value);
                formRemoveError(input);
            }else{
                formAddError (input);
                error++;
            }

        } else if (CHECKBOX == false && input.classList.contains('_street')){
            if ( input.value != 0)
            { 
                formRemoveError(input);
            } else{
                formAddError (input);
                error++;
            }
    
        } else if (CHECKBOX == false && input.classList.contains('_street-data')){
            if (input.value.length != 0 && validationNum(input.value) == 0)
            { 
                validationNum(input.value);
                formRemoveError(input);
            } else{
                formAddError (input);
                error++;
            }

        } else if (CHECKBOX == true && input.classList.contains('_your')){
            if (input.value != 0)
            { 
                formRemoveError(input);
            } else{
                formAddError (input);
                error++;
            }
        } 

    }
    if (error != 0 ){
        CreateError(errorText, "Всі поля повинні бути заповненим");
    }
    return error;
}

function validationText (input){
    let index = 0;
    let len=input.length;
    let digits="йцукенгшщзхїєждлорпавіфячсмитьбюЙЦУКЕНГШЩЗХЇЄЖДЛОРПАВІФЯЧСМИТЬБЮ' ";
    if (len > 50)
    {   
        CreateError(document.getElementById('name'), "Забагато символів (Введіть кількість симвовів  < 50)");
        index++;
    }
    for(i=0; i<10; i++)
    {if (digits.indexOf(input.charAt(i))<0)
    {CreateError(document.getElementById('name'), "Повинні бути букви Ураїнського алфавіту");
    index++;
    break}
    }
    return index;
   }

function validationTel (input)
    {
        let index = 0;
        let len=input.length;
        let digits="+(0123456789";
        if (len != 14)
        {
            CreateError(document.getElementById('tel'), "Неправильно введені дані ( Введіть 14 символів)");
            index++;
        }
        for(i=0; i<10; i++)
        {if (digits.indexOf(input.charAt(i))<0)
        {CreateError(document.getElementById('tel'), "У номері телефону повинні бути числа");
        index++;
        break}
        }
        return index;
       }
function validationNum (input){
        let index = 0;
        let len=input.length;
        let digits="0123456789";
        if (len > 3)
        {
            CreateError(document.getElementById('num'), "Забагато символів ( Введіть кількість символів < 3)");
            index++;
        }
        for(i=0; i<10; i++)
        {if (digits.indexOf(input.charAt(i))<0)
        {CreateError(document.getElementById('num'), "Неправильно введені дані (Повинні бути цифри)");
        index++;
        break}
        }
        return index;
       }



function CreateError(element, text){
    let span1 = document.createElement("p");
    span1.className='textError';
    span1.style.color = 'cornflowerblue';
    span1.innerHTML = text;
    var parentDiv =element.parentNode;
    parentDiv.insertBefore(span1, element);
}
function DestroyError(){
        let span = document.querySelectorAll('.textError');
            for (let i=0; i<span.length; i++)
            {
                span[i].remove();
            } 
}
function formAddError (input){
    input.parentElement.classList.add('error');
    input.classList.add('_error');
}
function formRemoveError (input){
    input.parentElement.classList.remove('error');
    input.classList.remove('_error');
}