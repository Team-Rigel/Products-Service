const express = require("express");
const path = require("path");
const axios = require("axios");
const bodyparser = require("body-parser");
const morgan = require("morgan");
const port = 3000;
const app = express();
app.use(morgan("dev"));
app.use(bodyparser.json());

const db = require("./db/");

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

//TODO: Test GET
// let productId = 1;
// let product = { product_id: productId, results: [] };
// db.query(
//   `SELECT "style_id", "name", "original_price", "sale_price", "default?" FROM styles WHERE product_id = ${productId} ORDER BY style_id ASC`
// )
//   .then(({ rows }) => {
//     Promise.resolve(
//       rows.forEach((item) => {
//         item.photos = [];
//         item.skus = {};
//         Promise.all([
//           db
//             .query(`SELECT * FROM photos WHERE style_id = ${item.style_id}`)
//             .then((res) => {
//               res.rows.forEach((photo) => {
//                 item.photos.push({
//                   thumbnail_url: photo.thumbnail_url,
//                   url: photo.url,
//                 });
//               });
//             })
//             .catch((err) => {
//               console.log(err.stack);
//               res.sendStatus(500);
//             }),
//           db
//             .query(
//               `SELECT "size", "quantity" FROM skus WHERE "styleId" = ${item.style_id}`
//             )
//             .then(({ rows }) => {
//               let obj = {};
//               rows.forEach((item) => {
//                 obj[item.size] = item.quantity;
//               });
//               item.skus = obj;
//             })
//             .catch((err) => {
//               console.log(err.stack);
//               res.sendStatus(500);
//             }),
//         ])
//           .then(() => {
//             product.results.push(item);
//           })
//           .catch((err) => {
//             console.log(err.stack);
//           });
//       })
//     ).then(() => {
//       setTimeout(() => {
//         console.log(product);
//       }, 1000);
//     });
//   })
//   .catch((err) => {
//     console.log(err.stack);
//     res.sendStatus(500);
//   });

//ROUTES
app.get("/products/list", (req, res) => {
  const page = req.params.page;
  const count = 5 || req.params.count;

  db.query(`SELECT * FROM product_list LIMIT ${count}`)
    .then(({ rows }) => {
      console.log(rows);
      res.send(rows);
    })
    .catch((err) => {
      console.log(err.stack);
      res.sendStatus(500);
    });
});

app.get("/products/:product_id", (req, res) => {
  let product = req.params.product_id;

  db.query(`SELECT * FROM product_list WHERE id = ${product}`)
    .then(({ rows }) => {
      obj = rows[0];
      obj.features = [];
      db.query(`SELECT * FROM features WHERE product_id = ${product}`)
        .then(({ rows }) => {
          rows.map((feature) => {
            let obj2 = { feature: feature.feature, value: feature.value };
            console.log(obj2);
            return obj.features.push(obj2);
          });
        })
        .then(() => {
          res.send(obj);
        })
        .catch((err) => {
          console.log(err.stack);
          res.sendStatus(500);
        });
    })
    .catch((err) => {
      console.log(err.stack);
      res.sendStatus(500);
    });
});

app.get("/products/:product_id/styles", (req, res) => {
  console.log(req.params);
  let productId = req.params.product_id;
  let product = { product_id: productId, results: [] };

  db.query(
    `SELECT "style_id", "name", "original_price", "sale_price", "default?" FROM styles WHERE product_id = ${productId} ORDER BY style_id ASC`
  )
    .then(({ rows }) => {
      Promise.resolve(
        rows.forEach((item) => {
          item.photos = [];
          item.skus = {};
          Promise.all([
            db
              .query(`SELECT * FROM photos WHERE style_id = ${item.style_id}`)
              .then((res) => {
                res.rows.forEach((photo) => {
                  item.photos.push({
                    thumbnail_url: photo.thumbnail_url,
                    url: photo.url,
                  });
                });
              })
              .catch((err) => {
                console.log(err.stack);
                res.sendStatus(500);
              }),
            db
              .query(
                `SELECT "size", "quantity" FROM skus WHERE "styleId" = ${item.style_id}`
              )
              .then(({ rows }) => {
                let obj = {};
                rows.forEach((item) => {
                  obj[item.size] = item.quantity;
                });
                item.skus = obj;
              })
              .catch((err) => {
                console.log(err.stack);
                res.sendStatus(500);
              }),
          ])
            .then(() => {
              product.results.push(item);
            })
            .catch((err) => {
              console.log(err.stack);
            });
        })
      ).then(() => {
        setTimeout(() => {
          console.log(product);
          res.send(product);
        }, 1000);
      });
    })
    .catch((err) => {
      console.log(err.stack);
      res.sendStatus(500);
    });
});