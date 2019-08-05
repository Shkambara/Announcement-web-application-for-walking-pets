var express = require("express");
var router = express.Router();
var mongodb = require('mongodb');
var assert = require('assert');

router.get('/listawpodoban', function (req, res) {
  var user = req.query.user;
  var MongoClient = mongodb.MongoClient;
  var resultArray = [];
  var url = "mongodb://localhost:27017/";
  var posts = [];
  var ogloszenia = [];
  var tmp = [];

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("pet&go");
    var cursor = dbo.collection('users').find({ userName: user });
    cursor.forEach(function (doc, err) {
      if (err) throw err;

      resultArray.push(doc);
      assert.equal(null, err);
    }, function () {
      var cursor2 = dbo.collection('listawpodoban').find({ idUser: resultArray[0]._id });
      cursor2.count(function (err, num) {
        if (err) {
          return console.log(err);
        }
        var s = 0
        cursor2.forEach(function (doc2, err) {
          if (err) throw err;
          assert.equal(null, err);
          tmp.push(doc2);

        }, function () {
          var cursor3 = dbo.collection('ogloszenia').find({});
          cursor3.forEach(function (doc3, err) {
            if (err) throw err;
            assert.equal(null, err);
            ogloszenia.push(doc3);
          }, function () {
            for (var i = s; i < num; i++) {
              ogloszenia.forEach(function (ogl, err) {
                if (tmp[i].idOgloszenie == ogl._id) {
                  console.log("inserted into postst");
                  posts.push(ogl);
                }
              })
            }
            res.render('listawpodoban', { posts: posts });
          })
        });
        return num;
      });
    });
  })
})


router.post('/insertwpodobanie', function (req, res) {
  var MongoClient = mongodb.MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("pet&go");
    var bodyJ = req.body.data;
    var resultArray = [];
    var cursor = dbo.collection("users").find({ userName: bodyJ.user });

    cursor.forEach(function (result, err) {
      if (err) throw err;
      resultArray.push(result);
    }, function () {
      var myobj = { idUser: resultArray[0]._id, idOgloszenie: bodyJ.id };
      dbo.collection("listawpodoban").insertOne(myobj, function (err, result) {
        if (err) err;
        db.close();
      });
    });
  });

});

router.post('/deletewpodobane', function (req, res) {
  var MongoClient = mongodb.MongoClient;


  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("pet&go");
    var bodyJ = req.body.data;
    var resultArray = [];
    var cursor = dbo.collection("users").find({ userName: bodyJ.user });

    cursor.forEach(function (result, err) {
      if (err) throw err;
      resultArray.push(result);
    }, function () {
      var myobj = { idUser: resultArray[0]._id, idOgloszenie: bodyJ.id };

      dbo.collection("listawpodoban").deleteOne(myobj, function (err, result) {
        if (err) err;
        db.close();
        console.log("deleted");
        res.json({ result: true });
      });
    });
  });
});

module.exports = router;