let i=0
let maxIdProduct = 0;

////Creating table of products
const TABLE = document.getElementById('data-table');
function createTable(){
    fetch('http://localhost:1598/getAllProd')
.then(response => response.json())
.then(data => {
    maxIdProduct = data.length;
    const tableBody = document.getElementById('data-table').getElementsByTagName('tbody')[0];
    data.forEach(item => {
        const row = tableBody.insertRow();
        const cellId = row.insertCell(0);
        const cellName = row.insertCell(1);
        const cellDepart = row.insertCell(2);
        const cellPicture = row.insertCell(3);
        const cellDescription = row.insertCell(4);
        const cellQuantity = row.insertCell(5);
        const cellPrice = row.insertCell(6);

        cellId.textContent = item.id_product;
        cellName.textContent = item.name_of_product;
        cellDepart.textContent = item.id_department;
        cellPicture.textContent  = item.pictures;
        cellDescription.textContent  = item.description;
        cellQuantity.textContent  = item.quantity;
        cellPrice.textContent  = item.price;
    });
})
.catch(error => console.error('Помилка отримання даних:', error));
}
createTable();

//delete table
function deleteTable() {
    const tableBody = TABLE.getElementsByTagName('tbody')[0];
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }
}
//Enable form to add
const BtnAddInUp = document.getElementById('BtnAddInUp');
let carass_addNew = document.querySelector('.carcass_administration_body_addNew');
let h2_list = document.getElementById('h2_list');
BtnAddInUp.addEventListener('click', ()=>{
    HideTable ()
    carass_addNew.classList.add('_active');
})

//Enable form to change
const BtnChangeInUp = document.getElementById('BtnChangeInUp');
let carass_changeMain =document.querySelector('.carcass_administration_body_changeMain');
BtnChangeInUp.addEventListener('click', ()=>{
    HideTable ()
    carass_changeMain.classList.add('_active');
})

//Enable form to remove
const BtnRemoveInUp = document.getElementById('BtnRemoveInUp');
let carass_remove = document.querySelector('.carcass_administration_body_remove');
BtnRemoveInUp.addEventListener('click', ()=>{
    HideTable ();
    carass_remove.classList.add('_active');
})

//Hide table, h2, all forms
function HideTable (){
    TABLE.classList.add('_hidden');
    h2_list.classList.add('_hidden');
    carass_addNew.classList.remove('_active');
    carass_changeMain.classList.remove('_active');
    carass_remove.classList.remove('_active');
}

// Function to add form
const  BtnAddInDown = document.getElementById('BtnAddInDown');
BtnAddInDown.addEventListener('click', (event)=>{
    event.preventDefault();
    let NewProduct = {
        name:document.getElementById('name').value,
        id_department:document.getElementById('department-code').value,
        picture:document.getElementById('image').value,
        description:document.getElementById('description').value,
        quantity:document.getElementById('quantity').value,
        price:document.getElementById('price').value
    }
    //.console.log(NewProduct); 
    if(NewProduct.name == ''|| NewProduct.id_department== '' || NewProduct.description == ''|| NewProduct.picture == ''|| NewProduct.quantity == ''|| NewProduct.price == ''){
        alert("Всі поля мають бути запонені");
        return;
    }     
    //fetch(`http://localhost:1598/addNewProduct?name=${NewProduct.name}&id_department=${NewProduct.id_department}&pictures=${NewProduct.picture}
    //&description=${NewProduct.description}&quantity=${NewProduct.quantity}&price=${NewProduct.price}`)
    //.then((response) => {return response.json();})
    alert("Запис успішно зроблено");
    let formAdd =document.getElementById('formAdd');
    formAdd.reset();
    HideTable ();
    deleteTable();
    createTable();
    h2_list.classList.remove('_hidden');
    TABLE.classList.remove('_hidden');
})

//take id from label and fill from BD other layers
function checkId() {
    let id = document.getElementById('id_products_change').value;
    if (id > 0 && id <= maxIdProduct) {
        fetch(`http://localhost:1598/getProductById?id=${id}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                document.getElementById('name_change').value = data.name_of_product;
                document.getElementById('department-code_change').value = data.id_department;
                document.getElementById('image_change').value = data.pictures;
                document.getElementById('description_change').value = data.description;
                document.getElementById('quantity_change').value = data.quantity;
                document.getElementById('price_change').value = data.price;
                old=document.getElementById('department-code_change').value;
            })
            .catch((error) => {
                console.error('Fetch error:', error);
            });
    }
    else{
        document.getElementById('name_change').value = null;
        document.getElementById('department-code_change').value = null;
        document.getElementById('image_change').value = null;
        document.getElementById('description_change').value = null;
        document.getElementById('quantity_change').value = null;
        document.getElementById('price_change').value = null;
    }
}

// function to change form
const BtnChangeInDown = document.getElementById('BtnChangeInDown');
let label = document.getElementById('id_products_change');
let id = 0;
let old=0;
label.addEventListener('input', checkId);
BtnChangeInDown.addEventListener('click', (event)=>{
    event.preventDefault();
    id = document.getElementById('id_products_change').value;
    let NewProduct = {
        name:document.getElementById('name_change').value,
        id_department:document.getElementById('department-code_change').value,
        picture:document.getElementById('image_change').value,
        description:document.getElementById('description_change').value,
        quantity:document.getElementById('quantity_change').value,
        price:document.getElementById('price_change').value
    }
    //http://localhost:1598/changeData?id=26&name=%D0%A0%D0%B8%D0%B1%D0%B0&id_departmentNew=5&id_departmentOld=5&pictures=123&description=10&quantity=100&price=100
    //fetch(`http://localhost:1598/changeData?id=${id}&name=${NewProduct.name}&id_departmentNew=${NewProduct.id_department}&id_departmentOld=${old}&pictures=${NewProduct.picture}
    //&description=${NewProduct.description}&quantity=${NewProduct.quantity}&price=${NewProduct.price}`);
    alert("Запис з ID: "+id + " успішно видозмінено");
    let formformChange =document.getElementById('formChange');
    formformChange.reset();
    HideTable();
    deleteTable();
    createTable();
    h2_list.classList.remove('_hidden');
    TABLE.classList.remove('_hidden');
})

//function to remove form
const BtnRemoveInDown = document.getElementById('BtnRemoveInDown');
BtnRemoveInDown.addEventListener('click', ()=>{
    let removeLabel = document.getElementById('id_products_remove').value;
    console.log(removeLabel);
    console.log(maxIdProduct);
    if (removeLabel > 0 && removeLabel<= maxIdProduct){
    //fetch(`http://localhost:1598/deleteProduct?id=${removeLabel}`);
    alert("Запис з ID: "+ removeLabel + " успішно видалено");
    let formRemove =document.getElementById('formRemove');
    formRemove.reset();
    HideTable();
    deleteTable();
    createTable();
    h2_list.classList.remove('_hidden');
    TABLE.classList.remove('_hidden');
    }
    else {alert("Запис з ID: "+ removeLabel + " не існує")};
    
})