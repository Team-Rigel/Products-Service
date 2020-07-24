const express = require("express");
const path = require("path");
const axios = require("axios");
const bodyparser = require("body-parser");
const morgan = require("morgan");
const port = 8800;
const app = express();
app.use(morgan("dev"));
app.use(bodyparser.json());

const db = require("./db/");

// const { Pool, Client } = require("pg");
// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "greenfield-products",
//   password: "student",
//   port: "5432",
// });

// pool.query("SELECT * FROM product_list WHERE id = 1", (err, res) => {
//   let obj = res.rows[0];
//   obj.features = [];
//   if (err) {
//     console.log(err);
//   }
//   console.log(obj);
//   pool.end();
// });

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

//TODO: Test GET product
// let testProd = 1;
// let obj;
// db.query(`SELECT * FROM product_list WHERE id = ${testProd}`)
//   .then((res) => {
//     obj = res.rows[0];
//     obj.features = [];
//     db.query(`SELECT * FROM features WHERE product_id = ${testProd}`)
//       .then(({ rows }) => {
//         rows.map((feature) => {
//           let obj2 = { feature: feature.feature, value: feature.value };
//           return obj.features.push(obj2);
//         });
//       })
//       .then(() => {
//         console.log(obj);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   })
//   .catch((err) => {
//     console.log(err);
//   });

//TODO: Test GET styles
let productId = 1;
let product = { product_id: productId, results: [] };
db.query(
  `SELECT "style_id", "name", "original_price", "sale_price", "default?" FROM styles WHERE product_id = ${productId}`
)
  .then((res) => {
    res.rows.forEach((item) => {
      product.results.push(item);
    });
    // console.log(res)
  })
  .then(() => {
    console.log(product);
  })
  .catch((err) => {
    console.log(err);
  });

//ROUTES
app.get("/products/list", (req, res) => {
  const page = req.params.page;
  const count = req.params.count;
  db.query("SELECT * FROM product_list LIMIT 5")
    .then((rows) => {
      res.send(rows);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    });
});

app.get("/products/:product_id", (req, res) => {
  let product = req.params.product_id;

  db.query(`SELECT * FROM product_list WHERE id = ${product}`)
    .then((res) => {
      obj = res.rows[0];
      obj.features = [];
      db.query(`SELECT * FROM features WHERE product_id = ${testProd}`)
        .then(({ rows }) => {
          rows.map((feature) => {
            let obj2 = { feature: feature.feature, value: feature.value };
            return obj.features.push(obj2);
          });
        })
        .then(() => {
          console.log(obj);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/products/:product_id/styles", (req, res) => {
  let productId = req.params.product_id;
  let product = { product_id: productId, results: [] };

  db.query(
    `SELECT "style_id", "name", "sale_price", "original_price", "default?" FROM styles WHERE product_id = ${productId}`
  )
    .then((res) => {
      res.rows.forEach((item) => {
        product.results.push(item);
      });
      // console.log(res)
    })
    .then(() => {
      console.log(product);
    })
    .catch((err) => {
      console.log(err);
    });
});
