let express = require("express");
let multer = require("multer");
let cors = require("cors");
let cookieParser = require("cookie-parser");
let MongoClient = require("mongodb").MongoClient;
let mongo = require("mongodb");
let app = express();
let upload = multer({
  dest: __dirname + "/uploads/"
});
app.use("/images", express.static(__dirname + "/uploads/"));
app.use(cors({ credentials: true, origin: "http://locahost:3000" }));
app.use(cookieParser());
let url =
  "mongodb+srv://noam:alibay@practice-project-mqqcj.mongodb.net/test?retryWrites=true";

let dbs = undefined;
let db = undefined;
MongoClient.connect(url, { useNewUrlParser: true }, (err, allDbs) => {
  if (err) throw err;
  dbs = allDbs;
  db = dbs.db("alibay");
});

let generateId = () => {
  return "" + Math.floor(Math.random() * 1000000);
};

app.post("/signup", upload.none(), (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  db.collection("users")
    .findOne({ username: username })
    .then(user => {
      console.log(user);
      if (user !== null) {
        res.send(JSON.stringify({ success: false }));
        return;
      }
      db.collection("users").insertOne(
        {
          username: username,
          password: password
        },
        (err, result) => {
          if (err) throw err;
          let sessionId = generateId();
          res.cookie("sid", sessionId);
          db.collection("sessions").insertOne(
            { sessionId: sessionId, username: username },
            (err, result) => {
              if (err) throw err;
            }
          );
          res.send(JSON.stringify({ success: true }));
        }
      );
    });
});

app.post("/login", upload.none(), (req, res) => {
  let username = req.body.username;
  let enteredPassword = req.body.password;
  db.collection("users")
    .findOne({ username: username })
    .then(user => {
      let expectedPassword = user.password;
      if (enteredPassword !== expectedPassword) {
        res.send(JSON.stringify({ success: false }));
        return;
      }
      let sessionId = generateId();
      res.cookie("sid", sessionId);
      db.collection("sessions").insertOne(
        { sessionId: sessionId, username: username },
        (err, result) => {
          if (err) throw err;
          res.send(JSON.stringify({ success: true }));
        }
      );
    });
});

app.get("/coffee", (req, res) => {
  db.collection("coffee-items")
    .find({})
    .toArray((err, result) => {
      if (err) throw err;
      res.send(JSON.stringify({ success: true, coffeeItems: result }));
    });
});

app.get("/tea", (req, res) => {
  db.collection("tea-items")
    .find({})
    .toArray((err, result) => {
      if (err) throw err;
      res.send(JSON.stringify({ success: true, teaItems: result }));
    });
});

app.post("/seller-details", upload.none(), (req, res) => {
  let sellerId = req.body.sellerId;
  let ObjectID = mongo.ObjectID;

  db.collection("users")
    .findOne({ _id: new ObjectID(sellerId) })
    .then(seller => {
      db.collection("tea-items")
        .find({ sellerId: sellerId })
        .toArray((err, resultTea) => {
          if (err) throw err;
          db.collection("coffee-items")
            .find({ sellerId: sellerId })
            .toArray((err, resultCoffee) => {
              if (err) throw err;
              db.collection("reviews-sellers")
                .find({ sellerId: sellerId })
                .toArray((err, resultReviews) => {
                  if (err) throw err;
                  res.send(
                    JSON.stringify({
                      success: true,
                      teaItems: resultTea,
                      coffeeItems: resultCoffee,
                      seller: { username: seller.username, id: seller._id },
                      reviews: resultReviews
                    })
                  );
                });
            });
        });
    });
});

app.post("/item-details-coffee", upload.none(), (req, res) => {
  let itemId = req.body.itemId;
  let sellerId = req.body.sellerId;
  let ObjectID = mongo.ObjectID;

  db.collection("coffee-items")
    .findOne({ _id: new ObjectID(itemId) })
    .then(item => {
      db.collection("users")
        .findOne({ _id: new ObjectID(sellerId) })
        .then(seller => {
          db.collection("reviews-items")
            .find({ itemId: itemId })
            .toArray((err, resultReviews) => {
              if (err) throw err;
              res.send(
                JSON.stringify({
                  success: true,
                  seller: { username: seller.username, id: seller._id },
                  item: item,
                  reviews: resultReviews
                })
              );
            });
        });
    });
});

app.post("/item-details-tea", upload.none(), (req, res) => {
  let itemId = req.body.itemId;
  let sellerId = req.body.sellerId;
  let ObjectID = mongo.ObjectID;

  db.collection("tea-items")
    .findOne({ _id: new ObjectID(itemId) })
    .then(item => {
      db.collection("users")
        .findOne({ _id: new ObjectID(sellerId) })
        .then(seller => {
          db.collection("reviews-items")
            .find({ itemId: itemId })
            .toArray((err, resultReviews) => {
              if (err) throw err;
              res.send(
                JSON.stringify({
                  success: true,
                  seller: { username: seller.username, id: seller._id },
                  item: item,
                  reviews: resultReviews
                })
              );
            });
        });
    });
});

