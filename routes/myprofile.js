var express = require("express");
var router = express.Router();
var mongodb = require('mongodb');
var assert = require('assert');


router.get('/mojeogloszenia', function (req, res) {
    var user = req.query.user;

    var MongoClient = mongodb.MongoClient;

    var url = "mongodb://localhost:27017/";
    var posts = [];
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("pet&go");
        var resultArray = [];
        var cursor = dbo.collection('users').find({ userName: user });
        cursor.forEach(function (doc, err) {
            if (err) throw err;
            resultArray.push(doc);
            assert.equal(null, err);
        }, function () {
            var cursor2 = dbo.collection('ogloszenia').find({ userID: resultArray[0]._id });
            cursor2.forEach(function (doc2, err) {
                if (err) throw err;
                posts.push(doc2)
                assert.equal(null, err);
            }, function () {
                db.close();
                res.render('mojeogloszenia', { posts: posts });
            });
        });
    })
})

router.get('/historiaOgloszen', function (req, res) {

    var user = req.query.user;
    var MongoClient = mongodb.MongoClient;
    var url = "mongodb://localhost:27017/";
    var posts = [];

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("pet&go");
        var resultArray = [];
        var cursor = dbo.collection('users').find({ userName: user });

        cursor.forEach(function (doc, err) {
            if (err) throw err;
            resultArray.push(doc);
            assert.equal(null, err);

        }, function () {
            var cursor2 = dbo.collection('history').find({ userID: resultArray[0]._id });

            cursor2.forEach(function (doc2, err) {
                if (err) throw err;
                posts.push(doc2)
                assert.equal(null, err);
            }, function () {
                db.close();
                res.render('historiaOgloszen', { posts: posts });
            });
        });
    })
});

module.exports = router;
