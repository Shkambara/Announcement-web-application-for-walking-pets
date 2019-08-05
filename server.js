const express = require('express');
const app = express();
var path = require("path");
const bodyParser = require('body-parser');

var index = require("./routes/index");
var ogloszenie = require("./routes/ogloszenie");
var wpodobane = require("./routes/wpodobane");
var indexLoggedin = require("./routes/indexLoggedin");
var myprofile = require("./routes/myprofile");


app.set('view engine', 'ejs');

var mongodb = require('mongodb');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

const server = app.listen(7000, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

app.use('/', index);
app.use('/ogloszenie',ogloszenie)
app.use('/myprofile/wpodobane',wpodobane)
app.use('/loginuser', indexLoggedin)
app.use('/myprofile', myprofile)

app.get('/login', function (req, res) {

  res.sendFile(path.join(__dirname + '/views/login.ejs'));
});

app.get('/register', function (req, res) {

  res.sendFile(path.join(__dirname + '/register.html'));
});

app.post('/insert', function (req, res) {
  var MongoClient = mongodb.MongoClient;

  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;

    var dbo = db.db("pet&go");
    var bodyJ = req.body.data;
    var myobj = { userName: bodyJ.username, Name: bodyJ.imie, Surname: bodyJ.nazwisko, Miasto: bodyJ.miasto, password: bodyJ.password, pesel: bodyJ.pesel, dataurodzenia: bodyJ.data, Telefon: bodyJ.telephone, Email: bodyJ.email };

    dbo.collection("users").find({ userName: myobj.userName }).toArray(function (err, doc) {
      if (err) throw err;
      if (doc.length == 0) {

        dbo.collection("users").insertOne(myobj, function (err, result) {
          if (err) throw err;
          console.log("1 document inserted");
          res.json({ result: true });
          db.close();
        });   
      }
    });
  });
});


app.post('/loginUser', function (req, res) {

  var MongoClient = mongodb.MongoClient;
  var json = req.body.data;
  var username = json.username;
  var password = json.password;
  password = password + "";
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, function (err, db) {
    logedIn = false;
    if (err) throw err;
    var dbo = db.db("pet&go");
    var myobj = { userName: username };

    dbo.collection('users').find(myobj).toArray(function (err, doc) {
      if (err) throw err;
      if (doc.length > 0) {
        if (doc[0].password == password) {
          res.json({ result: true });
          db.close();
        } else {
          res.json({ result: false });
          db.close();
        }
      } else {
        res.json({ result: false });
      }
    });
  });
})