app.post("/add-item-tea", upload.none(), (req, res) => {
  let sessionId = req.cookies.sid;
  db.collection("sessions")
    .findOne({ sessionId: sessionId })
    .then(user => {
      let username = user.username;
      db.collection("users")
        .findOne({ username: username })
        .then(seller => {
          let itemName = req.body.name;
          let itemPrice = req.body.price;
          let itemDesc = req.body.desc;
          let quantity = req.body.quantity;
          let sellerId = seller._id;
          let file = req.file;
          let imagePath = "http://localhost:4000/images/" + file.filename;

          db.collection("tea-items").insertOne(
            {
              name: itemName,
              price: itemPrice,
              description: itemDesc,
              quantity: quantity,
              image: imagePath,
              sellerId: sellerId
            },
            (err, result) => {
              if (err) throw err;
              res.send(JSON.stringify({ success: true }));
            }
          );
        });
    });
});

app.post("/add-item-coffee", upload.none(), (req, res) => {
  let sessionId = req.cookies.sid;
  db.collection("sessions")
    .findOne({ sessionId: sessionId })
    .then(user => {
      let username = user.username;
      db.collection("users")
        .findOne({ username: username })
        .then(seller => {
          let itemName = req.body.name;
          let itemPrice = req.body.price;
          let itemDesc = req.body.desc;
          let quantity = req.body.quantity;
          let sellerId = seller._id;
          let file = req.file;
          let imagePath = "http://localhost:4000/images/" + file.filename;

          db.collection("coffee-items").insertOne(
            {
              name: itemName,
              price: itemPrice,
              description: itemDesc,
              quantity: quantity,
              image: imagePath,
              sellerId: sellerId
            },
            (err, result) => {
              if (err) throw err;
              res.send(JSON.stringify({ success: true }));
            }
          );
        });
    });
});

app.get("/search-item-coffee", (req, res) => {
  let search = req.query.search;
  let regexSearch = new RegExp(search);
  db.collection("coffee-items")
    .find({
      $or: [
        { description: { $regex: regexSearch } },
        { name: { $regex: regexSearch } }
      ]
    })
    .toArray((err, result) => {
      if (err) throw err;
      res.send(JSON.stringify({ success: true, items: result }));
    });
});

app.get("/search-item-tea", (req, res) => {
  let search = req.query.search;
  let regexSearch = new RegExp(search);
  db.collection("tea-items")
    .find({
      $or: [
        { description: { $regex: regexSearch } },
        { name: { $regex: regexSearch } }
      ]
    })
    .toArray((err, result) => {
      if (err) throw err;
      res.send(JSON.stringify({ success: true, items: result }));
    });
});

// app.post("/buy-item", upload.none(), (req, res) => {});

app.post("/add-review-seller", upload.none(), (req, res) => {
  let sessionId = req.cookies.sid;
  let sellerId = req.body.sellerId;
  let review = req.body.review;
  db.collection("sessions")
    .findOne({ sessionId: sessionId })
    .then(user => {
      let username = user.username;
      db.collection("users")
        .findOne({ username: username })
        .then(reviewer => {
          db.collection("reviews-sellers").insertOne(
            {
              review: review,
              reviewer: { name: reviewer.username, id: reviewer._id },
              sellerId: sellerId
            },
            (err, result) => {
              if (err) throw err;
              res.send(JSON.stringify({ success: true }));
            }
          );
        });
    });
});

app.post("/add-review-item", upload.none(), (req, res) => {
  let sessionId = req.cookies.sid;
  let itemId = req.body.itemId;
  let review = req.body.review;
  db.collection("sessions")
    .findOne({ sessionId: sessionId })
    .then(user => {
      let username = user.username;
      db.collection("users")
        .findOne({ username: username })
        .then(reviewer => {
          db.collection("reviews-items").insertOne(
            {
              review: review,
              reviewer: { name: reviewer.username, id: reviewer._id },
              itemId: itemId
            },
            (err, result) => {
              if (err) throw err;
              res.send(JSON.stringify({ success: true }));
            }
          );
        });
    });
});

// app.post("/add-to-cart-coffee", upload.none(), (req, res) => {
//   let itemId = req.body.itemId;
//   let ObjectID = mongo.ObjectID;

//   db.collection("coffee-items")
//     .findOne({ _id: new ObjectID(itemId) })
//     .then(item => {
//       db.collection("cart").insertOne({ item });
//     });
// });

app.listen(4000);
