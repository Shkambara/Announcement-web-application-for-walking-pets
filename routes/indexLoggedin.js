var express = require("express");
var router = express.Router();
var mongodb = require('mongodb');
var assert = require('assert');
var ObjectID = require('mongodb').ObjectID

router.get('/indexLoggedin', function (req, res) {

    var MongoClient = mongodb.MongoClient;
    var user = req.query.user;

    var url = "mongodb://localhost:27017/";
    var posts = [];
    var userArray = [];
    MongoClient.connect(url, function (err, db) {

        if (err) throw err;
        var dbo = db.db("pet&go");
        var cursor = dbo.collection('users').find({ userName: user });
        cursor.forEach(function (doc, err) {
            if (err) throw err;
            userArray.push(doc);
            assert.equal(null, err);
        }, function () {

            var cursor2 = dbo.collection('ogloszenia').find({});
            cursor2.count(function (err, num) {
                if (err) {
                    return console.log(err);
                }
                var s = 0
                cursor2.forEach(function (doc, err) {

                    if (err) { throw err; }
                    assert.equal(null, err);
                    doc.wpodobane = false;
                    posts.push(doc);
                }, function () {

                    var listawpodoban = [];
                    var cursor3 = dbo.collection('listawpodoban').find({})
                    cursor3.forEach(function (doc3, err) {
                        if (err) throw err;
                        listawpodoban.push(doc3);

                    }, function () {

                        for (var i = s; i < num; i++) {
                            listawpodoban.forEach(function (list, err) {
                                if ((list.idOgloszenie == posts[i]._id) && (list.idUser == userArray[0]._id + "")) {
                                    posts[i].wpodobane = true;

                                }

                            })
                        }
                        db.close();
                        res.render('indexLoggedin', { posts: posts })
                    })
                });
                return num;
            });

        });
    });
});

router.get('/dodanieOgloszenia', function (req, res) {
    var user = req.query.user;
    if (user != null) {
        var MongoClient = mongodb.MongoClient;

        var url = "mongodb://localhost:27017/";

        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("pet&go");

            dbo.collection("users").find({ userName: user }).toArray(function (err, doc) {
                if (err) throw err;
                res.render('dodanieOgloszenia', { doc: doc[0] });
                db.close()
            });
        });
    } else {

        res.render('dodanieOgloszenia', { doc: { miasto: "", Telefon: "" } });
    }
});

router.get('/daneOsobowe', function (req, res) {
    var user = req.query.user;

    var MongoClient = mongodb.MongoClient;
    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("pet&go");

        dbo.collection("users").find({ userName: user }).toArray(function (err, doc) {
            if (err) throw err;
            res.render('daneOsobowe', { doc: doc[0] });
            db.close();
        });
    });
});

router.get('/ogloszenieLoggedin', function (req, res) {

    var id = req.query.id;
    var MongoClient = mongodb.MongoClient;
  
    var url = "mongodb://localhost:27017/";
  
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("pet&go");
  
      dbo.collection("ogloszenia").find({ _id: ObjectID(id) }).toArray(function (err, doc) {
        if (err) throw err;
        res.render('ogloszenieLogedin', { doc: doc[0] });
        db.close()
      });
    });
  
  })
  

router.post('/insertOgloszenie', function (req, res) {
    var MongoClient = mongodb.MongoClient;

    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        var currentdate = new Date();
        var datetime = currentdate.getFullYear() + "-"
            + (currentdate.getMonth() + 1) + "-"
            + currentdate.getDate();

        var dbo = db.db("pet&go");
        var bodyJ = req.body.data;
        var resultArrray = [];

        if (bodyJ.user != null) {
            var cursor = dbo.collection("users").find({ userName: bodyJ.user });

            cursor.forEach(function (result, err) {
                if (err) throw err;
                resultArrray.push(result);

            }, function () {
                var myobj = { datadod: datetime, tytul: bodyJ.tytul, opis: bodyJ.opis, photo: bodyJ.photo, userID: resultArrray[0]._id, data: bodyJ.data, telephone: bodyJ.telephone * 1, email: resultArrray[0].Email, czasod: bodyJ.czasod, czasdo: bodyJ.czasdo, miasto: bodyJ.miasto };

                dbo.collection("ogloszenia").insertOne(myobj, function (err, result) {
                    if (err) res.json({ result: true });
                    res.json({ result: true });
                    db.close();
                });
            });

        } else {

            var myobj = { datadod: datetime, tytul: bodyJ.tytul, opis: bodyJ.opis, photo: bodyJ.photo, userID: "", data: bodyJ.data, telephone: bodyJ.telephone * 1, email: "", czasod: bodyJ.czasod, czasdo: bodyJ.czasdo, miasto: bodyJ.miasto };
            dbo.collection("ogloszenia").insertOne(myobj, function (err, result) {

                if (err) res.json({ result: true });
                res.json({ result: true });
                db.close();
            });
        }
    });
})

module.exports = router;
