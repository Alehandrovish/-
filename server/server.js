import express, { response } from "express";
import mysql from "mysql2/promise";
import cors from "cors";

const app = express();
const port = 1598;

var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'mylittleshop'
});

app.use(cors());

app.use(
    '/getProducts',
    async (req, res) => {
        (await connection).query('SELECT * FROM products ORDER BY name_of_product;')
        .then (response => {
            res.send(response[0]);

        })
    }
);
app.use(
    '/searchProduct',
    async (req, res) => {
        const { name } = req.query; 
        const search = (typeof name === 'undefined') ? "" : name;
        (await connection).query(`SELECT * FROM products WHERE name_of_product LIKE '%${search}%' ORDER BY name_of_product;`)
        .then (response => {
            res.send(response[0]);

        })
    }
);
app.use(
  '/toCart',
  async (req, res) => {
    const { ids } = req.query;
    let search = (typeof ids === 'undefined' || ids == '') ? "-1" : ids;
    (await connection).query(`SELECT * FROM products WHERE products.id_product IN (${search})`)
    .then (async (response) =>{
      res.send(response[0]);
    })
  }
);
app.use(
  '/getLastIdOrder',
  async (req, res) => {
    (await connection).query('SELECT id_order FROM orders ORDER BY  id_order DESC LIMIT 1;')
    .then (response => {
        res.send(response[0]);

    })
}
);
app.use(
  '/getInfoOrder',
  async(req, res) =>{
    const {id} = req.query;
    (await connection).query(`SELECT name_of_product, price, orders.quantity, name_of_client, number_of_phone, type_delivery, id_address_selfPickup, comment, time_delivery, order_price FROM orders JOIN products ON products.id_product = orders.id_product JOIN type_delivery ON type_delivery.id_type_delivery = orders.id_type_delivery WHERE orders.id_order = ${id};`)
    .then (response =>{
      res.send(response[0]);
    })
  }
)
app.use(
    '/addOrder',
    async (req, res) => {
    var {name, phone_number, delivery_type, address, id_selfPickup, comment, content, time, price} = req.query;
    if(delivery_type == 1){
        id_selfPickup ="NULL";
    } else if (delivery_type == 2){
        address = "NULL";
    }
    //http://localhost:1598/addOrder?name=Sanek&phone_number=88005553535&delivery_type=1&address=st.%20Kozaczka&id_selfPickup=&comment=test&content=[{%22id%22:1,%20%22quantity%22:2}, {"id":3,"quantity":5}, {"id":5,"quantity":10}]
    const parsedContent = JSON.parse(content);
    const productIds = parsedContent.map(item => item.id);
    const amounts = parsedContent.map(item => item.quantity);
    var orderId;
    (await connection).beginTransaction();
    
    try {
      if(productIds.length == 1){
        console.log("add one");
        (await connection).query(`INSERT INTO orders (id_product, quantity, name_of_client, number_of_phone, id_type_delivery, address_delivery, id_address_selfPickup, comment, time_delivery, order_price) 
                VALUES (${productIds[0]}, ${amounts[0]}, "${name}", '${phone_number}', ${delivery_type}, '${address}', ${id_selfPickup}, '${comment}', '${time}', '${price}')`)
        .catch(async error => {
          (await connection).rollback();
          console.log(error);
        })
      } else {
        console.log("add more");
        (await connection).query(`INSERT INTO orders (id_product, quantity, name_of_client, number_of_phone, id_type_delivery, address_delivery, id_address_selfPickup, comment, time_delivery, order_price) 
                VALUES (${productIds[0]}, ${amounts[0]}, "${name}", '${phone_number}', ${delivery_type}, '${address}', ${id_selfPickup}, '${comment}', '${time}', '${price}')`)
        .then( value => {
          orderId = value[0].insertId;
        })
        .then(async () => {
          for(let i=1; i<productIds.length; i++){
            (await connection).query(`INSERT INTO orders (id_order, id_product, quantity, name_of_client, number_of_phone, id_type_delivery, address_delivery, id_address_selfPickup, comment, time_delivery, order_price) 
                VALUES (${orderId}, ${productIds[i]}, ${amounts[i]}, "${name}", '${phone_number}', ${delivery_type}, '${address}', ${id_selfPickup}, '${comment}', '${time}', '${price}')`)
            .catch(async error => {
              (await connection).rollback();
              console.log(error);
            })
          }
        })
        .catch(async error => {
          (await connection).rollback();
          console.log(error);
        })
      }
    } catch (error) {
      console.log(error);
      (await connection).rollback();
    }
  
    (await connection).commit();
    res.status(200).json({ orderId });
  });
  app.use(
    '/getAllProd',
    async (req, res) => {
        (await connection).query('SELECT * FROM products ORDER BY id_product;')
        .then (response => {
            res.send(response[0]);
  
        })
    }
  );
  app.use(
    '/addNewProduct',
    async (req, res) =>{
      var {name, id_department, pictures, description, quantity, price} = req.query;
      (await connection).query(`INSERT INTO products (name_of_product, id_department, pictures, description, quantity, price)
      values ('${name}', '${id_department}', '${pictures}', '${description}', '${quantity}', '${price}')`)
      .catch(async error => {
        console.log(error);
    }
  )
});
app.use('/getProductById', 
async (req, res) => {
  try {
      const { id } = req.query;

      const [rows] = await (await connection).query(`SELECT * FROM products WHERE id_product = ?`, [id]);

      res.json(rows[0]);
  } catch (error) {
      console.error(error);
  }
});
app.use(
  '/changeData',
  async (req, res) =>{
    var {id, name, id_departmentNew, id_departmentOld, pictures, description, quantity, price} = req.query;
    (await connection).query(`UPDATE products SET name_of_product='${name}', id_department='${id_departmentNew}', pictures='${pictures}', 
    description='${description}', quantity='${quantity}', price='${price}' WHERE  id_product= '${id}' AND id_department='${id_departmentOld}'`)
    .catch(async error => {
      console.log(error);
  }
)
});
app.use(
  '/deleteProduct',
  async (req, res) =>{
    var {id} = req.query;
    (await connection).query(`DELETE FROM products WHERE products.id_product=${id};`)
    .catch(async error => {
      console.log(error);
  }
)
});

app.listen(port);
console.log("server is run");