const express = require("express");
const app = express();
const cors = require("cors");
const { ObjectId } = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// MongoDatabase connection
const url = process.env.URL;
const connection = MongoClient.connect(url);
const db = connection.then((data) => {
  return data.db("Expenses");
});

// Cloudinary connection
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
  secure: true,
});
const getFolder = cloudinary.api.resources({
  type: "upload",
  max_results: 20,
  prefix: process.env.PREFIX,
});

app.get("/collections", (req, res) => {
  db.then((database) => {
    database.listCollections().toArray(function (err, collInfos) {
      res.send(collInfos);
    });
  });
});

app.post("/eachCollectionData", (req, res) => {
  const names = req.body;
  db.then((database) => {
    database
      .collection(names.collection)
      .find({})
      .toArray(function (err, userdata) {
        if (err) {
          res.send({ err: err });
        } else {
          if (userdata.length <= 0) {
            res.send({ err: "error" });
          } else {
            res.send(userdata);
          }
        }
      });
  });
});

app.post("/create", (req, res) => {
  console.log(req.body);
  const data = req.body;
  const myobj = {
    FullName: data.Full_name,
    Email: data.Email,
    Phone: data.Phone,
    Password: data.Password,
    Image:
      "https://res.cloudinary.com/shubham4538/image/upload/v1655829691/React-bank/Blank/blank-profile_b5is0b.png",
    Details: {},
  };
  db.then((database) => {
    database.collection(data.Username).insertOne(myobj, (err, result) => {
      if (err) {
        res.send({ err: err, id: 1 });
      } else {
        database
          .collection(data.Username)
          .find({})
          .toArray(function (err, singleData) {
            if (err) {
              res.send({ err: err, id: 2 });
            } else {
              res.send({ userData: singleData });
            }
          });
      }
    });
  });
});

app.post("/login", (req, res) => {
  const collectionName = req.body.Username;
  const collectionPassword = req.body.Password;
  db.then((database) => {
    database
      .listCollections({ name: collectionName })
      .next(function (err, collinfo) {
        if (!collinfo) {
          res.send({ notExists: "Not such Username found !!!" });
          console.log("Username not found");
        } else {
          database
            .collection(collectionName)
            .find({})
            .toArray(function (err, userdata) {
              if (collectionPassword != userdata[0].Password) {
                res.send({ notPassword: "Incorrect password !!!" });
                console.log("Wrong password");
              } else {
                res.send("login");
                console.log(userdata[0].Password);
                console.log("login");
              }
            });
        }
      });
  });
});

app.post("/addData", (req, res) => {
  console.log(req.body);
  const year = new Date(req.body.Date).getFullYear();
  const query = `Details.${req.body.Type}.${year}`;
  db.then((database) => {
    database.collection(req.body.Username).updateOne(
      {
        FullName: req.body.Fullname,
      },
      {
        $push: {
          [query]: {
            _id: ObjectId(),
            time: req.body.Date,
            description: req.body.Description,
            category: req.body.Category,
            amount: parseInt(req.body.Amount),
          },
        },
      },
      (err, result) => {
        if (err) {
          res.send({ err: err, id: 2 });
        } else {
          res.send({ success: result });
        }
      }
    );
  });
});

app.post("/addEvent", (req, res) => {
  // console.log(req.body);
  db.then((database) => {
    database.collection(req.body.username).updateOne(
      { FullName: req.body.fullname },
      {
        $push: {
          Events: {
            _id: ObjectId(),
            title: req.body.title,
            start: req.body.start,
            end: req.body.end,
          },
        },
      },
      (err, result) => {
        if (err) {
          res.send({ err: err });
        } else {
          res.send({ result: result });
        }
      }
    );
  });
});

app.delete("/deleteEvent:id", (req, res) => {
  const _id = new ObjectId(req.params.id);
  db.then((database) => {
    database.collection(req.body.username).updateOne(
      { FullName: req.body.fullname },
      {
        $pull: {
          Events: {
            _id: _id,
          },
        },
      },
      (err, result) => {
        if (err) {
          res.send({ err: err });
        } else {
          res.send({ result: result });
        }
      }
    );
  });
});

