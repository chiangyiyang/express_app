var express = require('express');
var router = express.Router();

/* Add model page. */
router.get('/add_model', function (req, res, next) {
  res.render('add_model', { title: 'Add a model!!!' });
});

/* GET models listing. */
router.get('/', function (req, res, next) {
  var sqlite3 = require('sqlite3').verbose();
  var db = new sqlite3.Database('./model.db');

  db.all('SELECT rowid AS id, name, lat, lon, url FROM model', function (err, rows) {
    // res.json(rows);
    res.render('model_list', { models: rows });
  });

  db.close();
});



/* Rebuild Table */
router.get('/rebuild', function (req, res, next) {

  var sqlite3 = require('sqlite3').verbose();
  var db = new sqlite3.Database('./model.db');

  db.serialize(function () {
    db.run('DROP TABLE IF EXISTS model');
    db.run('CREATE TABLE model (name TEXT, lat REAL, lon REAL, url TEXT)');
  });
  db.close();

  res.send("Table model is rebuild.");
});


/* SQLite3 test */
router.get('/test', function (req, res, next) {

  var sqlite3 = require('sqlite3').verbose();
  // var db = new sqlite3.Database(':memory:');
  var db = new sqlite3.Database('./model.db');

  db.serialize(function () {

    db.run('DROP TABLE IF EXISTS model');
    db.run('CREATE TABLE model (name TEXT, lat REAL, lon REAL, url TEXT)');
    var stmt = db.prepare('INSERT INTO model VALUES (?,?,?,?)');

    for (var i = 0; i < 10; i++) {
      stmt.run('model ' + i, '23.45' + i, '121.34' + i, 'url...' + i);
    }

    stmt.finalize();

    db.each('SELECT rowid AS id, name, lat, lon, url FROM model', function (err, row) {
      console.log(row.id + ': ' + row.name + ", " + row.lat + ", " + row.lon + ", " + row.url);
    });
  });

  db.close();
  res.send("Test");
});


/* POST a model data */
router.post('/', function (req, res) {
  var sqlite3 = require('sqlite3').verbose();
  var db = new sqlite3.Database('./model.db');

  db.serialize(function () {
    var stmt = db.prepare('INSERT INTO model VALUES (?,?,?,?)');
    stmt.run(req.body.name, req.body.lat, req.body.lon, req.body.url);
    stmt.finalize();
  });

  db.close();

  res.send('Got a POST request');
});


/* GET a model data */
router.get('/add', function (req, res) {
  var sqlite3 = require('sqlite3').verbose();
  var db = new sqlite3.Database('./model.db');

  db.serialize(function () {
    var stmt = db.prepare('INSERT INTO model VALUES (?,?,?,?)');
    stmt.run(req.query.name, req.query.lat, req.query.lon, req.query.url);
    stmt.finalize();
  });

  db.close();

  res.send('Got a add request');
});




module.exports = router;
