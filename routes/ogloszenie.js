var express = require("express");
var router = express.Router();
var mongodb = require('mongodb');
var ObjectID = require('mongodb').ObjectID


router.get('/editOgloszenia', function (req, res) {

    var id = req.query.id;
    var MongoClient = mongodb.MongoClient;
    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("pet&go");

        dbo.collection("ogloszenia").find({ _id: ObjectID(id) }).toArray(function (err, doc) {
            if (err) throw err;
            res.render('edytowanieOgloszenia', { doc: doc[0] });
            db.close()
        });
    });
})

router.post('/editOgloszenie', function (req, res) {
    var MongoClient = mongodb.MongoClient;

    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("pet&go");

        var bodyJ = req.body.data;
        var myquery = { _id: ObjectID(bodyJ.id) };
        var newvalues = { $set: { tytul: bodyJ.tytul, opis: bodyJ.opis, photo: bodyJ.photo, data: bodyJ.data, czasod: bodyJ.czasod, czasdo: bodyJ.czasdo, telephone: bodyJ.telephone } };
        dbo.collection("ogloszenia").updateOne(myquery, newvalues, function (err, result) {
            if (err) res.json({ result: false });;
            console.log("1 document updated");
            res.json({ result: true });
            db.close();
        });
    });
})


router.post('/deleteOgloszenie', function (req, res) {
    var MongoClient = mongodb.MongoClient;

    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("pet&go");

        var bodyJ = req.body.data;
        var array = [];
        var myquery = { _id: ObjectID(bodyJ.id) };
        var cursor = dbo.collection("ogloszenia").find(myquery);

        cursor.forEach(function (result, err) {
            if (err) throw err;
            array.push(result);

        }, function () {
            dbo.collection("history").insertOne(array[0]);
            dbo.collection("ogloszenia").deleteOne(myquery);
            res.json({ result: true });
        });
    });
});

module.exports = router;