app.post("/update", (req, res) => {
  console.log(req.body);
  const _id = new ObjectId(req.body.id);
  const updateQuery = `Details.${req.body.type}.${req.body.year}`;
  const dataToSend = {
    _id: _id,
    time: req.body.Date,
    description: req.body.Description,
    category: req.body.Category,
    amount: parseInt(req.body.Amount),
  };
  db.then((database) => {
    database.collection(req.body.username).updateOne(
      {
        [`${updateQuery}._id`]: _id,
      },
      { $set: { [`${updateQuery}.$`]: dataToSend } },
      // false,
      // true,
      (err, result) => {
        console.log(err, result);
        res.send({ success: result });
      }
    );
  });
});

app.delete("/delete:id", (req, res) => {
  console.log(req.body);
  console.log(req.params.id);
  const _id = new ObjectId(req.params.id);
  const userid = new ObjectId(req.body.userId);
  const delquery = `Details.${req.body.type}`;
  const query = `Details.${req.body.type}.${req.body.year}`;
  const newquery = `Details.${req.body.type}.${req.body.year}.0`;
  console.log(query);

  db.then((database) => {
    database.collection(req.body.username).updateOne(
      { _id: userid },
      {
        $pull: {
          [query]: {
            _id: _id,
          },
        },
      },
      (err, result) => {
        if (err) {
          console.log(err, 1);
        } else {
          console.log(result, "data removed");
          res.send({ success: "Data removed!" });
          database
            .collection(req.body.username)
            .findOne({ [newquery]: { $exists: true } }, (err, result) => {
              if (err) {
                console.log(err, 3);
              } else {
                console.log(result, "main");
                if (result == null) {
                  database.collection(req.body.username).findOneAndUpdate(
                    { _id: userid },
                    {
                      $unset: {
                        [query]: 1,
                      },
                    },
                    (err, result) => {
                      if (err) {
                        console.log(err, 4);
                      } else {
                        console.log(result, "final");
                        if (
                          Object.keys(result.value.Details[req.body.type])
                            .length == 1
                        ) {
                          database.collection(req.body.username).updateOne(
                            { _id: userid },
                            {
                              $unset: {
                                [delquery]: 1,
                              },
                            },
                            (err, result) => {}
                          );
                        }
                      }
                    }
                  );
                }
              }
            });
        }
      }
    );
  });
});

app.get("/imageFiles", (req, res) => {
  getFolder.then((result, error) => {
    // res.writeHead({ "Content-Type": "text/json" });
    res.setHeader("Content-Type", "application/json");
    res.send(result);
  });
});

app.post("/changePersonal", (req, res) => {
  db.then((database) => {
    database.collection(req.body.OldUser).updateOne(
      { FullName: req.body.OldName },
      {
        $set: { FullName: req.body.Fullname, Email: req.body.Email },
      },
      (err, result) => {
        if (err) {
          res.send({ err: err });
        } else {
          res.send({ result: result });
        }
      }
    );
  });
  db.then((database) => {
    database.collection(req.body.OldUser).rename(req.body.Username);
  });
});

const imageChange = (req, value, callback) => {
  db.then((database) => {
    database.collection(req.body.user).updateOne(
      {
        FullName: req.body.fullName,
      },
      { $set: { Image: value } },
      (err, result) => {
        if (err) {
          console.log(err);
          return callback(err, null);
        } else {
          return callback(null, result);
        }
      }
    );
  });
};

app.post("/imageUpdate", (req, res) => {
  cloudinary.uploader.upload(
    req.body.base,
    { folder: "User-profiles" },
    (err, result) => {
      if (err) {
        console.log(err, "err");
        res.send({ error: "Try again :(" });
      } else {
        console.log(result, "res");
        imageChange(req, result.secure_url, (err, result) => {
          if (err) {
            res.send({ error: "Try again :(" });
          } else {
            res.send({ success: "Updated!" });
          }
        });
      }
    }
  );
});

app.post("/password", (req, res) => {
  db.then((database) => {
    database
      .collection(req.body.Username)
      .updateOne(
        { FullName: req.body.FullName },
        { $set: { Password: req.body.Newpass } },
        (err, result) => {
          if (err) {
            res.send({ err: err });
          } else {
            res.send({ result: result });
          }
        }
      );
  });
});

app.post("/setting", (req, res) => {
  console.log(req.body);
  imageChange(req, req.body.value, (err, result) => {
    if (err) {
      res.send({ error: "Try again :(" });
    } else {
      console.log("SUcess");
      res.send({ success: "Updated!" });
    }
  });
});

app.listen(port, () => {
  console.log("Running on Port 3001");
});
