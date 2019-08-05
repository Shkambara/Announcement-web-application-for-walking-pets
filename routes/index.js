var express = require("express");
var router = express.Router();
var mongodb = require('mongodb');
var assert = require('assert');
var ObjectID = require('mongodb').ObjectID

router.get("/", function (req, res, next) {
    var MongoClient = mongodb.MongoClient;

    var url = "mongodb://localhost:27017/";
    var posts = [];
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("pet&go");

        var cursor = dbo.collection('ogloszenia').find({});
        cursor.forEach(function (doc, err) {
            posts.push(doc);
            assert.equal(null, err);
        }, function () {
            db.close();
            res.render('index', { posts: posts });
        });
    });
})

router.get('/ogloszenie', function (req, res) {
    var id = req.query.id;

    var MongoClient = mongodb.MongoClient;

    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("pet&go");

        dbo.collection("ogloszenia").find({ _id: ObjectID(id) }).toArray(function (err, doc) {
            if (err) throw err;
            res.render('ogloszenie', { doc: doc[0] });
            db.close()
        });
    });
})
module.exports = router;